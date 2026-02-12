import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { useGemStore } from '../../../../stores/threeJSStore';
import { RobustAssetLoader, ASSET_CONFIGS } from '../../../../utils/assetLoader';
import { useScroll, useTransform } from 'motion/react';

// Module-level loader instances (reused across mounts)
const rgbeLoader = new RGBELoader();
const objectLoader = new THREE.ObjectLoader();

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
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else if (child.material) {
        disposeMaterial(child.material);
      }
    }
  });
}

export const GemBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    gem: THREE.Object3D | null;
    envMap: THREE.Texture | null;
    hdrTexture: THREE.DataTexture | null;
  } | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const scrollRotation = useRef({ x: 0, y: 0, z: 0 });

  // Minimal store selectors — only what triggers re-renders
  const quality = useGemStore((s) => s.quality);
  const setVisible = useGemStore((s) => s.setVisible);
  const setPaused = useGemStore((s) => s.setPaused);

  // Motion.dev scroll setup
  const { scrollYProgress } = useScroll();
  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.5]);
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, -Math.PI * 1]);
  const rotationZ = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.75]);

  // Scroll values -> refs (zero store overhead, zero re-renders)
  useEffect(() => {
    const unsubX = rotationX.on('change', (v) => { scrollRotation.current.x = v; });
    const unsubY = rotationY.on('change', (v) => { scrollRotation.current.y = v; });
    const unsubZ = rotationZ.on('change', (v) => { scrollRotation.current.z = v; });
    return () => { unsubX(); unsubY(); unsubZ(); };
  }, [rotationX, rotationY, rotationZ]);

  // Force visible on mount
  useEffect(() => {
    setVisible(true);
  }, [setVisible]);

  // Intersection Observer — delayed to let initial load settle
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { threshold: 0, rootMargin: '2000px 0px 2000px 0px' }
      );
      if (mountRef.current) observer.observe(mountRef.current);
    }, 500);
    return () => { clearTimeout(timer); observer?.disconnect(); };
  }, [setVisible]);

  // Page Visibility API
  useEffect(() => {
    const handler = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [setPaused]);

  // ─── Three.js scene setup ───────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene & Camera (tightened near/far for depth precision)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.5,
      20
    );
    camera.position.set(0, 0, 4);

    // Renderer with adaptive pixel ratio per quality tier
    const maxPixelRatio = quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2;
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = quality !== 'low';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = quality !== 'low';
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0xb8a3ff, 0.8);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    sceneRef.current = {
      scene, camera, renderer,
      gem: null, envMap: null, hdrTexture: null,
    };

    // ── Animation callback ──
    const scroll = scrollRotation;
    const animateCallback = () => {
      const gem = sceneRef.current?.gem;
      if (gem) {
        gem.rotation.x = 0.2 + scroll.current.x;
        gem.rotation.y = -0.35 + scroll.current.y;
        gem.rotation.z = -0.32 + scroll.current.z;
      }
      renderer.render(scene, camera);
    };

    // Start / stop loop based on store state
    const syncAnimationLoop = () => {
      const { isVisible, isPaused } = useGemStore.getState();
      if (isVisible && !isPaused && sceneRef.current?.gem) {
        renderer.setAnimationLoop(animateCallback);
      } else {
        renderer.setAnimationLoop(null);
      }
    };

    // Subscribe to visibility / pause changes
    const unsubscribeStore = useGemStore.subscribe((state, prev) => {
      if (state.isVisible !== prev.isVisible || state.isPaused !== prev.isPaused) {
        syncAnimationLoop();
      }
    });

    // ── Load HDR environment ──
    RobustAssetLoader.loadWithRetry(
      (url) =>
        new Promise<THREE.DataTexture>((resolve, reject) => {
          rgbeLoader.load(url, resolve, undefined, reject);
        }),
      ASSET_CONFIGS.GEM_HDR,
      { retries: 3, verbose: true }
    )
      .then((hdr) => {
        if (!hdr || !sceneRef.current) return;
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        hdr.generateMipmaps = quality !== 'low';
        try {
          const pmrem = new THREE.PMREMGenerator(renderer);
          const envMap = pmrem.fromEquirectangular(hdr).texture;
          scene.environment = envMap;
          sceneRef.current.hdrTexture = hdr;
          sceneRef.current.envMap = envMap;
          pmrem.dispose();
        } catch (err) {
          console.error('Failed to create envMap:', err);
        }
      })
      .catch((err) => console.error('Failed to load HDR:', err));

    // ── Material factory ──
    const createGemMaterial = (): THREE.Material => {
      // LOW: cheaper MeshStandardMaterial (no transmission/clearcoat)
      if (quality === 'low') {
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color('#ffffff'),
          roughness: 0.1,
          metalness: 0.3,
          envMapIntensity: 1.5,
        });
      }

      const base = {
        transmission: 1.0,
        thickness: 4.2,
        ior: 2.4,
        roughness: 0.0,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        reflectivity: 1.0,
        attenuationDistance: 0.5,
        attenuationColor: new THREE.Color('#b8a3ff'),
        color: new THREE.Color('#ffffff'),
      };

      // HIGH: full iridescence + sheen
      if (quality === 'high') {
        return new THREE.MeshPhysicalMaterial({
          ...base,
          envMapIntensity: 3.0,
          sheen: 1,
          sheenColor: new THREE.Color('#ffffff'),
          sheenRoughness: 0.1,
          iridescence: 1.0,
          iridescenceIOR: 1.5,
          iridescenceThicknessRange: [200, 600] as [number, number],
        });
      }

      // MEDIUM: moderate iridescence
      return new THREE.MeshPhysicalMaterial({
        ...base,
        envMapIntensity: 2.0,
        iridescence: 0.5,
        iridescenceIOR: 1.3,
      });
    };

    // ── Load gem model ──
    RobustAssetLoader.loadWithRetry(
      (url) =>
        new Promise<THREE.Object3D>((resolve, reject) => {
          objectLoader.load(url, resolve, undefined, reject);
        }),
      ASSET_CONFIGS.GEM_MODEL,
      { retries: 3, verbose: true }
    )
      .then((object) => {
        if (!object || !sceneRef.current) return;
        const mat = createGemMaterial();
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = mat;
            child.castShadow = quality !== 'low';
            child.receiveShadow = quality !== 'low';
          }
        });
        object.scale.set(3.66, 3.66, 3.66);
        object.position.set(3.5, -0.5, -4);
        object.rotation.set(0.2, -0.35, -0.32);
        scene.add(object);
        sceneRef.current.gem = object;
        setIsLoaded(true);
        syncAnimationLoop();
      })
      .catch((err) => console.error('Failed to load gem model:', err));

    // ── Debounced resize ──
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!currentMount || !sceneRef.current) return;
        const { clientWidth: w, clientHeight: h } = currentMount;
        sceneRef.current.camera.aspect = w / h;
        sceneRef.current.camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // ── WebGL context loss / recovery ──
    const onContextLost = (e: Event) => {
      e.preventDefault();
      renderer.setAnimationLoop(null);
    };
    const onContextRestored = () => syncAnimationLoop();
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // ── Cleanup ──
    return () => {
      clearTimeout(resizeTimer);
      unsubscribeStore();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      renderer.setAnimationLoop(null);

      // Complete recursive disposal
      disposeScene(scene);
      sceneRef.current?.envMap?.dispose();
      sceneRef.current?.hdrTexture?.dispose();

      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [quality]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ zIndex: 20, mixBlendMode: 'normal' }}
    />
  );
};

export default GemBackground;
