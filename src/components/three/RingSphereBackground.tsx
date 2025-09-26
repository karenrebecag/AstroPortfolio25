import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createThreeJSCleanup } from '../../utils/zustand-optimizations';
import { useScroll, useTransform, useMotionValue } from 'motion/react';

// Optimized Zustand store siguiendo mejores prácticas de la guía
// Dividido en slices por funcionalidad para evitar re-renders innecesarios
const useRingSphereStore = create<{
  // Visibility slice - para control de renderizado
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;

  // Settings slice - para configuración que cambia poco
  opacity: number;
  quality: 'low' | 'medium' | 'high';

  // Animation slice - para propiedades de animación basadas en scroll
  scrollRotationX: number;
  scrollRotationY: number;
  scrollRotationZ: number;

  // Actions - memoizadas para evitar recreación
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setScrollRotation: (x: number, y: number, z: number) => void;

  // Batch updater para múltiples cambios
  batchUpdate: (updates: Partial<{
    isVisible: boolean;
    isPaused: boolean;
    isLoading: boolean;
    opacity: number;
    quality: 'low' | 'medium' | 'high';
    scrollRotationX: number;
    scrollRotationY: number;
    scrollRotationZ: number;
  }>) => void;
}>((set, get) => ({
  // Initial state
  isVisible: false,
  isPaused: false,
  isLoading: true,
  opacity: 0,
  quality: 'medium',
  scrollRotationX: 0,
  scrollRotationY: 0,
  scrollRotationZ: 0,

  // Optimized actions con batch updates cuando es posible
  setVisible: (visible) => {
    const currentState = get();
    if (currentState.isVisible === visible) return; // Evita updates innecesarios

    set({ isVisible: visible });

    // Smooth opacity transition con batch update
    if (visible) {
      setTimeout(() => {
        const state = get();
        if (state.isVisible) { // Double-check para evitar race conditions
          set({ opacity: 1 });
        }
      }, 200);
    } else {
      setTimeout(() => set({ opacity: 0 }), 100);
    }
  },

  setPaused: (paused) => {
    const currentState = get();
    if (currentState.isPaused === paused) return;
    set({ isPaused: paused });
  },

  setLoading: (loading) => {
    const currentState = get();
    if (currentState.isLoading === loading) return;
    set({ isLoading: loading });
  },

  setOpacity: (opacity) => {
    const currentState = get();
    if (currentState.opacity === opacity) return;
    set({ opacity });
  },

  setQuality: (quality) => {
    const currentState = get();
    if (currentState.quality === quality) return;
    set({ quality });
  },

  setScrollRotation: (x, y, z) => {
    const currentState = get();
    if (currentState.scrollRotationX === x && currentState.scrollRotationY === y && currentState.scrollRotationZ === z) return;
    set({ scrollRotationX: x, scrollRotationY: y, scrollRotationZ: z });
  },

  // Batch updater para múltiples cambios simultáneos
  batchUpdate: (updates) => {
    const currentState = get();
    const filteredUpdates: Partial<typeof currentState> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (currentState[key as keyof typeof currentState] !== value) {
        (filteredUpdates as any)[key] = value;
      }
    });

    if (Object.keys(filteredUpdates).length > 0) {
      set(filteredUpdates);
    }
  },
}));

