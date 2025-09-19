import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { RGBELoader } from 'three-stdlib';
import { create } from 'zustand';

// Enhanced Zustand store for Gem performance control
const useGemStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  quality: 'low' | 'medium' | 'high';
  rotationSpeed: number;
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setRotationSpeed: (speed: number) => void;
}>((set) => ({
  isVisible: false,
  isPaused: false,
  isLoading: true,
  quality: 'medium',
  rotationSpeed: 1.0,
  setVisible: (visible) => set({ isVisible: visible }),
  setPaused: (paused) => set({ isPaused: paused }),
  setLoading: (loading) => set({ isLoading: loading }),
  setQuality: (quality) => set({ quality }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
}));

interface GemModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  className?: string;
}

export const GemModel: React.FC<GemModelProps> = ({
  scale = 3.66,
  position = [3.5, -0.5, -4],
  rotation = [0.2, -0.35, -0.32],
  className = ''
}) => {
  const { scene, gl, invalidate } = useThree();
  const ref = useRef<THREE.Object3D>(null);
  const { isVisible, isPaused, quality, rotationSpeed } = useGemStore();
  
  // Performance optimization: detect reduced motion preference
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  , []);

  // Load model with error handling
  const object = useLoader(THREE.ObjectLoader, '/models/gem.json');
  
  // Load HDR with optimized settings
  const hdr = useLoader(RGBELoader, '/hdr/large_corridor_1k.hdr');

  // Apply HDR mapping with performance optimization
  useEffect(() => {
    if (!hdr) return;
    
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    hdr.generateMipmaps = quality !== 'low'; // Only generate mipmaps for medium/high quality
    
    // Set up environment with error handling
    let envMap = null;
    try {
      const pmrem = new THREE.PMREMGenerator(gl);
      envMap = pmrem.fromEquirectangular(hdr).texture;
      pmrem.dispose();
      scene.environment = envMap;
    } catch (error) {
      console.error('Failed to create envMap:', error);
      scene.environment = null;
    }
  }, [hdr, gl, scene, quality]);

  // Optimized material based on quality settings
  const gemMaterial = useMemo(() => {
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

    // Quality-based optimizations
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
  }, [quality]);

  // Apply material to loaded object
  useEffect(() => {
    if (!object) return;
    
    object.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = gemMaterial;
        child.castShadow = quality !== 'low';
        child.receiveShadow = quality !== 'low';
      }
    });
  }, [object, gemMaterial, quality]);

  // Apply initial transformations
  useEffect(() => {
    if (!ref.current || !object) return;
    
    ref.current.scale.set(scale, scale, scale);
    ref.current.position.set(...position);
    ref.current.rotation.set(...rotation);
  }, [object, scale, position, rotation]);

  // Optimized animation with performance controls
  useFrame((_: any, delta: number) => {
    if (!ref.current || prefersReducedMotion || isPaused) return;

    // Reduce performance when not visible but keep component alive
    if (!isVisible) {
      // Minimal updates when not visible
      return;
    }

    // Full performance when visible
    const adjustedDelta = delta * rotationSpeed;
    ref.current.rotation.x += 0 * adjustedDelta;
    ref.current.rotation.y += 0.0002 * adjustedDelta * 60; // Normalize to 60fps
    ref.current.rotation.z += 0.0001 * adjustedDelta * 60;
    
    invalidate();
  });

  // Fallback rendering
  if (!object) {
    return (
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#b8a3ff" transparent opacity={0.5} />
      </mesh>
    );
  }

  return <primitive ref={ref} object={object} />;
};

export default GemModel;
