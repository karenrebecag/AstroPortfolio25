import React from 'react';
import { MarqueeAnimation } from './MarqueeAnimation';
import ErrorBoundary from './ErrorBoundary';

const MarqueesIsland: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="marquees-container">
        {/* Marquee superior - rotado hacia la derecha, z-index más bajo */}
        <div className="marquee-wrapper first-marquee">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-2}
            className="text-white py-2 font-display"
          >
            CREATIVE • DEVELOPER • DESIGNER • PORTFOLIO
          </MarqueeAnimation>
        </div>
        {/* Marquee inferior - rotado hacia la izquierda, z-index más alto */}
        <div className="marquee-wrapper second-marquee">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-2}
            className="text-white py-2 font-display"
          >
            FRONTEND • BACKEND • FULLSTACK • PROJECTS
          </MarqueeAnimation>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MarqueesIsland;
