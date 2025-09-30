import React, { useEffect, useRef } from 'react';
// @ts-ignore - Splide types issue with package.json exports
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { motion } from 'motion/react';
import '@splidejs/splide/css/core';

interface ExperienceData {
  id: string;
  title: string;
  company: string;
  description: string;
  highlight: string;
  image: string;
  resumeAnchor?: string;
}

interface ExperienceSliderProps {
  experienceData: ExperienceData[];
}

const ExperienceSlider: React.FC<ExperienceSliderProps> = ({ experienceData }) => {
  const splideRef = useRef<typeof Splide>(null);

  useEffect(() => {
    // Inicialización del slider - simplificado para evitar errores de tipos
    console.log('Experience slider initialized');
  }, []);

  const splideOptions = {
    type: 'slide' as const,
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    arrows: true,
    pagination: true,
    drag: true,
    snap: true,
    keyboard: 'global',
    wheel: false,
    autoplay: false,
    interval: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false,
    lazyLoad: 'nearby',
    preloadPages: 1,
    classes: {
      arrows: 'splide__arrows experience-slider-arrows',
      arrow: 'splide__arrow experience-slider-arrow',
      prev: 'splide__arrow--prev experience-slider-prev',
      next: 'splide__arrow--next experience-slider-next',
      pagination: 'splide__pagination experience-slider-pagination',
      page: 'splide__pagination__page experience-slider-page',
    },
    breakpoints: {
      480: {
        gap: '0.5rem',
      },
    },
  };

  return (
    <motion.div
      className="experience-slider-container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <Splide
        ref={splideRef}
        options={splideOptions}
        className="experience-splide"
        aria-label="Experience Cards Slider"
      >
        {experienceData.map((experience, index) => (
          <SplideSlide key={experience.id}>
            <motion.div
              className="experience-card-slider"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index * 0.1 
              }}
            >
              {/* Card Header */}
              <div className="experience-header-slider">
                <div className="experience-number-slider">{experience.id}</div>
                <img
                  src={experience.image}
                  alt={`${experience.company} logo`}
                  className="experience-image-slider"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="experience-content-slider">
                <h3 className="experience-title-slider">{experience.title}</h3>
                <h4 className="experience-company-slider">{experience.company}</h4>
              </div>

              {/* Card Description */}
              <div className="experience-description-slider">
                <p className="description-normal-slider">
                  {experience.description}
                </p>
                <p className="description-highlight-slider">
                  {experience.highlight}
                </p>
              </div>

              {/* Read More Button */}
              <div className="experience-actions">
                <button 
                  className="read-more-btn"
                  onClick={() => {
                    window.location.href = `/resume#experience`;
                  }}
                >
                  <span className="btn-text">Read More</span>
                  <svg className="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          </SplideSlide>
        ))}
      </Splide>
    </motion.div>
  );
};

export default ExperienceSlider;
