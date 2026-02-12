import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import gsap from 'gsap';
import { useGlobe3DStore } from '../stores/useGlobe3DStore';
import { geoToCartesian, cartesianToGeo, projectToScreen } from '../utils/coordinates';
import {
  DEFAULT_CONFIG,
  EARTH_TEXTURE_URL,
  GLOBE_GEOMETRY_DETAIL,
  POINTER_SIZE,
  POINTER_SEGMENTS,
  POINTER_COLOR,
  MARKER_SIZE,
  MARKER_SEGMENTS,
  CAMERA_BOUNDS,
  CAMERA_Z_POSITION,
  RAYCASTER_FAR,
  GLOBE_MESH_OPACITY,
  TEXTURE_REPEAT,
} from '../utils/constants';
import type { Globe3DConfig, Globe3DRefs, MarkerPoint, ShaderUniforms } from '../types';

// Import shaders as raw strings
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';

/** Dispose all texture properties on a material, then the material itself. */
function disposeMaterial(material: THREE.Material) {
  for (const key of Object.keys(material)) {
    const value = (material as any)[key];
    if (value instanceof THREE.Texture) value.dispose();
  }
  material.dispose();
}

/** Recursively dispose every geometry and material in a scene graph. */
function disposeScene(root: THREE.Object3D) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else if (child.material) {
        disposeMaterial(child.material);
      }
    }
  });
}

interface UseGlobe3DOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvas3DRef: React.RefObject<HTMLCanvasElement | null>;
  canvas2DRef: React.RefObject<HTMLCanvasElement | null>;
  popupRef: React.RefObject<HTMLDivElement | null>;
  markers?: MarkerPoint[];
  config?: Globe3DConfig;
  onMarkerClick?: (marker: MarkerPoint) => void;
  onGlobeClick?: (coords: { lat: number; long: number }) => void;
}

export function useGlobe3D({
  containerRef,
  canvas3DRef,
  canvas2DRef,
  popupRef,
  markers = [],
  config = {},
  onMarkerClick,
  onGlobeClick,
}: UseGlobe3DOptions) {
  const refs = useRef<Globe3DRefs>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    globe: null,
    globeMesh: null,
    pointer: null,
    clock: null,
    rayCaster: null,
    markers: [],
  });

  const mouseRef = useRef(new THREE.Vector2(-1, -1));
  const pointerPosRef = useRef<THREE.Vector3 | null>(null);
  const draggedRef = useRef(false);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const overlayCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const popupOpenTlRef = useRef<gsap.core.Timeline | null>(null);
  const popupCloseTlRef = useRef<gsap.core.Timeline | null>(null);

  // Use individual selectors instead of entire store
  const isLoading = useGlobe3DStore((s) => s.isLoading);
  const isInteracting = useGlobe3DStore((s) => s.isInteracting);

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const updateSize = useCallback(() => {
    if (!containerRef.current || !refs.current.renderer || !materialRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    refs.current.renderer.setSize(width, height);
    materialRef.current.uniforms.u_dot_size.value = mergedConfig.dotSize * Math.min(width, height);

    if (canvas2DRef.current) {
      canvas2DRef.current.width = width;
      canvas2DRef.current.height = height;
    }
  }, [mergedConfig.dotSize]);

  const createOrbitControls = useCallback(() => {
    if (!refs.current.camera || !refs.current.renderer) return;

    const controls = new OrbitControls(refs.current.camera, refs.current.renderer.domElement);
    controls.enablePan = mergedConfig.enablePan;
    controls.enableZoom = mergedConfig.enableZoom;
    controls.enableDamping = mergedConfig.enableDamping;
    controls.minPolarAngle = mergedConfig.minPolarAngle;
    controls.maxPolarAngle = mergedConfig.maxPolarAngle;
    controls.autoRotate = mergedConfig.autoRotate;
    controls.autoRotateSpeed = mergedConfig.autoRotateSpeed;

    let timestamp: number;
    controls.addEventListener('start', () => {
      timestamp = Date.now();
      useGlobe3DStore.getState().setInteracting(true);
    });
    controls.addEventListener('end', () => {
      draggedRef.current = Date.now() - timestamp > 200;
      useGlobe3DStore.getState().setInteracting(false);
    });

    refs.current.controls = controls as unknown as THREE.Object3D;
    return controls;
  }, [mergedConfig]);

  const createGlobe = useCallback(
    (texture: THREE.Texture) => {
      if (!refs.current.scene) return;

      const globeGeometry = new THREE.IcosahedronGeometry(1, GLOBE_GEOMETRY_DETAIL);

      const uniforms: ShaderUniforms = {
        u_map_tex: { value: texture },
        u_dot_size: { value: 0.0 },
        u_pointer: { value: new THREE.Vector3(0, 0, 1) },
        u_time_since_click: { value: 0.0 },
      };

      const mapMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        alphaTest: 0,
        transparent: true,
      });

      materialRef.current = mapMaterial;

      const globe = new THREE.Points(globeGeometry, mapMaterial);
      refs.current.globe = globe;
      refs.current.scene.add(globe);

      const globeMesh = new THREE.Mesh(
        globeGeometry,
        new THREE.MeshBasicMaterial({
          color: mergedConfig.globeColor,
          transparent: true,
          opacity: GLOBE_MESH_OPACITY,
        })
      );
      refs.current.globeMesh = globeMesh;
      refs.current.scene.add(globeMesh);
    },
    [mergedConfig.globeColor]
  );

  const createPointer = useCallback(() => {
    if (!refs.current.scene) return;

    const geometry = new THREE.SphereGeometry(POINTER_SIZE, POINTER_SEGMENTS, POINTER_SEGMENTS);
    const material = new THREE.MeshBasicMaterial({
      color: POINTER_COLOR,
      transparent: true,
      opacity: 0,
    });
    const pointer = new THREE.Mesh(geometry, material);
    refs.current.pointer = pointer;
    refs.current.scene.add(pointer);
  }, []);

  const addMarkers = useCallback(() => {
    if (!refs.current.scene) return;

    // Clear existing markers
    refs.current.markers.forEach((marker) => {
      refs.current.scene?.remove(marker);
    });
    refs.current.markers = [];

    const markerGeometry = new THREE.SphereGeometry(MARKER_SIZE, MARKER_SEGMENTS, MARKER_SEGMENTS);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: mergedConfig.markerColor });

    markers.forEach((point) => {
      const position = geoToCartesian(point.lat, point.long);
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = point;
      refs.current.scene?.add(marker);
      refs.current.markers.push(marker);
    });
  }, [markers, mergedConfig.markerColor]);

  const checkIntersects = useCallback(() => {
    if (!refs.current.rayCaster || !refs.current.camera || !refs.current.globeMesh) {
      return [];
    }

    refs.current.rayCaster.setFromCamera(mouseRef.current, refs.current.camera);
    const intersects = refs.current.rayCaster.intersectObject(refs.current.globeMesh);

    if (containerRef.current) {
      containerRef.current.style.cursor = intersects.length ? 'pointer' : 'auto';
    }

    return intersects;
  }, []);

  const createPopupTimelines = useCallback(() => {
    if (!refs.current.pointer || !canvas2DRef.current || !popupRef.current) return;

    const pointerMaterial = refs.current.pointer.material as THREE.MeshBasicMaterial;

    popupOpenTlRef.current = gsap
      .timeline({ paused: true })
      .to(pointerMaterial, { duration: 0.2, opacity: 1 }, 0)
      .fromTo(canvas2DRef.current, { opacity: 0 }, { duration: 0.3, opacity: 1 }, 0.15)
      .fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.9, transformOrigin: 'center bottom' },
        { duration: 0.1, opacity: 1, scale: 1 },
        0.25
      );

    popupCloseTlRef.current = gsap
      .timeline({ paused: true })
      .to(pointerMaterial, { duration: 0.3, opacity: 0.2 }, 0)
      .to(canvas2DRef.current, { duration: 0.3, opacity: 0 }, 0)
      .to(
        popupRef.current,
        { duration: 0.3, opacity: 0, scale: 0.9, transformOrigin: 'center bottom' },
        0
      );
  }, []);

  const showPopupAnimation = useCallback((lifted: boolean) => {
    if (!refs.current.pointer) return;

    if (lifted) {
      const positionLifted = refs.current.pointer.position.clone().multiplyScalar(1.3);
      gsap.from(refs.current.pointer.position, {
        duration: 0.25,
        x: positionLifted.x,
        y: positionLifted.y,
        z: positionLifted.z,
        ease: 'power3.out',
      });
    }

    popupCloseTlRef.current?.pause(0);
    popupOpenTlRef.current?.play(0);
  }, []);

  const updateOverlayGraphic = useCallback(() => {
    if (!refs.current.pointer || !refs.current.globe || !refs.current.camera || !containerRef.current) {
      return;
    }

    const activePointPosition = refs.current.pointer.position.clone();
    activePointPosition.applyMatrix4(refs.current.globe.matrixWorld);

    const [x2d, y2d] = projectToScreen(
      activePointPosition,
      refs.current.camera,
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    useGlobe3DStore.getState().setCoordinates2D([x2d, y2d]);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current || draggedRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.pageX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.pageY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      mouseRef.current.x = ((clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

      const intersects = checkIntersects();
      if (intersects.length && refs.current.pointer && materialRef.current && refs.current.clock) {
        const normal = intersects[0].face?.normal;
        if (!normal) return;

        pointerPosRef.current = normal.clone();
        refs.current.pointer.position.set(normal.x, normal.y, normal.z);
        materialRef.current.uniforms.u_pointer.value = normal;

        const coords = cartesianToGeo(refs.current.pointer.position);
        onGlobeClick?.(coords);

        if (popupRef.current) {
          popupRef.current.innerHTML = `${coords.lat.toFixed(4)}\u00B0 ${coords.lat >= 0 ? 'N' : 'S'}, ${Math.abs(coords.long).toFixed(4)}\u00B0 ${coords.long >= 0 ? 'E' : 'W'}`;
        }

        showPopupAnimation(true);
        refs.current.clock.start();
      }
    },
    [checkIntersects, onGlobeClick, showPopupAnimation]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
  }, []);

  const triggerHoverDistortion = useCallback(() => {
    if (!materialRef.current || !refs.current.clock) return;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    materialRef.current.uniforms.u_pointer.value.set(x, y, z);
    refs.current.clock.start();
  }, []);

  const handleMouseEnter = useCallback(() => {
    useGlobe3DStore.getState().setHovered(true);
    triggerHoverDistortion();
  }, [triggerHoverDistortion]);

  const handleMouseLeave = useCallback(() => {
    useGlobe3DStore.getState().setHovered(false);
  }, []);

  const render = useCallback(() => {
    if (!refs.current.renderer || !refs.current.scene || !refs.current.camera || !materialRef.current) {
      return;
    }

    const { isPaused } = useGlobe3DStore.getState();

    if (!isPaused) {
      if (refs.current.clock) {
        materialRef.current.uniforms.u_time_since_click.value = refs.current.clock.getElapsedTime();
      }

      checkIntersects();

      if (refs.current.pointer) {
        updateOverlayGraphic();
      }

      const controls = refs.current.controls as unknown as OrbitControls;
      controls?.update();

      refs.current.renderer.render(refs.current.scene, refs.current.camera);
    }

    animationFrameRef.current = requestAnimationFrame(render);
  }, [checkIntersects, updateOverlayGraphic]);

  // Initialize scene
  useEffect(() => {
    if (!canvas3DRef.current || !containerRef.current || !canvas2DRef.current) return;

    const store = useGlobe3DStore.getState();
    store.setLoading(true);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas3DRef.current,
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    refs.current.renderer = renderer;

    // Setup scene
    const scene = new THREE.Scene();
    refs.current.scene = scene;

    // Setup camera
    const camera = new THREE.OrthographicCamera(
      CAMERA_BOUNDS.left,
      CAMERA_BOUNDS.right,
      CAMERA_BOUNDS.top,
      CAMERA_BOUNDS.bottom,
      CAMERA_BOUNDS.near,
      CAMERA_BOUNDS.far
    );
    camera.position.z = CAMERA_Z_POSITION;
    refs.current.camera = camera;

    // Setup raycaster
    const rayCaster = new THREE.Raycaster();
    rayCaster.far = RAYCASTER_FAR;
    refs.current.rayCaster = rayCaster;

    // Setup clock
    refs.current.clock = new THREE.Clock();

    // Setup 2D overlay context
    overlayCtxRef.current = canvas2DRef.current.getContext('2d');

    // Create controls
    createOrbitControls();

    // Load texture and create globe
    const loader = new THREE.TextureLoader();
    loader.load(EARTH_TEXTURE_URL, (mapTex) => {
      mapTex.repeat.set(TEXTURE_REPEAT.x, TEXTURE_REPEAT.y);

      createGlobe(mapTex);
      createPointer();
      addMarkers();
      createPopupTimelines();
      updateSize();

      useGlobe3DStore.getState().setLoading(false);
      render();
    });

    // Event listeners
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick as EventListener);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updateSize(), 150);
    };
    window.addEventListener('resize', handleResize);

    // Page Visibility API
    const handleVisibilityChange = () => {
      useGlobe3DStore.getState().setPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // WebGL context loss / recovery
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    const onContextRestored = () => {
      render();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    return () => {
      clearTimeout(resizeTimer);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick as EventListener);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      // Complete recursive disposal (instead of scene.clear())
      disposeScene(scene);
      materialRef.current?.dispose();
      renderer.dispose();

      popupOpenTlRef.current?.kill();
      popupCloseTlRef.current?.kill();

      useGlobe3DStore.getState().reset();
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!isLoading) {
      addMarkers();
    }
  }, [markers, isLoading, addMarkers]);

  return {
    refs: refs.current,
    isLoading,
    isInteracting,
  };
}
