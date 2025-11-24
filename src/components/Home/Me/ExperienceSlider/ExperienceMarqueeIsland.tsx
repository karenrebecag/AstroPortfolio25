import React, { useEffect, useRef } from 'react';
import type { ExperienceItem } from '../../../../data/experienceData';
import { t } from '../../../../i18n/utils.js';

interface ExperienceMarqueeIslandProps {
  experienceData: ExperienceItem[];
  lang: string;
}

// Experience Card Component - Pure JSX (no innerHTML)
const ExperienceCard: React.FC<{ experience: ExperienceItem, lang: string }> = ({ experience, lang }) => {
  return (
    <div className="experience-card-marquee">
      <div className="experience-header">
        <div className="experience-number">{experience.id}</div>
        <img
          className="experience-image"
          src={experience.image}
          alt={experience.company}
          loading="lazy"
        />
      </div>
      <div className="experience-content">
        <div className="experience-title">{experience.title}</div>
        <div className="experience-company">{experience.company}</div>
      </div>
      <div className="experience-description">
        <span className="description-normal">{experience.description}</span>
        <span className="description-highlight">{experience.highlight}</span>
      </div>
    </div>
  );
};

const ExperienceMarqueeIsland: React.FC<ExperienceMarqueeIslandProps> = ({ experienceData, lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup IntersectionObserver for performance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const marquee = entry.target.querySelector('.experience-marquee');
          if (marquee) {
            if (entry.isIntersecting) {
              (marquee as HTMLElement).style.animationPlayState = 'running';
            } else {
              (marquee as HTMLElement).style.animationPlayState = 'paused';
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="experience-marquee-container">
      <div className="experience-marquee-wrapper">
        <div className="experience-marquee">
          {/* First set of cards */}
          <div className="experience-set">
            {experienceData.map((experience) => (
              <ExperienceCard key={`first-${experience.id}`} experience={experience} lang={lang} />
            ))}
          </div>
          {/* Second set of cards (duplicated for seamless loop) */}
          <div className="experience-set">
            {experienceData.map((experience) => (
              <ExperienceCard key={`second-${experience.id}`} experience={experience} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceMarqueeIsland;
