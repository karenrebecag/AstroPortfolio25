import React, { useEffect, useRef } from 'react';
import { initMarqueeAdvanced, cleanupMarquees } from '../../../../utils/initMarquee';
import ErrorBoundary from '../../Marquees/ErrorBoundary';
import styles from '../TechMarquees.module.css';

interface TechMarqueeConfig {
  id: string;
  direction: 'left' | 'right';
  speed: number;
  scrollSpeed: number;
  duplicate: number;
  text: string;
}

const techMarqueeData: TechMarqueeConfig[] = [
  {
    id: 'tech-marquee-1',
    direction: 'right',
    speed: 25,
    scrollSpeed: 6,
    duplicate: 3,
    text: 'REACT • NEXT.JS • TYPESCRIPT • ASTRO • THREE.JS • GSAP • FRAMER MOTION'
  },
  {
    id: 'tech-marquee-2',
    direction: 'left',
    speed: 22,
    scrollSpeed: 7,
    duplicate: 3,
    text: 'NODE.JS • PYTHON • FASTAPI • PRISMA • FIRESTORE • SUPABASE • POSTGRESQL'
  },
  {
    id: 'tech-marquee-3',
    direction: 'right',
    speed: 28,
    scrollSpeed: 5,
    duplicate: 3,
    text: 'FIGMA • WEBFLOW • FRAMER • BLENDER • THREE.JS • PHOTOSHOP'
  },
  {
    id: 'tech-marquee-4',
    direction: 'left',
    speed: 24,
    scrollSpeed: 6,
    duplicate: 3,
    text: 'GIT • GITHUB • VERCEL • DOCKER • GITHUB ACTIONS • SENTRY • FIREBASE'
  },
  {
    id: 'tech-marquee-5',
    direction: 'right',
    speed: 26,
    scrollSpeed: 5,
    duplicate: 3,
    text: 'OPENAI API • GEMINI • CLAUDE • N8N • MAKE • ZAPIER • LANGCHAIN'
  },
  {
    id: 'tech-marquee-6',
    direction: 'left',
    speed: 23,
    scrollSpeed: 7,
    duplicate: 3,
    text: 'VITE • TAILWIND • SASS • JEST • ESLINT • PRETTIER • STORYBOOK'
  }
];

const TechMarqueesIsland: React.FC = () => {
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

  return (
    <ErrorBoundary>
      <div ref={containerRef} className={styles.techMarqueesContainer}>
        {techMarqueeData.map((config) => (
          <div key={config.id} className={styles.techMarqueeWrapper}>
            <div
              id={config.id}
              data-marquee-scroll-direction-target=""
              data-marquee-direction={config.direction}
              data-marquee-status="normal"
              data-marquee-speed={config.speed}
              data-marquee-scroll-speed={config.scrollSpeed}
              data-marquee-duplicate={config.duplicate}
              className={styles.marqueeAdvanced}
            >
              <div data-marquee-scroll-target="" className={styles.marqueeAdvancedScroll}>
                <div data-marquee-collection-target="" className={styles.marqueeAdvancedCollection}>
                  <div className={styles.marqueeAdvancedItem}>
                    <span className={styles.marqueeText}>
                      {config.text}
                    </span>
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

export default TechMarqueesIsland;
