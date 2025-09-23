import React, { useEffect, useState } from 'react';
import { MarqueeAnimation } from './MarqueeAnimation';
import ErrorBoundary from './ErrorBoundary';
import RingSphereBackground from '../three/RingSphereBackground';

interface MyStackIslandProps {
  className?: string;
}

const MyStackIsland: React.FC<MyStackIslandProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // IntersectionObserver para optimizar performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '200px 0px 200px 0px' // Activación temprana
      }
    );
    
    const element = document.querySelector('.my-stack-island');
    if (element) {
      observer.observe(element);
    }
    
    return () => observer.disconnect();
  }, []);

  // Page Visibility API para pausar en tabs inactivos
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // No longer need Tenor script for 3D Kirby

  return (
    <ErrorBoundary>
      <div className={`my-stack-island ${className}`}>
        {/* Área del contenido principal */}
        <div className="stack-content-area">
          {/* Contenedor para el modelo 3D RingSphere */}
          <div className="model-3d-container">
            {/* RingSphere 3D Background con mismas optimizaciones que GemBackground */}
            <RingSphereBackground className="ringsphere-background" />
          </div>
          
          {/* Marquees en la parte inferior */}
          <div className="tech-marquees-wrapper">
            {isVisible && !isPaused && (
              <>
                {/* Primer marquee - dirección derecha */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="right"
                    baseVelocity={-0.8}
                    className="text-black py-2 font-game"
                  >
                    REACT • NEXT.JS • TYPESCRIPT • JAVASCRIPT • ASTRO • TAILWIND CSS
                  </MarqueeAnimation>
                </div>
                
                {/* Segundo marquee - dirección izquierda */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="left"
                    baseVelocity={-0.9}
                    className="text-black py-2 font-game"
                  >
                    NODE.JS • EXPRESS • MONGODB • POSTGRESQL • PRISMA • SUPABASE
                  </MarqueeAnimation>
                </div>
                
                {/* Tercer marquee - dirección derecha */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="right"
                    baseVelocity={-0.7}
                    className="text-black py-2 font-game"
                  >
                    FIGMA • ADOBE XD • PHOTOSHOP • ILLUSTRATOR • BLENDER • THREE.JS
                  </MarqueeAnimation>
                </div>
                
                {/* Cuarto marquee - dirección izquierda */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="left"
                    baseVelocity={-0.85}
                    className="text-black py-2 font-game"
                  >
                    GIT • GITHUB • VERCEL • NETLIFY • DOCKER • AWS • FIREBASE
                  </MarqueeAnimation>
                </div>
                
                {/* Quinto marquee - dirección derecha */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="right"
                    baseVelocity={-0.75}
                    className="text-black py-2 font-game"
                  >
                    PYTHON • DJANGO • FLASK • FASTAPI • REDIS • ELASTICSEARCH
                  </MarqueeAnimation>
                </div>
                
                {/* Sexto marquee - dirección izquierda */}
                <div className="tech-marquee-item">
                  <MarqueeAnimation
                    direction="left"
                    baseVelocity={-0.9}
                    className="text-black py-2 font-game"
                  >
                    WEBPACK • VITE • ROLLUP • BABEL • ESLINT • PRETTIER • JEST
                  </MarqueeAnimation>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MyStackIsland;
