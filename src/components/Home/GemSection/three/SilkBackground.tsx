import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  useSilkStore,
  useVisibilityState,
  useSettingsState,
  useAnimationState,
  useThreeJSActions
} from '../../../../stores/threeJSStore';
import { observeDarkMode } from '../../../../utils/darkMode';

// ✅ Store moved to utils/stores/threeJSStore.ts for better code organization
// This eliminates ~130 lines of duplicated store logic

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

  // ✅ Using unified store with optimized selectors
  const { isVisible, isPaused, isLoading } = useVisibilityState();
  const { quality, opacity } = useSettingsState();
  const { animationSpeed } = useAnimationState();
  const { setVisible, setPaused, setLoading } = useThreeJSActions();

  // ✅ Unified visibility control using centralized utilities
  useEffect(() => {
    let isIntersecting = false;

    const updateVisibility = (isDark: boolean) => {
      // Only show if NOT in dark mode AND intersecting
      const shouldBeVisible = !isDark && isIntersecting;
      setVisible(shouldBeVisible);
    };

    // Intersection Observer
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        // Use observeDarkMode to get current state and update
        updateVisibility(!document.documentElement.classList.contains('dark-mode'));
      },
      {
        threshold: 0,
        rootMargin: '800px 0px 200px 0px'
      }
    );

    if (mountRef.current) {
      intersectionObserver.observe(mountRef.current);
    }

    // Dark mode observer - eliminates ~50 lines of duplicated code
    const cleanupDarkMode = observeDarkMode((isDark) => {
      updateVisibility(isDark);
    });

    return () => {
      intersectionObserver.disconnect();
      cleanupDarkMode();
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
      // ✅ Use unified store's getState
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
