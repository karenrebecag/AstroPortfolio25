import React from 'react';
import { MarqueeAnimation } from './MarqueeAnimation';
import ErrorBoundary from './ErrorBoundary';

const AurinMarqueesIsland: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="aurin-marquees-container">
        {/* Marquee superior - rotado hacia la derecha, z-index más bajo */}
        <div className="aurin-marquee-wrapper aurin-first-marquee">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-1.5}
            className="text-white py-2 font-display"
          >
            TYPESCRIPT • NEXT.JS • REACT • FIRESTORE • ZUSTAND
          </MarqueeAnimation>
        </div>
        {/* Marquee inferior - rotado hacia la izquierda, z-index más alto */}
        <div className="aurin-marquee-wrapper aurin-second-marquee">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-1.5}
            className="text-white py-2 font-display"
          >
            TASK MANAGER • REAL-TIME • COLLABORATION • ENTERPRISE
          </MarqueeAnimation>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AurinMarqueesIsland;