export const RingSphereBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ringSphere: THREE.Object3D | null;
    animationId: number | null;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Selectores optimizados con useShallow - evita re-renders innecesarios
  // Siguiendo las mejores prácticas de la documentación oficial de Zustand
  const { isVisible, isPaused, isLoading } = useRingSphereStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      isPaused: state.isPaused,
      isLoading: state.isLoading,
    }))
  );

  const { quality, opacity } = useRingSphereStore(
    useShallow((state) => ({
      quality: state.quality,
      opacity: state.opacity,
    }))
  );

  const { scrollRotationX, scrollRotationY, scrollRotationZ } = useRingSphereStore(
    useShallow((state) => ({
      scrollRotationX: state.scrollRotationX,
      scrollRotationY: state.scrollRotationY,
      scrollRotationZ: state.scrollRotationZ,
    }))
  );

  // Actions memoizadas - solo se extraen cuando es necesario
  const { setVisible, setPaused, setLoading, batchUpdate, setScrollRotation } = useRingSphereStore(
    useShallow((state) => ({
      setVisible: state.setVisible,
      setPaused: state.setPaused,
      setLoading: state.setLoading,
      batchUpdate: state.batchUpdate,
      setScrollRotation: state.setScrollRotation,
    }))
  );

  const cleanup = useMemo(() => createThreeJSCleanup(), []);

  // Motion.dev scroll velocity setup
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to rotation values (more evident, rotating right)
  const rotationX = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.25]); // 45 degrees max
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, -Math.PI * 0.5]); // 90 degrees max (right rotation)  
  const rotationZ = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 0.15]); // 27 degrees max

  // Intersection Observer - optimizado con acciones memoizadas
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '800px 0px 200px 0px' // Mismo rango que GemBackground
      }
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    return () => observer.disconnect();
  }, [setVisible]);

  // Page Visibility API - optimizado con acciones memoizadas
  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setPaused]);

  // Three.js setup - siguiendo EXACTAMENTE el patrón de GemBackground
  useEffect(() => {
    if (!mountRef.current || !isVisible) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    // Renderer setup con MISMAS optimizaciones que GemBackground
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

    // Lighting setup optimizado para RingSphere - MISMA configuración que gem
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = quality !== 'low';
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xb8a3ff, 0.8);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    let ringSphereObject: THREE.Object3D | null = null;

    // Load HDR environment from Cloudflare R2 - optimizado según calidad - MISMO que gem
    const hdrLoader = new RGBELoader();
    hdrLoader.load('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/large_corridor_1k-1.hdr', (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      hdr.generateMipmaps = quality !== 'low'; // Solo mipmaps para medium/high
      
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        pmrem.dispose();
      } catch (error) {
        console.error('Failed to create envMap:', error);
      }
    });

    // Crear material optimizado según calidad - MISMO que gem
    const createRingSphereMaterial = () => {
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

    // Load RingSphere model from Cloudflare R2 - siguiendo patrón de carga optimizada
    const objectLoader = new THREE.ObjectLoader();
    objectLoader.load('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/ringSphere.json', (object) => {
      ringSphereObject = object;
      const ringSphereMaterial = createRingSphereMaterial();
      
      // Apply material to loaded object
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material = ringSphereMaterial;
          child.castShadow = quality !== 'low';
          child.receiveShadow = quality !== 'low';
        }
      });

      // Position and scale - optimizado para centrado perfecto en MyStack con contenedor más grande
      object.scale.set(1.1, 1.1, 1.1); 
      object.position.set(0, 0, 0); // Centered
      object.rotation.set(0.1, 0, 0.1);
      
      scene.add(object);
    }, undefined, (error) => {
      console.error('Error loading RingSphere model:', error);
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      ringSphere: ringSphereObject,
      animationId: null
    };

    const animate = () => {
      const currentState = useRingSphereStore.getState();
      
      if (!currentState.isPaused && currentState.isVisible && ringSphereObject) {
        // Apply scroll-based rotation (very subtle)
        ringSphereObject.rotation.x = 0.1 + currentState.scrollRotationX;
        ringSphereObject.rotation.y = currentState.scrollRotationY;
        ringSphereObject.rotation.z = 0.1 + currentState.scrollRotationZ;
        
        renderer.render(scene, camera);
      }
      
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    // Start animation con smooth loading - usando acción memoizada
    const timer = setTimeout(() => {
      setLoading(false);
      setIsLoaded(true);
      animate();
    }, 300);

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
      const currentState = useRingSphereStore.getState();
      setScrollRotation(value, currentState.scrollRotationY, currentState.scrollRotationZ);
    });
    
    const unsubscribeRotationY = rotationY.on('change', (value) => {
      const currentState = useRingSphereStore.getState();
      setScrollRotation(currentState.scrollRotationX, value, currentState.scrollRotationZ);
    });
    
    const unsubscribeRotationZ = rotationZ.on('change', (value) => {
      const currentState = useRingSphereStore.getState();
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

        // Cleanup completo de recursos Three.js - siguiendo la guía
        sceneRef.current.scene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
            if (child.geometry) {
              child.geometry.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        if (currentMount.contains(sceneRef.current.renderer.domElement)) {
          currentMount.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [isVisible, isPaused, quality, setLoading, rotationX, rotationY, rotationZ, setScrollRotation]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded && !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ 
        zIndex: 5, // Mismo z-index que el contenedor 3D en MyStack.astro
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default RingSphereBackground;
