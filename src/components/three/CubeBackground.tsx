import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { create } from 'zustand';
import { useDeviceQuality } from '../../hooks/useDeviceQuality';
import MaterialPool from '../../utils/MaterialPool';

// Enhanced Zustand store for Cube performance control - siguiendo el mismo patrón que GemBackground
const useCubeStore = create<{
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
    // Smooth opacity transition - igual que GemBackground
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

export const CubeBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    cube: THREE.Object3D | null;
    animationId: number | null;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible, isPaused, isLoading, opacity, quality, rotationSpeed } = useCubeStore();
  
  // ✅ Detección automática de calidad siguiendo la guía
  const deviceQuality = useDeviceQuality();
  
  // ✅ Actualizar calidad automáticamente basada en dispositivo
  useEffect(() => {
    useCubeStore.getState().setQuality(deviceQuality);
  }, [deviceQuality]);

  // Intersection Observer - MISMO patrón que GemBackground
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        useCubeStore.getState().setVisible(entry.isIntersecting);
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
  }, []);

  // Page Visibility API - MISMO patrón que GemBackground
  useEffect(() => {
    const handleVisibilityChange = () => {
      useCubeStore.getState().setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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
    
    // Enable soft shadows for blurry effect
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    currentMount.appendChild(renderer.domElement);

    // Lighting setup optimizado para sombras blurry
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main frontal light - como si viniera del espectador/usuario
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 1, 8); // Frontal position - desde donde está el usuario
    directionalLight.castShadow = true;
    
    // Configure shadow properties for minimal opacity
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -4;
    directionalLight.shadow.camera.right = 4;
    directionalLight.shadow.camera.top = 4;
    directionalLight.shadow.camera.bottom = -4;
    directionalLight.shadow.radius = 10; // Blur radius for soft shadows
    directionalLight.shadow.blurSamples = 15;
    scene.add(directionalLight);

    // Subtle fill light from slightly off-center for depth
    const pointLight = new THREE.PointLight(0xb8a3ff, 0.2);
    pointLight.position.set(1, 0, 6); // Also frontal but slightly offset
    pointLight.castShadow = false; // No shadows from fill light
    scene.add(pointLight);

    // Create ultra-subtle ground plane for minimal shadows
    const groundGeometry = new THREE.PlaneGeometry(8, 8);
    const groundMaterial = new THREE.ShadowMaterial({ 
      opacity: 0.03, // Ultra minimal opacity - barely visible
      transparent: true 
    });
    const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -1.2; // Very close to cube
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    let cubeObject: THREE.Object3D | null = null;

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

    // ✅ Usar MaterialPool para reutilizar materiales - siguiendo la guía
    const materialPool = MaterialPool.getInstance();
    const createCubeMaterial = () => {
      return materialPool.getMaterial({
        type: 'physical',
        quality: quality,
        colors: {
          base: '#ffffff',
          attenuation: '#b8a3ff'
        }
      });
    };

    // Load cube model - siguiendo patrón de carga optimizada igual que GemBackground
    const objectLoader = new THREE.ObjectLoader();
    objectLoader.load('/models/Cube.json', (object) => {
      cubeObject = object;
      const cubeMaterial = createCubeMaterial();
      
      // Apply material to loaded object
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material = cubeMaterial;
          child.castShadow = true; // Always cast shadows for blurry effect
          child.receiveShadow = true; // Can also receive shadows from other objects
        }
      });

      // Position and scale - optimizado para la columna izquierda de Me.astro
      object.scale.set(0.8, 0.8, 0.8);
      object.position.set(0, 0, 0);
      object.rotation.set(0.1, 0.2, 0.1);
      
      scene.add(object);
    }, undefined, (error) => {
      console.error('Error loading cube model:', error);
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      cube: cubeObject,
      animationId: null
    };

    // Scroll-based rotation function
    const updateRotationFromScroll = () => {
      if (!cubeObject || !sceneRef.current) return;
      
      const scrollY = window.scrollY;
      const scrollProgress = scrollY * 0.001; // Adjust multiplier for rotation speed
      
      // Rotate based on scroll position
      cubeObject.rotation.x = 0.1 + scrollProgress * 0.5;
      cubeObject.rotation.y = 0.2 + scrollProgress * 0.8;
      cubeObject.rotation.z = 0.1 + scrollProgress * 0.3;
      
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    // Static render function (no continuous animation)
    const render = () => {
      const currentState = useCubeStore.getState();
      
      if (!currentState.isPaused && currentState.isVisible && sceneRef.current) {
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
    };

    // Add scroll listener for rotation
    window.addEventListener('scroll', updateRotationFromScroll, { passive: true });

    // Start with initial render
    const timer = setTimeout(() => {
      useCubeStore.getState().setLoading(false);
      setIsLoaded(true);
      render();
      updateRotationFromScroll(); // Initial rotation based on current scroll
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
      window.removeEventListener('scroll', updateRotationFromScroll);
      
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
  }, [isVisible, isPaused, quality]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded && !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ 
        zIndex: 2, // Por encima del DitheringShader background
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default CubeBackground;
