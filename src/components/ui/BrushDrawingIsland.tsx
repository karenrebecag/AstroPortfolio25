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
        
        {/* LÍNEA 1 - Y base: 120 */}
        <path 
          d="M0,120 C0,120 180,40 240,160 C300,280 420,20 480,-40 C540,-100 660,-60 720,40 C780,140 900,90 960,20 C1020,-50 1140,-20 1200,60 C1260,140 1320,100 1380,40 C1420,0 1440,-20 1440,-20" 
          fill="none" 
          stroke="#C0D645" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 2 - Y base: 180 (+60px) */}
        <path 
          d="M0,180 C0,180 180,100 240,220 C300,340 420,80 480,20 C540,-40 660,0 720,100 C780,200 900,150 960,80 C1020,10 1140,40 1200,120 C1260,200 1320,160 1380,100 C1420,60 1440,40 1440,40" 
          fill="none" 
          stroke="#9DB79C" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 3 - Y base: 240 (+60px) */}
        <path 
          d="M0,240 C0,240 180,160 240,280 C300,400 420,140 480,80 C540,20 660,60 720,160 C780,260 900,210 960,140 C1020,70 1140,100 1200,180 C1260,260 1320,220 1380,160 C1420,120 1440,100 1440,100" 
          fill="none" 
          stroke="#C0D645" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 4 - Y base: 300 (+60px) */}
        <path 
          d="M0,300 C0,300 180,220 240,340 C300,460 420,200 480,140 C540,80 660,120 720,220 C780,320 900,270 960,200 C1020,130 1140,160 1200,240 C1260,320 1320,280 1380,220 C1420,180 1440,160 1440,160" 
          fill="none" 
          stroke="#DDFFB3" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* LÍNEA 5 - Y base: 360 (+60px) */}
        <path 
          d="M0,360 C0,360 180,280 240,400 C300,520 420,260 480,200 C540,140 660,180 720,280 C780,380 900,330 960,260 C1020,190 1140,220 1200,300 C1260,380 1320,340 1380,280 C1420,240 1440,220 1440,220" 
          fill="none" 
          stroke="#F2FFE3" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BrushDrawingIsland;
