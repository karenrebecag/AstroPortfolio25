import React, { useEffect, useRef, useState } from 'react';
import '../../styles/brush-drawing.css';

const BrushDrawingIsland: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // IntersectionObserver para lazy load de GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !gsapLoaded) {
            loadGSAP();
          }
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
      // Cleanup GSAP animations
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      // Cleanup RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [gsapLoaded]);

  const loadGSAP = async () => {
    try {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');

      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
      setGsapLoaded(true);

      // Optimización: usar requestAnimationFrame para mejor timing
      rafId.current = requestAnimationFrame(() => {
        setTimeout(() => {
          initializeAnimation(gsap, ScrollTrigger);
          // Agregar clase loaded para mostrar el SVG
          if (svgRef.current) {
            svgRef.current.classList.add('loaded');
            setAnimationReady(true);
          }
        }, 50); // Delay reducido para mejor responsividad
      });
    } catch (error) {
      console.error('Failed to load GSAP:', error);
    }
  };

  const initializeAnimation = (gsap: any, ScrollTrigger: any) => {
    if (!svgRef.current || !containerRef.current) return;

    const paths = svgRef.current.querySelectorAll('path');

    console.log('Total paths found:', paths.length);

    paths.forEach((path: SVGPathElement, index: number) => {
      // Calcular path length para configuración precisa
      const pathLength = (path as any).getTotalLength?.() || 1000;
      
      // Configuración MANUAL correcta (sin DrawSVGPlugin inicial)
      gsap.set(path, { 
        opacity: 0,
        visibility: "hidden",
        // Configuración manual correcta para líneas continuas
        strokeDasharray: `${pathLength}, ${pathLength}`, // Dash = longitud total, Gap = longitud total
        strokeDashoffset: pathLength, // Offset = longitud total (línea oculta)
        // Optimizaciones de rendering
        force3D: true,
        backfaceVisibility: "hidden",
        perspective: 1000,
        transformStyle: "preserve-3d"
      });
      
      // Mejorar la calidad visual del stroke
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';
      path.style.vectorEffect = 'non-scaling-stroke';
      
      console.log(`Path ${index + 1} configured with length: ${pathLength}`);
    });

    // Create timeline with ScrollTrigger - OPTIMIZADO PARA SUAVIDAD
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',          // Empieza más temprano para transición suave
        end: 'bottom 15%',         // Termina más tarde para mejor distribución
        scrub: 2,                  // Scrub más suave (2 segundos de lag para mayor fluidez)
        markers: false,            // Cambia a true para debug
        invalidateOnRefresh: true, // Previene jumps en refresh
        refreshPriority: -1,       // Prioridad baja para mejor performance
        onUpdate: (self: any) => {
          // Solo log en desarrollo
          if (process.env.NODE_ENV === 'development') {
            console.log('Scroll progress:', self.progress.toFixed(3));
          }
        }
      }
    });

    // SOLUCIÓN 2: Animar paths con easing curves ultra-suaves
    paths.forEach((path: SVGPathElement, index: number) => {
      // Calcular el path length para animación más precisa
      const pathLength = (path as any).getTotalLength?.() || 1000;
      
      // Primero hacer visible el path con fade suave
      tl.to(path, {
        visibility: "visible",
        opacity: 1,
        duration: 0.2,
        ease: 'power1.out'         // Fade in suave
      }, index * 0.3);             // Separación optimizada (0.3s)

      // SOLUCIÓN ALTERNATIVA: Animar stroke-dashoffset directamente
      tl.to(path, {
        strokeDashoffset: 0,       // Animar hacia 0 para revelar línea completa
        ease: 'power3.inOut',      // Curva ultra-suave (aceleración gradual)
        duration: 1.8,             // Duración más larga para suavidad
        force3D: true,             // Aceleración hardware
        transformOrigin: "center center"
      }, index * 0.3 + 0.15);      // Overlap ligero para fluidez

      // DrawSVGPlugin maneja la limpieza automáticamente
      // No necesitamos animación de limpieza manual

      // Añadir micro-animación de "respiración" para mayor naturalidad
      tl.to(path, {
        strokeWidth: "+=0.5",
        ease: 'sine.inOut',
        duration: 0.1,
        yoyo: true,
        repeat: 1
      }, index * 0.3 + 0.9);        // En el medio del drawing
      
      console.log(`Path ${index + 1} configured with ultra-smooth easing + micro-animations`);
    });

    // Cleanup function mejorada (REMOVIDO ScrollTrigger.refresh() que causaba el jump)
    cleanupRef.current = () => {
      // Kill all ScrollTriggers relacionados
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
      // Kill timeline
      if (tl) {
        tl.kill();
      }
      // Limpiar estilos inline
      paths.forEach((path: SVGPathElement) => {
        path.removeAttribute('style');
      });
    };
  };

  return (
    <div ref={containerRef} className="brush-drawing-container">
      <svg
        ref={svgRef}
        width="1440"
        height="396"
        viewBox="0 0 1440 396"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brush-svg-animated"
        style={{ 
          visibility: gsapLoaded ? 'visible' : 'hidden'
        }}
      >
        {/* LÍNEAS CONTINUAS DESDE CERO - SIN FRAGMENTACIÓN */}
        
        {/* LÍNEA 1 - Trazo continuo orgánico basado en el ejemplo */}
        <path 
          d="M0,270 C50,250 120,200 200,180 C280,160 350,140 420,120 C480,100 540,90 600,85 C660,80 720,78 780,82 C840,86 900,95 960,110 C1020,125 1080,145 1140,170 C1200,195 1260,225 1320,250 C1360,265 1400,275 1440,280" 
          fill="none" 
          stroke="#C0D645" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 2 - Misma forma desplazada +20px verticalmente */}
        <path 
          d="M0,290 C50,270 120,220 200,200 C280,180 350,160 420,140 C480,120 540,110 600,105 C660,100 720,98 780,102 C840,106 900,115 960,130 C1020,145 1080,165 1140,190 C1200,215 1260,245 1320,270 C1360,285 1400,295 1440,300" 
          fill="none" 
          stroke="#9DB79C" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 3 - Misma forma desplazada +40px verticalmente */}
        <path 
          d="M0,310 C50,290 120,240 200,220 C280,200 350,180 420,160 C480,140 540,130 600,125 C660,120 720,118 780,122 C840,126 900,135 960,150 C1020,165 1080,185 1140,210 C1200,235 1260,265 1320,290 C1360,305 1400,315 1440,320" 
          fill="none" 
          stroke="#C0D645" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 4 - Misma forma desplazada +60px verticalmente */}
        <path 
          d="M0,330 C50,310 120,260 200,240 C280,220 350,200 420,180 C480,160 540,150 600,145 C660,140 720,138 780,142 C840,146 900,155 960,170 C1020,185 1080,205 1140,230 C1200,255 1260,285 1320,310 C1360,325 1400,335 1440,340" 
          fill="none" 
          stroke="#DDFFB3" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 5 - Misma forma desplazada +80px verticalmente */}
        <path 
          d="M0,350 C50,330 120,280 200,260 C280,240 350,220 420,200 C480,180 540,170 600,165 C660,160 720,158 780,162 C840,166 900,175 960,190 C1020,205 1080,225 1140,250 C1200,275 1260,305 1320,330 C1360,345 1400,355 1440,360" 
          fill="none" 
          stroke="#F2FFE3" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BrushDrawingIsland;
