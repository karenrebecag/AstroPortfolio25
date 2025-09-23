import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader, GLTFLoader } from 'three-stdlib';
import { create } from 'zustand';

// Enhanced Zustand store optimizado siguiendo mejores prácticas del documento
const useKirbyStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  opacity: number;
  quality: 'low' | 'medium' | 'high';
  rotationSpeed: number;
  colors: { primary: string; contrast: string; };
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;
  setOpacity: (opacity: number) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setRotationSpeed: (speed: number) => void;
}>((set, get) => ({
  // Estados iniciales optimizados
  isVisible: false,
  isPaused: false,
  isLoading: true,
  opacity: 0, // Inicia invisible para fade in suave
  quality: 'medium',
  rotationSpeed: 1.0,
  colors: {
    primary: '#ffb6c1', // Rosa Kirby
    contrast: '#ff69b4'  // Rosa más intenso
  },
  
  // Métodos con transiciones suaves como SilkBackground
  setVisible: (visible) => {
    set({ isVisible: visible });
    if (visible) {
      // Fade in con delay como en el documento
      setTimeout(() => set({ opacity: 1 }), 200);
    } else {
      // Fade out más rápido
      setTimeout(() => set({ opacity: 0 }), 100);
    }
  },
  setPaused: (paused) => set({ isPaused: paused }),
  setLoading: (loading) => set({ isLoading: loading }),
  setOpacity: (opacity) => set({ opacity: opacity }),
  setQuality: (quality) => set({ quality: quality }),
  setRotationSpeed: (speed) => set({ rotationSpeed: speed }),
}));

