import React, { useEffect, useRef, useMemo } from 'react';
import { initMarqueeAdvanced, cleanupMarquees } from '../../../utils/initMarquee';
import ErrorBoundary from './ErrorBoundary';
import { t } from '../../../i18n/utils.js';
import styles from './Marquees.module.css';

interface MarqueesIslandProps {
  lang: string;
}

interface MarqueeConfig {
  id: string;
  direction: 'left' | 'right';
  speed: number;
  scrollSpeed: number;
  duplicate: number;
  text: string;
  className: string;
}

// Arrow SVG component for visual interest
const ArrowIcon: React.FC = () => (
  <svg
    className={styles['marquee__advanced__arrow-svg']}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MarqueesIsland: React.FC<MarqueesIslandProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !containerRef.current) return;

    const timeoutId = setTimeout(async () => {
      const marquees = containerRef.current?.querySelectorAll<HTMLElement>('[data-marquee-scroll-direction-target]');
      if (!marquees) return;

      for (const marquee of marquees) {
        await initMarqueeAdvanced(marquee);
      }

      isInitializedRef.current = true;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupMarquees();
    };
  }, []);

  const marqueeConfigs: MarqueeConfig[] = useMemo(() => [
    {
      id: 'first-marquee',
      direction: 'right',
      speed: 18,
      scrollSpeed: 8,
      duplicate: 3,
      text: t('banner.leftMarquee', lang),
      className: styles['first-marquee']
    },
    {
      id: 'second-marquee',
      direction: 'left',
      speed: 15,
      scrollSpeed: 10,
      duplicate: 3,
      text: t('banner.rightMarquee', lang),
      className: styles['second-marquee']
    }
  ], [lang]);

  return (
    <ErrorBoundary lang={lang}>
      <div ref={containerRef} className={styles['marquees-container']}>
        {marqueeConfigs.map((config) => (
          <div
            key={config.id}
            className={`${styles['marquee-wrapper']} ${config.className}`}
          >
            <div
              id={config.id}
              data-marquee-scroll-direction-target=""
              data-marquee-direction={config.direction}
              data-marquee-status="normal"
              data-marquee-speed={config.speed}
              data-marquee-scroll-speed={config.scrollSpeed}
              data-marquee-duplicate={config.duplicate}
              className={styles['marquee-advanced']}
            >
              <div data-marquee-scroll-target="" className={styles['marquee-advanced__scroll']}>
                <div data-marquee-collection-target="" className={styles['marquee-advanced__collection']}>
                  <div className={styles['marquee-advanced__item']}>
                    <ArrowIcon />
                    <p className={`${styles['marquee__advanced__p']} font-display`}>
                      {config.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default MarqueesIsland;
