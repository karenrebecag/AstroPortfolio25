import React from 'react';
import { MarqueeAnimation } from './MarqueeAnimation';
import ErrorBoundary from './ErrorBoundary';

const TechMarqueesIsland: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="tech-marquees-container">
        {/* Primer marquee - dirección derecha */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.8}
            className="text-black py-2 font-display"
          >
            REACT • NEXT.JS • TYPESCRIPT • JAVASCRIPT • ASTRO • TAILWIND CSS
          </MarqueeAnimation>
        </div>
        
        {/* Segundo marquee - dirección izquierda */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.9}
            className="text-black py-2 font-display"
          >
            NODE.JS • EXPRESS • MONGODB • POSTGRESQL • PRISMA • SUPABASE
          </MarqueeAnimation>
        </div>
        
        {/* Tercer marquee - dirección derecha */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.7}
            className="text-black py-2 font-display"
          >
            FIGMA • ADOBE XD • PHOTOSHOP • ILLUSTRATOR • BLENDER • THREE.JS
          </MarqueeAnimation>
        </div>
        
        {/* Cuarto marquee - dirección izquierda */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.85}
            className="text-black py-2 font-display"
          >
            GIT • GITHUB • VERCEL • NETLIFY • DOCKER • AWS • FIREBASE
          </MarqueeAnimation>
        </div>
        
        {/* Quinto marquee - dirección derecha */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.75}
            className="text-black py-2 font-display"
          >
            PYTHON • DJANGO • FLASK • FASTAPI • REDIS • ELASTICSEARCH
          </MarqueeAnimation>
        </div>
        
        {/* Sexto marquee - dirección izquierda */}
        <div className="tech-marquee-wrapper">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.9}
            className="text-black py-2 font-display"
          >
            WEBPACK • VITE • ROLLUP • BABEL • ESLINT • PRETTIER • JEST
          </MarqueeAnimation>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TechMarqueesIsland;
