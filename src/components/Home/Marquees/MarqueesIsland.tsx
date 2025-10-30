import React from 'react';
import { MarqueeAnimation } from '../MyStack/components/MarqueeAnimation';
import ErrorBoundary from './ErrorBoundary';
import { t } from '../../../i18n/utils.js';

interface MarqueesIslandProps {
  lang: string;
}

const MarqueesIsland: React.FC<MarqueesIslandProps> = ({ lang }) => {
  return (
    <ErrorBoundary>
      <div className="marquees-container">
        {/* Marquee superior - rotado hacia la derecha, z-index más bajo */}
        <div className="marquee-wrapper first-marquee">
          <MarqueeAnimation
            direction="right"
            baseVelocity={-2}
            className="main-marquee-text py-2 font-display"
          >
            {t('banner.leftMarquee', lang)}
          </MarqueeAnimation>
        </div>
        {/* Marquee inferior - rotado hacia la izquierda, z-index más alto */}
        <div className="marquee-wrapper second-marquee">
          <MarqueeAnimation
            direction="left"
            baseVelocity={-2}
            className="main-marquee-text py-2 font-display"
          >
            {t('banner.rightMarquee', lang)}
          </MarqueeAnimation>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MarqueesIsland;
