import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { detectQuality, type QualityLevel } from '../../../stores/threeJSStore';
import { RobustAssetLoader, ASSET_CONFIGS } from '../../../utils/assetLoader';
import { observeDarkMode } from '../../../utils/darkMode';

// Module-level loader instances (reused across mounts)
const rgbeLoader = new RGBELoader();
const objectLoader = new THREE.ObjectLoader();

// Detect quality once at module level
const quality: QualityLevel =
  typeof window !== 'undefined' ? detectQuality() : 'medium';

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

export const CubeBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Per-instance state (non-reactive — read in animation loop / scroll handler only)
  const stateRef = useRef({
    isVisible: false,
    isPaused: false,
  });

  // Scene refs for scroll handler access
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    cube: THREE.Object3D | null;
    envMap: THREE.Texture | null;
    hdrTexture: THREE.DataTexture | null;
  } | null>(null);

  // Single effect: create scene once, control rendering internally.
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const state = stateRef.current;

    // ── Scene ──
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

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(0, 1, 8);
    dirLight.castShadow = quality !== 'low';
    if (quality !== 'low') {
      const shadowSize = quality === 'high' ? 1024 : 512;
      dirLight.shadow.mapSize.width = shadowSize;
      dirLight.shadow.mapSize.height = shadowSize;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 15;
      dirLight.shadow.camera.left = -4;
      dirLight.shadow.camera.right = 4;
      dirLight.shadow.camera.top = 4;
      dirLight.shadow.camera.bottom = -4;
      dirLight.shadow.radius = 10;
      dirLight.shadow.blurSamples = 15;
    }
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xb8a3ff, 0.2);
    pointLight.position.set(1, 0, 6);
    scene.add(pointLight);

    // Shadow ground (only when shadows enabled)
    if (quality !== 'low') {
      const groundGeometry = new THREE.PlaneGeometry(8, 8);
      const groundMaterial = new THREE.ShadowMaterial({
        opacity: 0.03,
        transparent: true,
      });
      const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
      groundPlane.rotation.x = -Math.PI / 2;
      groundPlane.position.y = -1.2;
      groundPlane.receiveShadow = true;
      scene.add(groundPlane);
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      cube: null,
      envMap: null,
      hdrTexture: null,
    };

    // ── Scroll-based rendering (render on demand, not continuous) ──
    let scrollRafId: ReturnType<typeof requestAnimationFrame> | null = null;

    const renderOnce = () => {
      if (sceneRef.current?.cube) {
        renderer.render(scene, camera);
      }
    };

    const updateRotationFromScroll = () => {
      if (!state.isVisible || state.isPaused || !sceneRef.current?.cube) return;

      // Throttle: only one RAF per scroll event batch
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        if (!sceneRef.current?.cube || !state.isVisible || state.isPaused) return;

        const scrollProgress = window.scrollY * 0.001;
        sceneRef.current.cube.rotation.x = 0.1 + scrollProgress * 0.5;
        sceneRef.current.cube.rotation.y = 0.2 + scrollProgress * 0.8;
        sceneRef.current.cube.rotation.z = 0.1 + scrollProgress * 0.3;

        renderer.render(scene, camera);
      });
    };

    window.addEventListener('scroll', updateRotationFromScroll, { passive: true });

    // ── Visibility: Intersection + Dark Mode ──
    let isIntersecting = false;

    const updateVisibility = () => {
      const isDark = document.documentElement.classList.contains('dark-mode');
      state.isVisible = !isDark && isIntersecting;

      // Render once when becoming visible
      if (state.isVisible && sceneRef.current?.cube) {
        updateRotationFromScroll();
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0, rootMargin: '800px 0px 200px 0px' }
    );
    intersectionObserver.observe(currentMount);

    const cleanupDarkMode = observeDarkMode(() => updateVisibility());

    // Page Visibility API
    const handleVisibilityChange = () => {
      state.isPaused = document.hidden;
      if (!document.hidden && state.isVisible) {
        updateRotationFromScroll();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── Load HDR environment ──
    RobustAssetLoader.loadWithRetry(
      (url) =>
        new Promise<THREE.DataTexture>((resolve, reject) => {
          rgbeLoader.load(url, resolve, undefined, reject);
        }),
      ASSET_CONFIGS.CUBE_HDR,
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
    const createCubeMaterial = (): THREE.Material => {
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

      return new THREE.MeshPhysicalMaterial({
        ...base,
        envMapIntensity: 2.0,
        iridescence: 0.5,
        iridescenceIOR: 1.3,
      });
    };

    // ── Load cube model ──
    RobustAssetLoader.loadWithRetry(
      (url) =>
        new Promise<THREE.Object3D>((resolve, reject) => {
          objectLoader.load(url, resolve, undefined, reject);
        }),
      ASSET_CONFIGS.CUBE_MODEL,
      { retries: 3, verbose: true }
    )
      .then((object) => {
        if (!object || !sceneRef.current) return;
        const mat = createCubeMaterial();
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = mat;
            child.castShadow = quality !== 'low';
            child.receiveShadow = quality !== 'low';
          }
        });

        object.scale.set(0.8, 0.8, 0.8);
        object.position.set(0, 0, 0);
        object.rotation.set(0.1, 0.2, 0.1);
        scene.add(object);
        sceneRef.current.cube = object;

        setIsLoaded(true);

        // Initial render based on current scroll position
        if (state.isVisible) {
          const scrollProgress = window.scrollY * 0.001;
          object.rotation.x = 0.1 + scrollProgress * 0.5;
          object.rotation.y = 0.2 + scrollProgress * 0.8;
          object.rotation.z = 0.1 + scrollProgress * 0.3;
          renderer.render(scene, camera);
        }
      })
      .catch((err) => console.error('Failed to load cube model:', err));

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
        renderOnce();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    // ── WebGL context loss / recovery ──
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    const onContextRestored = () => {
      if (state.isVisible) renderOnce();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // ── Cleanup ──
    return () => {
      clearTimeout(resizeTimer);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
      intersectionObserver.disconnect();
      cleanupDarkMode();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRotationFromScroll);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

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
  }, []); // No dependencies — scene created once, rendering controlled internally

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ zIndex: 2, mixBlendMode: 'normal' }}
    />
  );
};

export default CubeBackground;