export const KirbyBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    kirbyObject?: THREE.Object3D;
  } | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const { isVisible, isPaused, isLoading, opacity, quality, rotationSpeed } = useKirbyStore();
  
  // Detección automática de calidad basada en dispositivo
  useEffect(() => {
    const detectQuality = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      
      if (isMobile || isLowEnd) {
        useKirbyStore.getState().setQuality('low');
      } else if (window.devicePixelRatio > 2) {
        useKirbyStore.getState().setQuality('high');
      } else {
        useKirbyStore.getState().setQuality('medium');
      }
    };
    
    detectQuality();
  }, []);

  // Intersection Observer optimizado - siguiendo mejores prácticas del documento
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        useKirbyStore.getState().setVisible(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '800px 0px 200px 0px' // Activación temprana como en SilkBackground
      }
    );

    const element = mountRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Page Visibility API - MISMO patrón que RingSphere
  useEffect(() => {
    const handleVisibilityChange = () => {
      useKirbyStore.getState().setPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Three.js setup optimizado - siguiendo patrón de RingSphere
  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    
    // Camera setup optimizado para Kirby - ajustado para el nuevo tamaño
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    // Alejar más la cámara para acomodar el Kirby aún más grande
    camera.position.set(0, 0, 3.2);
    camera.lookAt(0, 0, 0); // Asegurar que mire al centro

    // Renderer setup optimizado siguiendo mejores prácticas
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Deshabilitado para mejor performance en móviles
      alpha: true,
      powerPreference: 'high-performance', // GPU dedicada cuando esté disponible
    });
    
    // Configurar dimensiones seguras para prevenir overflow
    const containerWidth = Math.min(currentMount.clientWidth, window.innerWidth);
    const containerHeight = Math.min(currentMount.clientHeight, window.innerHeight);
    
    renderer.setSize(containerWidth, containerHeight);
    // Pixel ratio limitado como en SilkBackground
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = quality === 'high'; // Solo sombras en calidad alta
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Configuración de color space para GLTF
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Configurar estilos del canvas para prevenir overflow
    const canvas = renderer.domElement;
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.objectFit = 'contain';
    
    currentMount.appendChild(canvas);

    // Lighting setup optimizado por calidad - siguiendo patrón de performance
    const ambientLight = new THREE.AmbientLight(0xffffff, quality === 'low' ? 0.8 : 0.6);
    scene.add(ambientLight);

    // Solo luces adicionales en calidad media/alta
    if (quality !== 'low') {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = quality === 'high';
      if (directionalLight.shadow && quality === 'high') {
        directionalLight.shadow.mapSize.width = 1024; // Reducido para mejor performance
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
      }
      scene.add(directionalLight);

      // Point light solo en calidad alta
      if (quality === 'high') {
        const pointLight = new THREE.PointLight(0xffc0cb, 0.5, 100);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);
      }
    }

    // Load HDR environment map para reflecciones
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/hdr/large_corridor_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = null; // Mantener fondo transparente
    });

    // Variable para el objeto Kirby
    let kirbyObject: THREE.Object3D | undefined;

    // Load Kirby model usando GLTFLoader - primero intentamos usar las texturas del GLB
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/models/Kirby/base_basic_pbr.glb', (gltf) => {
      const root = gltf.scene;
      kirbyObject = root;

      console.log('Kirby GLTF loaded:', gltf);
      console.log('Scene children:', root.children);

      root.traverse((obj) => {
        if ((obj as any).isMesh) {
          const mesh = obj as THREE.Mesh;
          
          console.log('Mesh found:', mesh.name);
          console.log('Original material:', mesh.material);
          console.log('Geometry attributes:', Object.keys(mesh.geometry.attributes));
          
          // Verificar UVs
          const uvAttribute = mesh.geometry.getAttribute('uv');
          if (!uvAttribute) {
            console.warn('Este mesh no tiene UVs; no podrá mostrar texturas.');
          } else {
            console.log('UVs encontradas:', uvAttribute.count, 'coordenadas UV');
          }
          
          mesh.castShadow = quality !== 'low';
          mesh.receiveShadow = quality !== 'low';

          // Primero intentamos usar el material original del GLB
          if (mesh.material && (mesh.material as any).map) {
            console.log('Usando material original del GLB');
            // El GLB ya tiene texturas, solo ajustamos propiedades
            const originalMaterial = mesh.material as THREE.MeshStandardMaterial;
            originalMaterial.transparent = true;
            originalMaterial.opacity = opacity;
            originalMaterial.envMapIntensity = 0.5;
            originalMaterial.needsUpdate = true;
          } else {
            console.log('Cargando texturas manualmente');
            // Cargar texturas manualmente solo si el GLB no las tiene
            const textureLoader = new THREE.TextureLoader();
            const baseColor = textureLoader.load('/models/Kirby/texture_diffuse.png');
            const roughnessMap = textureLoader.load('/models/Kirby/texture_roughness.png');
            const metalnessMap = textureLoader.load('/models/Kirby/texture_metallic.png');
            const normalMap = textureLoader.load('/models/Kirby/texture_normal.png');

            // Configuración correcta de texturas
            baseColor.colorSpace = THREE.SRGBColorSpace;
            baseColor.flipY = false; // Importante para GLB
            roughnessMap.flipY = false;
            metalnessMap.flipY = false;
            normalMap.flipY = false;

            // Configurar wrapping para evitar problemas de UV
            [baseColor, roughnessMap, metalnessMap, normalMap].forEach(texture => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
            });

            // Material optimizado por calidad siguiendo mejores prácticas
            if (quality === 'low') {
              // Material simple para dispositivos de baja gama
              mesh.material = new THREE.MeshLambertMaterial({
                map: baseColor,
                transparent: true,
                opacity: opacity,
              });
            } else if (quality === 'medium') {
              // Material intermedio sin todas las texturas
              mesh.material = new THREE.MeshStandardMaterial({
                map: baseColor,
                roughness: 0.8,
                metalness: 0.2,
                transparent: true,
                opacity: opacity,
              });
            } else {
              // Material completo PBR para alta calidad
              mesh.material = new THREE.MeshStandardMaterial({
                map: baseColor,
                normalMap: normalMap,
                roughnessMap: roughnessMap,
                metalnessMap: metalnessMap,
                roughness: 0.8,
                metalness: 0.2,
                envMapIntensity: 0.5,
                transparent: true,
                opacity: opacity,
              });
            }
            
            mesh.material.needsUpdate = true;
          }
        }
      });

      // Scale and position Kirby - 20% más pequeño
      root.scale.setScalar(1.25); // Era 1.56, ahora 1.25 (20% más pequeño) 
      
      // Posición directa - un poquitín hacia arriba
      root.position.set(0, -1.2, 0); // x=0 (centro), y=-1.2 (un poco menos abajo), z=0 (centro)
      
      console.log('Kirby position set to:', root.position); // Debug
      
      scene.add(root);
      
      // Guardar referencia para animación
      if (sceneRef.current) {
        sceneRef.current.kirbyObject = root;
      }
    }, 
    // Progress callback
    (progress) => {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    // Error callback
    (error) => {
      console.error('Error loading Kirby GLTF model:', error);
      
      // Fallback: intentar cargar el otro GLB
      console.log('Intentando cargar el GLB alternativo...');
      gltfLoader.load('/models/Kirby/base_basic_shaded.glb', (gltf) => {
        const root = gltf.scene;
        kirbyObject = root;
        
        root.traverse((obj) => {
          if ((obj as any).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = quality !== 'low';
            mesh.receiveShadow = quality !== 'low';
            
            // Usar material original si existe
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.transparent = true;
              material.opacity = opacity;
              material.needsUpdate = true;
            }
          }
        });
        
        // Mismo tamaño y posición que el modelo principal - 20% más pequeño
        root.scale.setScalar(1.25);
        root.position.set(0, -1.2, 0); // Misma posición que el modelo principal - un poquitín más arriba
        
        scene.add(root);
        
        if (sceneRef.current) {
          sceneRef.current.kirbyObject = root;
        }
      });
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      kirbyObject,
    };

    let time = 0;
    let animationId: number;
    
    const animate = () => {
      const currentState = useKirbyStore.getState();
      
      // Solo animar y renderizar si es visible y no está pausado
      if (!currentState.isPaused && currentState.isVisible && kirbyObject) {
        time += 0.016 * currentState.rotationSpeed;
        
        // Rotación muuuy lenta y flotación para Kirby - manteniendo posición base
        kirbyObject.rotation.y = time * 0.05;
        // Flotación desde la posición base (-1.2) - un poquitín más arriba
        kirbyObject.position.y = -1.2 + Math.sin(time * 2) * 0.06;
        
        renderer.render(scene, camera);
      }
      
      animationId = requestAnimationFrame(animate);
    };

    // Start animation con smooth loading y transiciones como SilkBackground
    const timer = setTimeout(() => {
      useKirbyStore.getState().setLoading(false);
      setIsLoaded(true);
      animate();
      
      // Fade in suave después de cargar
      setTimeout(() => {
        useKirbyStore.getState().setOpacity(1);
      }, 200);
    }, 300);

    // Resize handler mejorado para prevenir overflow
    const handleResize = () => {
      if (!currentMount || !sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      
      // Obtener dimensiones del contenedor con límites seguros
      const containerWidth = Math.min(currentMount.clientWidth, window.innerWidth);
      const containerHeight = Math.min(currentMount.clientHeight, window.innerHeight);
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerWidth, containerHeight);
      
      // Asegurar que el canvas no exceda las dimensiones del contenedor
      const canvas = renderer.domElement;
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      // Cleanup completo siguiendo mejores prácticas del documento
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (sceneRef.current) {
        const { scene, renderer } = sceneRef.current;
        
        // Dispose completo de recursos Three.js
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material?.dispose();
            }
          }
        });
        
        // Dispose del renderer y remover del DOM
        renderer.dispose();
        if (currentMount && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      
      sceneRef.current = null;
    };
  }, [quality, opacity]);

  // Update opacity when it changes
  useEffect(() => {
    if (sceneRef.current?.kirbyObject) {
      sceneRef.current.kirbyObject.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = opacity;
        }
      });
    }
  }, [opacity]);

  return (
    <div 
      ref={mountRef} 
      className={`kirby-3d-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {isLoading && (
        <div className="kirby-loading">
          <div className="loading-spinner"></div>
          <p>Loading Kirby...</p>
        </div>
      )}
    </div>
  );
};

export default KirbyBackground;
