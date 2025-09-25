import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createThreeJSCleanup } from '../../utils/zustand-optimizations';

// Optimized Zustand store siguiendo mejores prácticas de la guía
// Dividido en slices por funcionalidad para evitar re-renders innecesarios
const useSilkStore = create<{
  // Visibility slice - para control de renderizado
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;

  // Settings slice - para configuración que cambia poco
  opacity: number;
  quality: 'low' | 'medium' | 'high';

  // Animation slice - para propiedades de animación
  animationSpeed: number;

  // Color slice - para configuración de colores
  colors: {
    primary: string;
    contrast: string;
  };

  // Actions - memoizadas para evitar recreación
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setAnimationSpeed: (speed: number) => void;
  setColors: (colors: { primary: string; contrast: string }) => void;

  // Batch updater para múltiples cambios
  batchUpdate: (updates: Partial<{
    isVisible: boolean;
    isPaused: boolean;
    isLoading: boolean;
    opacity: number;
    quality: 'low' | 'medium' | 'high';
    animationSpeed: number;
    colors: { primary: string; contrast: string };
  }>) => void;
}>((set, get) => ({
  // Initial state
  isVisible: false,
  isPaused: false,
  isLoading: true,
  opacity: 0,
  quality: 'medium',
  animationSpeed: 1.0,
  colors: {
    primary: '#9D7FC1',
    contrast: '#4523AE'
  },

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

  setAnimationSpeed: (speed) => {
    const currentState = get();
    if (currentState.animationSpeed === speed) return;
    set({ animationSpeed: speed });
  },

  setColors: (colors) => {
    const currentState = get();
    if (JSON.stringify(currentState.colors) === JSON.stringify(colors)) return;
    set({ colors });
  },

  // Batch updater para múltiples cambios simultáneos
  batchUpdate: (updates) => {
    const currentState = get();
    const filteredUpdates: Partial<typeof currentState> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'colors') {
        if (JSON.stringify(currentState.colors) !== JSON.stringify(value)) {
          (filteredUpdates as any)[key] = value;
        }
      } else if (currentState[key as keyof typeof currentState] !== value) {
        (filteredUpdates as any)[key] = value;
      }
    });

    if (Object.keys(filteredUpdates).length > 0) {
      set(filteredUpdates);
    }
  },
}));

export const SilkBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number | null;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Selectores optimizados con useShallow - evita re-renders innecesarios
  // Siguiendo las mejores prácticas de la documentación oficial de Zustand
  const { isVisible, isPaused, isLoading } = useSilkStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      isPaused: state.isPaused,
      isLoading: state.isLoading,
    }))
  );

  const { quality, opacity } = useSilkStore(
    useShallow((state) => ({
      quality: state.quality,
      opacity: state.opacity,
    }))
  );

  const { animationSpeed } = useSilkStore(
    useShallow((state) => ({
      animationSpeed: state.animationSpeed,
    }))
  );

  // Actions memoizadas - solo se extraen cuando es necesario
  const { setVisible, setPaused, setLoading, batchUpdate } = useSilkStore(
    useShallow((state) => ({
      setVisible: state.setVisible,
      setPaused: state.setPaused,
      setLoading: state.setLoading,
      batchUpdate: state.batchUpdate,
    }))
  );

  const cleanup = useMemo(() => createThreeJSCleanup(), []);

  // Intersection Observer - optimizado con acciones memoizadas
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '800px 0px 200px 0px' // Activate 800px before entering and deactivate 200px after leaving
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

  useEffect(() => {
    if (!mountRef.current || !isVisible) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    currentMount.appendChild(renderer.domElement);

    // Enhanced silk shader based on your reference
    const silkMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0.616, 0.498, 0.757) }, // #9D7FC1
        uContrastColor: { value: new THREE.Color(0.271, 0.137, 0.682) }, // #4523AE
        uSpeed: { value: 5.0 },
        uScale: { value: 1.0 * (quality === 'low' ? 0.5 : quality === 'medium' ? 1.0 : 1.5) },
        uRotation: { value: 0.0 },
        uNoiseIntensity: { value: 1.5 },
        uOpacity: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        uniform float uTime;
        uniform vec3  uColor;
        uniform vec3  uContrastColor;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uNoiseIntensity;
        uniform float uOpacity;

        const float e = 2.71828182845904523536;

        float noise(vec2 texCoord) {
          float G = e;
          vec2  r = (G * sin(G * texCoord));
          return fract(r.x * r.y * (1.0 + texCoord.x));
        }

        vec2 rotateUvs(vec2 uv, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          mat2  rot = mat2(c, -s, s, c);
          return rot * uv;
        }

        void main() {
          float rnd        = noise(gl_FragCoord.xy);
          vec2  uv         = rotateUvs(vUv * uScale, uRotation);
          vec2  tex        = uv * uScale;
          float tOffset    = uSpeed * uTime * 0.01; // Slower for performance

          tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

          float pattern = 0.6 +
                          0.4 * sin(5.0 * (tex.x + tex.y +
                                           cos(3.0 * tex.x + 5.0 * tex.y) +
                                           0.02 * tOffset) +
                                   sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

          vec4 col = vec4(uColor, 1.0) * vec4(pattern) + 
                     vec4(uContrastColor, 1.0) * (1.0 - pattern) - 
                     rnd / 15.0 * uNoiseIntensity;
          
          col.a = uOpacity;
          gl_FragColor = col;
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending
    });

    // Simple plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, silkMaterial);
    scene.add(mesh);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      material: silkMaterial,
      animationId: null
    };

    let time = 0;
    const animate = () => {
      const currentState = useSilkStore.getState();
      
      if (!currentState.isPaused && currentState.isVisible) {
        time += 0.1 * currentState.animationSpeed; // Match the original speed
        silkMaterial.uniforms.uTime.value = time;
        silkMaterial.uniforms.uOpacity.value = currentState.opacity;
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
      
      sceneRef.current.renderer.setSize(width, height);
      // Update camera aspect if needed (for orthographic camera, we don't need to update uniforms)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
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

        // Cleanup específico del material shader
        sceneRef.current.material.dispose();
        geometry.dispose();
        sceneRef.current.renderer.dispose();

        if (currentMount.contains(sceneRef.current.renderer.domElement)) {
          currentMount.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [isVisible, isPaused, quality, setLoading]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded && !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ 
        zIndex: 1,
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default SilkBackground;
