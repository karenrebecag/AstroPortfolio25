import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import {
  useGemStore,
  useVisibilityState,
  useSettingsState,
  useAnimationState,
  useThreeJSActions
} from '../../../../utils/stores/threeJSStore';
import { RobustAssetLoader, ASSET_CONFIGS } from '../../../../utils/assetLoader';
import { useScroll, useTransform } from 'motion/react';

// ✅ Store moved to utils/stores/threeJSStore.ts for better code organization
// This eliminates ~115 lines of duplicated store logic

export const GemBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    gem: THREE.Object3D | null;
    animationId: number | null;
    material: THREE.Material | null;
    geometry: THREE.BufferGeometry | null;
    hdrTexture: THREE.DataTexture | null;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Using unified store with optimized selectors
  const { isVisible, isPaused, isLoading } = useVisibilityState();
  const { quality, opacity } = useSettingsState();
  const { scrollRotationX, scrollRotationY, scrollRotationZ } = useAnimationState();
  const { setVisible, setPaused, setLoading, setScrollRotation } = useThreeJSActions();

  // Motion.dev scroll velocity setup
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to rotation values (acentuado para más movimiento)
  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.5]); // 90 degrees max (más rotación)
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, -Math.PI * 1]); // 144 degrees max (más rotación)
  const rotationZ = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.75]); // 63 degrees max (más rotación)   
  // Initialize immediately on mount - la gema SIEMPRE debe empezar a cargar
  useEffect(() => {
    // Forzar inicialización completa inmediatamente
    setLoading(false);
    setVisible(true); // Start visible to force initial render
  }, [setLoading, setVisible]);

  // Intersection Observer - controla visibilidad para optimización de render DESPUÉS de la inicialización
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    // Dar tiempo para que la gema se inicialice antes de aplicar observer
    const initTimeout = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting);
        },
        {
          threshold: 0,
          rootMargin: '2000px 0px 2000px 0px' // MUCHO más amplio: casi siempre visible
        }
      );

      if (mountRef.current) {
        observer.observe(mountRef.current);
      }
    }, 500); // Esperar 500ms después de montar para aplicar observer

    return () => {
      clearTimeout(initTimeout);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [setVisible]);

  // Page Visibility API - optimizado con acciones memoizadas
  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setPaused]);

  // Three.js setup - initialize once and keep mounted
  // Visibility is controlled by the animate loop, not by mounting/unmounting
  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Renderer setup con MISMAS optimizaciones que SilkBackground
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = quality !== 'low';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lighting setup optimizado para gema
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = quality !== 'low';
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xb8a3ff, 0.8);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    let gemObject: THREE.Object3D | null = null;

    // Load HDR environment using RobustAssetLoader
    RobustAssetLoader.loadWithRetry(
      (url: string) => new Promise<THREE.DataTexture>((resolve, reject) => {
        new RGBELoader().load(url, resolve, undefined, reject);
      }),
      ASSET_CONFIGS.GEM_HDR,
      { retries: 3, verbose: true }
    ).then((hdr) => {
      if (!hdr) {
        console.warn('HDR texture is null, skipping environment setup');
        return;
      }

      hdr.mapping = THREE.EquirectangularReflectionMapping;
      hdr.generateMipmaps = quality !== 'low';

      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;

        // Store HDR texture reference for cleanup
        if (sceneRef.current) {
          sceneRef.current.hdrTexture = hdr;
        }

        pmrem.dispose();
      } catch (error) {
        console.error('Failed to create envMap:', error);
      }
    }).catch((error) => {
      console.error('Failed to load HDR:', error);
    });

    // Crear material optimizado según calidad
    const createGemMaterial = () => {
      const baseConfig = {
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

      // Quality-based optimizations - siguiendo la guía
      switch (quality) {
        case 'low':
          return new THREE.MeshPhysicalMaterial({
            ...baseConfig,
            envMapIntensity: 1.5,
            roughness: 0.1,
            clearcoat: 0.5,
          });
        case 'high':
          return new THREE.MeshPhysicalMaterial({
            ...baseConfig,
            envMapIntensity: 3.0,
            sheen: 1,
            sheenColor: new THREE.Color('#ffffff'),
            sheenRoughness: 0.1,
            iridescence: 1.0,
            iridescenceIOR: 1.5,
            iridescenceThicknessRange: [200, 600] as [number, number],
          });
        default: // medium
          return new THREE.MeshPhysicalMaterial({
            ...baseConfig,
            envMapIntensity: 2.0,
            iridescence: 0.5,
            iridescenceIOR: 1.3,
          });
      }
    };

    // Load gem model using RobustAssetLoader
    RobustAssetLoader.loadWithRetry(
      (url: string) => new Promise<THREE.Object3D>((resolve, reject) => {
        new THREE.ObjectLoader().load(url, resolve, undefined, reject);
      }),
      ASSET_CONFIGS.GEM_MODEL,
      { retries: 3, verbose: true }
    ).then((object) => {
      if (!object) {
        console.warn('Gem model is null, skipping');
        return;
      }

      gemObject = object;
      const gemMaterial = createGemMaterial();

      // Apply material to loaded object and store references
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          // Store geometry and material references for cleanup
          if (sceneRef.current) {
            if (!sceneRef.current.geometry && child.geometry) {
              sceneRef.current.geometry = child.geometry;
            }
            if (!sceneRef.current.material) {
              sceneRef.current.material = gemMaterial;
            }
          }

          child.material = gemMaterial;
          child.castShadow = quality !== 'low';
          child.receiveShadow = quality !== 'low';
        }
      });

      // Position and scale - optimizado para la sección
      object.scale.set(3.66, 3.66, 3.66);
      object.position.set(3.5, -0.5, -4);
      object.rotation.set(0.2, -0.35, -0.32);

      scene.add(object);

      // Update sceneRef with loaded gem
      if (sceneRef.current) {
        sceneRef.current.gem = object;
      }
    }).catch((error) => {
      console.error('Failed to load gem model:', error);
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      gem: gemObject,
      animationId: null,
      material: null,
      geometry: null,
      hdrTexture: null
    };

    const animate = () => {
      const currentState = useGemStore.getState();

      if (!currentState.isPaused && currentState.isVisible && gemObject) {
        // Apply scroll-based rotation (very subtle) while maintaining original positioning
        gemObject.rotation.x = 0.2 + currentState.scrollRotationX;
        gemObject.rotation.y = -0.35 + currentState.scrollRotationY;
        gemObject.rotation.z = -0.32 + currentState.scrollRotationZ;

        renderer.render(scene, camera);
      }

      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    // Start animation inmediatamente si ya está visible, sino con delay suave
    const startDelay = useGemStore.getState().isVisible ? 50 : 300;
    const timer = setTimeout(() => {
      setIsLoaded(true);
      animate();
    }, startDelay);

    // Resize handler
    const handleResize = () => {
      if (!currentMount || !sceneRef.current) return;
      
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Subscribe to scroll rotation changes
    const unsubscribeRotationX = rotationX.on('change', (value) => {
      const currentState = useGemStore.getState();
      setScrollRotation(value, currentState.scrollRotationY, currentState.scrollRotationZ);
    });
    
    const unsubscribeRotationY = rotationY.on('change', (value) => {
      const currentState = useGemStore.getState();
      setScrollRotation(currentState.scrollRotationX, value, currentState.scrollRotationZ);
    });
    
    const unsubscribeRotationZ = rotationZ.on('change', (value) => {
      const currentState = useGemStore.getState();
      setScrollRotation(currentState.scrollRotationX, currentState.scrollRotationY, value);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      // Unsubscribe from motion values
      unsubscribeRotationX();
      unsubscribeRotationY();
      unsubscribeRotationZ();
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }

        // Cleanup completo - siguiendo ThreeModelsStandard.md
        // 1. Dispose material
        if (sceneRef.current.material) {
          sceneRef.current.material.dispose();
        }

        // 2. Dispose geometry
        if (sceneRef.current.geometry) {
          sceneRef.current.geometry.dispose();
        }

        // 3. Dispose HDR texture
        if (sceneRef.current.hdrTexture) {
          sceneRef.current.hdrTexture.dispose();
        }

        // 4. Dispose renderer
        sceneRef.current.renderer.dispose();

        // 5. Remove DOM element
        if (currentMount.contains(sceneRef.current.renderer.domElement)) {
          currentMount.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [quality, setLoading, rotationX, rotationY, rotationZ, setScrollRotation]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded && !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{
        zIndex: 20, // Por encima de SilkBackground (z-index: 1)
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default GemBackground;
