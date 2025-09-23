import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { create } from 'zustand';

// Enhanced Zustand store for Gem performance control - siguiendo el mismo patrón que SilkBackground
const useGemStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  opacity: number;
  quality: 'low' | 'medium' | 'high';
  rotationSpeed: number;
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setRotationSpeed: (speed: number) => void;
}>((set, get) => ({
  isVisible: false,
  isPaused: false,
  isLoading: true,
  opacity: 0,
  quality: 'medium',
  rotationSpeed: 1.0,
  setVisible: (visible) => {
    set({ isVisible: visible });
    // Smooth opacity transition - igual que SilkBackground
    if (visible) {
      setTimeout(() => set({ opacity: 1 }), 200);
    } else {
      setTimeout(() => set({ opacity: 0 }), 100);
    }
  },
  setPaused: (paused) => set({ isPaused: paused }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOpacity: (opacity) => set({ opacity }),
  setQuality: (quality) => set({ quality }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
}));

export const GemBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    gem: THREE.Object3D | null;
    animationId: number | null;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible, isPaused, isLoading, opacity, quality, rotationSpeed } = useGemStore();

  // Intersection Observer - MISMO patrón que SilkBackground
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        useGemStore.getState().setVisible(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '800px 0px 200px 0px' // Mismo rango que SilkBackground
      }
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Page Visibility API - MISMO patrón que SilkBackground
  useEffect(() => {
    const handleVisibilityChange = () => {
      useGemStore.getState().setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Three.js setup - siguiendo EXACTAMENTE el patrón de SilkBackground
  useEffect(() => {
    if (!mountRef.current || !isVisible) return;

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

    // Load HDR environment - optimizado según calidad
    const hdrLoader = new RGBELoader();
    hdrLoader.load('/hdr/large_corridor_1k.hdr', (hdr) => {
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

    // Load gem model - siguiendo patrón de carga optimizada
    const objectLoader = new THREE.ObjectLoader();
    objectLoader.load('/models/gem.json', (object) => {
      gemObject = object;
      const gemMaterial = createGemMaterial();
      
      // Apply material to loaded object
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
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
    }, undefined, (error) => {
      console.error('Error loading gem model:', error);
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      gem: gemObject,
      animationId: null
    };

    let time = 0;
    const animate = () => {
      const currentState = useGemStore.getState();
      
      if (!currentState.isPaused && currentState.isVisible && gemObject) {
        time += 0.016 * currentState.rotationSpeed;
        
        // Optimized rotation - solo eje horizontal (Y), conservando inclinación
        gemObject.rotation.y += 0.0001 * currentState.rotationSpeed;
        
        renderer.render(scene, camera);
      }
      
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    // Start animation con smooth loading - MISMO patrón
    const timer = setTimeout(() => {
      useGemStore.getState().setLoading(false);
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

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        
        // Cleanup completo - MISMO patrón que SilkBackground
        sceneRef.current.renderer.dispose();
        
        if (currentMount.contains(sceneRef.current.renderer.domElement)) {
          currentMount.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [isVisible, isPaused, quality]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded && !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ 
        zIndex: 2, // Por encima de SilkBackground (z-index: 1)
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default GemBackground;
