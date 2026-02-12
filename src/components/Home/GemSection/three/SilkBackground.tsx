import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { detectQuality, type QualityLevel } from '../../../../stores/threeJSStore';
import { observeDarkMode } from '../../../../utils/darkMode';

// Detect quality once at module level (shared across all card instances)
const quality: QualityLevel =
  typeof window !== 'undefined' ? detectQuality() : 'medium';

export const SilkBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Per-instance state (non-reactive — read in animation loop only)
  const stateRef = useRef({
    isVisible: false,
    isPaused: false,
    opacity: 0,
    time: 0,
  });

  // Single effect: create scene once, control animation internally.
  // No dependency on isVisible / isPaused — avoids remounting.
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const state = stateRef.current;

    // ── Scene ──
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer with adaptive pixel ratio
    const maxPixelRatio = quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2;
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    currentMount.appendChild(renderer.domElement);

    // ── Silk shader (precision mediump for mobile perf) ──
    const silkMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0.616, 0.498, 0.757) }, // #9D7FC1
        uContrastColor: { value: new THREE.Color(0.271, 0.137, 0.682) }, // #4523AE
        uSpeed: { value: 5.0 },
        uScale: { value: quality === 'low' ? 0.5 : quality === 'medium' ? 1.0 : 1.5 },
        uRotation: { value: 0.0 },
        uNoiseIntensity: { value: 1.5 },
        uOpacity: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;

        varying vec2 vUv;
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
          float rnd     = noise(gl_FragCoord.xy);
          vec2  uv      = rotateUvs(vUv * uScale, uRotation);
          vec2  tex     = uv * uScale;
          float tOffset = uSpeed * uTime * 0.01;

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
      blending: THREE.NormalBlending,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, silkMaterial));

    // ── Animation ──
    const animateCallback = () => {
      state.time += 0.1;
      silkMaterial.uniforms.uTime.value = state.time;
      silkMaterial.uniforms.uOpacity.value = state.opacity;
      renderer.render(scene, camera);
    };

    const syncAnimationLoop = () => {
      if (state.isVisible && !state.isPaused) {
        renderer.setAnimationLoop(animateCallback);
      } else {
        renderer.setAnimationLoop(null);
      }
    };

    // ── Visibility: Intersection + Dark Mode ──
    let isIntersecting = false;

    const updateVisibility = () => {
      const isDark = document.documentElement.classList.contains('dark-mode');
      state.isVisible = !isDark && isIntersecting;
      state.opacity = state.isVisible ? 1 : 0;
      syncAnimationLoop();
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
      syncAnimationLoop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── Debounced resize ──
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!currentMount) return;
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
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

    setIsLoaded(true);

    // ── Cleanup ──
    return () => {
      clearTimeout(resizeTimer);
      intersectionObserver.disconnect();
      cleanupDarkMode();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      renderer.setAnimationLoop(null);

      // Recursive disposal
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      silkMaterial.dispose();
      geometry.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []); // No dependencies — scene created once, animation controlled internally

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ zIndex: 1, mixBlendMode: 'normal' }}
    />
  );
};

export default SilkBackground;
