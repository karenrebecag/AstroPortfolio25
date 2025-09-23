import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { create } from 'zustand';

// Enhanced Zustand store for performance control
const useSilkStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  opacity: number;
  quality: 'low' | 'medium' | 'high';
  animationSpeed: number;
  colors: {
    primary: string;
    contrast: string;
  };
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setAnimationSpeed: (speed: number) => void;
  setColors: (colors: { primary: string; contrast: string }) => void;
}>((set, get) => ({
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
  setVisible: (visible) => {
    set({ isVisible: visible });
    // Smoother opacity transition with longer delay
    if (visible) {
      setTimeout(() => set({ opacity: 1 }), 200);
    } else {
      // Gradual fade out
      setTimeout(() => set({ opacity: 0 }), 100);
    }
  },
  setPaused: (paused) => set({ isPaused: paused }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOpacity: (opacity) => set({ opacity }),
  setQuality: (quality) => set({ quality }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setColors: (colors) => set({ colors }),
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
  const { isVisible, isPaused, isLoading, opacity, quality, animationSpeed } = useSilkStore();

  // Intersection Observer for performance with larger activation range
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        useSilkStore.getState().setVisible(entry.isIntersecting);
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
  }, []);

  // Page Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      useSilkStore.getState().setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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

    // Start animation after a small delay with smooth loading
    const timer = setTimeout(() => {
      useSilkStore.getState().setLoading(false);
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
        
        // Cleanup Three.js resources
        sceneRef.current.material.dispose();
        geometry.dispose();
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
        zIndex: 1,
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default SilkBackground;
