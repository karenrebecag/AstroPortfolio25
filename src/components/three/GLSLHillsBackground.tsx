import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { create } from 'zustand';

// Zustand store for performance control following ThreeModelsStandard.md
interface GLSLHillsStore {
  isVisible: boolean;
  isPaused: boolean;
  quality: 'low' | 'medium' | 'high';
  setVisibility: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
}

const useGLSLHillsStore = create<GLSLHillsStore>((set) => ({
  isVisible: false,
  isPaused: false,
  quality: 'medium',
  setVisibility: (visible) => set({ isVisible: visible }),
  setPaused: (paused) => set({ isPaused: paused }),
  setQuality: (quality) => set({ quality }),
}));

interface GLSLHillsBackgroundProps {
  width?: string;
  height?: string;
  cameraZ?: number;
  planeSize?: number;
  speed?: number;
  className?: string;
}

const GLSLHillsBackground: React.FC<GLSLHillsBackgroundProps> = ({
  width = '100%',
  height = '100%',
  cameraZ = 125,
  planeSize = 256,
  speed = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    plane?: any;
    clock?: THREE.Clock;
    animationId?: number;
  }>({});

  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible, isPaused, quality, setVisibility, setPaused } = useGLSLHillsStore();

  // Plane class with GLSL shaders
  class Plane {
    uniforms: { time: { type: string; value: number } };
    mesh: THREE.Mesh;
    time: number;

    constructor() {
      this.uniforms = {
        time: { type: 'f', value: 0 },
      };
      this.mesh = this.createMesh();
      this.time = speed;
    }

    createMesh() {
      const geometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSize, planeSize);
      
      const material = new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          #define GLSLIFY 1
          attribute vec3 position;
          uniform mat4 projectionMatrix;
          uniform mat4 modelViewMatrix;
          uniform float time;
          varying vec3 vPosition;

          mat4 rotateMatrixX(float radian) {
            return mat4(
              1.0, 0.0, 0.0, 0.0,
              0.0, cos(radian), -sin(radian), 0.0,
              0.0, sin(radian), cos(radian), 0.0,
              0.0, 0.0, 0.0, 1.0
            );
          }

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

          float cnoise(vec3 P) {
            vec3 Pi0 = floor(P);
            vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod289(Pi0);
            Pi1 = mod289(Pi1);
            vec3 Pf0 = fract(P);
            vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 * (1.0 / 7.0);
            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 * (1.0 / 7.0);
            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
          }

          void main(void) {
            vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;
            float sin1 = sin(radians(updatePosition.x / 128.0 * 90.0));
            vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -30.0);
            float noise1 = cnoise(noisePosition * 0.08);
            float noise2 = cnoise(noisePosition * 0.06);
            float noise3 = cnoise(noisePosition * 0.4);
            vec3 lastPosition = updatePosition + vec3(0.0,
              noise1 * sin1 * 8.0
              + noise2 * sin1 * 8.0
              + noise3 * (abs(sin1) * 2.0 + 0.5)
              + pow(sin1, 2.0) * 40.0, 0.0);

            vPosition = lastPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          #define GLSLIFY 1
          varying vec3 vPosition;

          void main(void) {
            float opacity = (96.0 - length(vPosition)) / 256.0 * 0.35;
            vec3 color = vec3(0.6);
            gl_FragColor = vec4(color, opacity);
          }
        `,
        transparent: true
      });

      return new THREE.Mesh(geometry, material);
    }

    render(deltaTime: number) {
      this.uniforms.time.value += deltaTime * this.time;
    }
  }

  // Initialize Three.js scene
  const initScene = () => {
    if (!canvasRef.current) return;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: quality === 'high',
      powerPreference: 'high-performance',
      alpha: true
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    const clock = new THREE.Clock();
    const plane = new Plane();

    camera.position.set(0, 16, cameraZ);
    camera.lookAt(new THREE.Vector3(0, 28, 0));
    scene.add(plane.mesh);

    sceneRef.current = { renderer, scene, camera, plane, clock };
    
    setIsLoaded(true);
    resize();
  };

  // Resize handler
  const resize = () => {
    if (!containerRef.current || !sceneRef.current.renderer || !sceneRef.current.camera) return;

    const { clientWidth, clientHeight } = containerRef.current;
    
    sceneRef.current.camera.aspect = clientWidth / clientHeight;
    sceneRef.current.camera.updateProjectionMatrix();
    sceneRef.current.renderer.setSize(clientWidth, clientHeight);
  };

  // Animation loop
  const animate = () => {
    if (!sceneRef.current.renderer || !sceneRef.current.scene || !sceneRef.current.camera || !sceneRef.current.plane || !sceneRef.current.clock) return;

    if (!isPaused && isVisible) {
      const deltaTime = sceneRef.current.clock.getDelta();
      sceneRef.current.plane.render(deltaTime);
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    }

    sceneRef.current.animationId = requestAnimationFrame(animate);
  };

  // IntersectionObserver for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibility(entry.isIntersecting);
        });
      },
      { rootMargin: '200px', threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [setVisibility]);

  // Page Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setPaused]);

  // Initialize scene
  useEffect(() => {
    initScene();
    
    return () => {
      // Cleanup Three.js resources
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }
      
      if (sceneRef.current.scene) {
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Start animation loop when loaded and visible
  useEffect(() => {
    if (isLoaded && isVisible) {
      animate();
    }
  }, [isLoaded, isVisible]);

  // Resize listener
  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`glsl-hills-container ${className}`}
      style={{ 
        position: 'relative', 
        width, 
        height,
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      
      {/* Loading fallback */}
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ color: '#666', fontSize: '14px' }}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default GLSLHillsBackground;
