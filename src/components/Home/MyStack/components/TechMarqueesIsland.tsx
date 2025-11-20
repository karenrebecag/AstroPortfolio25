import React from 'react';
import { MarqueeAnimation } from './MarqueeAnimation';
import ErrorBoundary from '../../Marquees/ErrorBoundary';

interface TechMarqueesIslandProps {
  styles: {
    techMarqueesContainer: string;
    techMarqueeWrapper: string;
    marqueeText: string;
  };
}

const TechMarqueesIsland: React.FC<TechMarqueesIslandProps> = ({ styles }) => {
  return (
    <ErrorBoundary>
      <div className={styles.techMarqueesContainer}>
        {/* Primer marquee - dirección derecha */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.8}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            REACT • NEXT.JS • TYPESCRIPT • JAVASCRIPT • ASTRO • TAILWIND CSS
          </MarqueeAnimation>
        </div>
        
        {/* Segundo marquee - dirección izquierda */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.9}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            NODE.JS • EXPRESS • MONGODB • POSTGRESQL • PRISMA • SUPABASE
          </MarqueeAnimation>
        </div>
        
        {/* Tercer marquee - dirección derecha */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.7}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            FIGMA • ADOBE XD • PHOTOSHOP • ILLUSTRATOR • BLENDER • THREE.JS
          </MarqueeAnimation>
        </div>
        
        {/* Cuarto marquee - dirección izquierda */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.85}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            GIT • GITHUB • VERCEL • NETLIFY • DOCKER • AWS • FIREBASE
          </MarqueeAnimation>
        </div>
        
        {/* Quinto marquee - dirección derecha */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="right"
            baseVelocity={-0.75}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            PYTHON • DJANGO • FLASK • FASTAPI • REDIS • ELASTICSEARCH
          </MarqueeAnimation>
        </div>
        
        {/* Sexto marquee - dirección izquierda */}
        <div className={styles.techMarqueeWrapper}>
          <MarqueeAnimation
            direction="left"
            baseVelocity={-0.9}
            className={`${styles.marqueeText} py-2 font-game`}
          >
            WEBPACK • VITE • ROLLUP • BABEL • ESLINT • PRETTIER • JEST
          </MarqueeAnimation>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TechMarqueesIsland;
