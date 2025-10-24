import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { create } from 'zustand';
import GemModel from './GemModel';

// Enhanced Zustand store for Gem Canvas control
const useGemCanvasStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  quality: 'low' | 'medium' | 'high';
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
}>((set) => ({
  isVisible: false,
  isPaused: false,
  isLoading: true,
  quality: 'medium',
  setVisible: (visible) => set({ isVisible: visible }),
  setPaused: (paused) => set({ isPaused: paused }),
  setLoading: (loading) => set({ isLoading: loading }),
  setQuality: (quality) => set({ quality }),
}));

interface GemCanvasProps {
  className?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const GemCanvas: React.FC<GemCanvasProps> = ({ 
  className = '',
  scale = 3.66,
  position = [3.5, -0.5, -4],
  rotation = [0.2, -0.35, -0.32]
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible, isPaused, quality } = useGemCanvasStore();

  // Detect mobile for performance optimization
  const isMobile = useMemo(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  , []);

  // Intersection Observer for performance with larger activation range
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        useGemCanvasStore.getState().setVisible(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '400px 0px 200px 0px' // Same as SilkBackground
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
      useGemCanvasStore.getState().setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Quality detection based on device capabilities
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      useGemCanvasStore.getState().setQuality('low');
      return;
    }

    const renderer = gl.getParameter(gl.RENDERER);
    const vendor = gl.getParameter(gl.VENDOR);
    
    // Simple heuristic for quality detection
    if (isMobile || renderer.includes('Intel')) {
      useGemCanvasStore.getState().setQuality('low');
    } else if (renderer.includes('NVIDIA') || renderer.includes('AMD')) {
      useGemCanvasStore.getState().setQuality('high');
    } else {
      useGemCanvasStore.getState().setQuality('medium');
    }
  }, [isMobile]);

  // Optimized renderer settings
  const rendererSettings = useMemo(() => ({
    antialias: quality !== 'low',
    toneMappingExposure: 1.2,
    powerPreference: isMobile ? 'default' : 'high-performance' as WebGLPowerPreference,
    pixelRatio: Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1),
    preserveDrawingBuffer: false,
    alpha: true,
    stencil: false,
    depth: true,
    logarithmicDepthBuffer: !isMobile && quality === 'high',
    precision: isMobile ? 'mediump' : 'highp' as 'highp' | 'mediump' | 'lowp',
    premultipliedAlpha: false,
    failIfMajorPerformanceCaveat: false,
  }), [quality, isMobile]);

  // Camera settings optimized for gem viewing
  const cameraSettings = useMemo(() => ({
    position: [0, 0, 4] as [number, number, number],
    fov: 50,
    near: 0.1,
    far: 100,
  }), []);

  // Loading fallback
  const LoadingFallback = () => (
    <mesh>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#b8a3ff" transparent opacity={0.3} />
    </mesh>
  );

  return (
    <div 
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ zIndex: 2 }}
    >
      <Canvas
        ref={canvasRef}
        frameloop={isVisible ? "always" : "demand"}
        camera={cameraSettings}
        gl={rendererSettings}
        dpr={isMobile ? [0.5, 1] : (isVisible ? [1, 2] : [0.5, 1])}
        performance={{ 
          min: isMobile ? 0.2 : (isVisible ? 0.8 : 0.3),
          max: 1,
          debounce: 200
        }}
        onCreated={({ gl, scene }) => {
          // Canvas created successfully
          scene.background = null;
          
          // Additional optimizations
          gl.setClearColor(0x000000, 0);
          gl.shadowMap.enabled = quality !== 'low' && isVisible;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // Mark as loaded after small delay
          setTimeout(() => {
            useGemCanvasStore.getState().setLoading(false);
            setIsLoaded(true);
          }, 300);
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isVisible ? 1 : 0.3,
        }}
      >
        {/* Lighting setup optimized for gem */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.5}
          castShadow={quality !== 'low'}
          shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
          shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
        />
        <pointLight 
          position={[-5, -5, 5]} 
          intensity={0.8}
          color="#b8a3ff"
        />
        
        <Suspense fallback={<LoadingFallback />}>
          <GemModel 
            scale={scale}
            position={position}
            rotation={rotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GemCanvas;
