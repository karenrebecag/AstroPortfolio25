import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface SharedSilkRendererProps {
  skillCards: Array<{ id: string; title: string; description: string; highlight: string }>;
  className?: string;
}

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader optimized
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uContrastColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uOpacity;

  varying vec2 vUv;

  const float e = 2.71828182845904523536;

  float noise(vec2 texCoord) {
    float G = e;
    vec2 r = (G * sin(G * texCoord));
    return fract(r.x * r.y * (1.0 + texCoord.x));
  }

  void main() {
    float rnd = noise(gl_FragCoord.xy);
    vec2 uv = vUv * uScale;
    vec2 tex = uv * uScale;
    float tOffset = uSpeed * uTime * 0.01;

    tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

    float pattern = 0.6 + 0.4 * sin(
      5.0 * (tex.x + tex.y +
             cos(3.0 * tex.x + 5.0 * tex.y) +
             0.02 * tOffset) +
      sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))
    );

    vec4 col = vec4(uColor, 1.0) * vec4(pattern) +
               vec4(uContrastColor, 1.0) * (1.0 - pattern) -
               rnd / 15.0;

    col.a = uOpacity;
    gl_FragColor = col;
  }
`;

export const SharedSilkRenderer: React.FC<SharedSilkRendererProps> = ({
  skillCards,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    canvases: HTMLCanvasElement[];
    animationId: number | null;
  } | null>(null);

  // Shared geometry - created once
  const sharedGeometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create shared renderer with optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disabled for better performance
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create scene and camera once
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Shared material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#9D7FC1') },
        uContrastColor: { value: new THREE.Color('#4523AE') },
        uSpeed: { value: 1.0 },
        uScale: { value: 2.0 },
        uOpacity: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending
    });

    // Create mesh with shared geometry and material
    const mesh = new THREE.Mesh(sharedGeometry, material);
    scene.add(mesh);

    // Create individual canvases for each card
    const canvases: HTMLCanvasElement[] = [];
    const cardElements = containerRef.current.querySelectorAll('.skill-card');

    cardElements.forEach((cardElement, index) => {
      const canvas = document.createElement('canvas');
      canvas.className = 'silk-canvas';
      canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        pointer-events: none;
        z-index: 1;
      `;

      // Insert canvas as first child (behind content)
      cardElement.insertBefore(canvas, cardElement.firstChild);
      canvases.push(canvas);
    });

    sceneRef.current = {
      renderer,
      scene,
      camera,
      material,
      canvases,
      animationId: null
    };

    let time = 0;
    let isVisible = false;
    let isPaused = false;

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Page Visibility API
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Optimized animation loop
    const animate = () => {
      if (isVisible && !isPaused && sceneRef.current) {
        time += 0.016; // ~60fps timing
        sceneRef.current.material.uniforms.uTime.value = time;

        // Render to each canvas efficiently
        sceneRef.current.canvases.forEach((canvas, index) => {
          if (canvas.offsetParent) { // Only render visible canvases
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              sceneRef.current!.renderer.setSize(rect.width, rect.height);
              sceneRef.current!.renderer.setRenderTarget(null);
              sceneRef.current!.renderer.render(
                sceneRef.current!.scene,
                sceneRef.current!.camera
              );

              // Copy to individual canvas with proper scaling
              const ctx = canvas.getContext('2d');
              if (ctx) {
                const dpr = Math.min(window.devicePixelRatio, 2);
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                ctx.scale(dpr, dpr);
                ctx.drawImage(sceneRef.current!.renderer.domElement, 0, 0, rect.width, rect.height);
              }
            }
          }
        });
      }

      if (sceneRef.current) {
        sceneRef.current.animationId = requestAnimationFrame(animate);
      }
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }

        // Clean up canvases
        sceneRef.current.canvases.forEach(canvas => {
          canvas.remove();
        });

        // Dispose Three.js resources
        sceneRef.current.material.dispose();
        sceneRef.current.renderer.dispose();

        observer.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [skillCards, sharedGeometry]);

  return (
    <div
      ref={containerRef}
      className={`shared-silk-container ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {skillCards.map((skill) => (
        <div key={skill.id} className="skill-card">
          <div className="skill-header">
            <div className="skill-number">{skill.id}</div>
          </div>
          <div className="skill-content">
            <div className="skill-title">{skill.title}</div>
          </div>
          <div className="skill-description">
            <span className="description-normal">{skill.description}</span>
            <span className="description-highlight">{skill.highlight}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedSilkRenderer;