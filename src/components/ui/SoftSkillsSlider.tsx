import React, { useEffect, useRef } from 'react';
// @ts-ignore - Splide types issue with package.json exports
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { motion } from 'motion/react';
import '@splidejs/splide/css/core';

// Estilos inline optimizados - sin background individual, usará el compartido
const cardStyles: React.CSSProperties = {
  width: '100%',
  minHeight: '268px',
  padding: '20px',
  // Remove individual background, will use shared silk background
  background: 'transparent',
  border: '1px solid rgba(74, 36, 181, 0.3)',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '12px',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  margin: '0 auto',
  zIndex: 4 // Above shared silk background
};

// Estilos para elementos internos con texto blanco
const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%'
};

const numberStyles: React.CSSProperties = {
  color: 'white',
  fontSize: '1.5rem',
  fontFamily: 'var(--font-primary)',
  fontWeight: 500,
  lineHeight: '2rem'
};

const contentStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '100%'
};

const titleStyles: React.CSSProperties = {
  width: '100%',
  color: 'white',
  fontSize: '1.5rem',
  fontFamily: 'var(--font-primary)',
  fontWeight: 700,
  textTransform: 'uppercase',
  lineHeight: '2rem',
  margin: 0
};

const descriptionStyles: React.CSSProperties = {
  alignSelf: 'stretch',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const normalTextStyles: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.125rem',
  fontFamily: 'var(--font-primary)',
  fontWeight: 500,
  lineHeight: '1.625rem',
  margin: 0
};

const highlightTextStyles: React.CSSProperties = {
  color: '#E0D4FF',
  fontSize: '1.125rem',
  fontFamily: 'var(--font-primary)',
  fontWeight: 500,
  lineHeight: '1.625rem',
  margin: 0
};

interface SoftSkillData {
  id: string;
  title: string;
  description: string;
  highlight: string;
}

interface SoftSkillsSliderProps {
  softSkillsData: SoftSkillData[];
}

const SoftSkillsSlider: React.FC<SoftSkillsSliderProps> = ({ softSkillsData }) => {
  const splideRef = useRef<Splide>(null);

  useEffect(() => {
    // Inicialización del slider
    if (splideRef.current) {
      const splideInstance = splideRef.current.splide;
      
      // Event listeners para animaciones personalizadas
      splideInstance?.on('moved', (newIndex: number) => {
        // Animaciones personalizadas cuando cambia de slide
        console.log('Moved to slide:', newIndex);
      });
    }
  }, []);

  const splideOptions = {
    type: 'slide',
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
      arrows: 'splide__arrows soft-skills-slider-arrows',
      arrow: 'splide__arrow soft-skills-slider-arrow',
      prev: 'splide__arrow--prev soft-skills-slider-prev',
      next: 'splide__arrow--next soft-skills-slider-next',
      pagination: 'splide__pagination soft-skills-slider-pagination',
      page: 'splide__pagination__page soft-skills-slider-page',
    },
    breakpoints: {
      480: {
        gap: '0.5rem',
      },
    },
  };

  // Agregar estilos CSS dinámicamente
  useEffect(() => {
    const styleId = 'soft-skills-slider-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Slider card background effects - matching desktop cards */
        .skill-card-slider::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/images/SilkCardFallback.webp');
          background-size: cover;
          background-position: center;
          border-radius: inherit;
          z-index: -2;
        }

        .skill-card-slider::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(74, 36, 181, 0.1) 0%,
            rgba(157, 127, 193, 0.05) 50%,
            rgba(184, 163, 255, 0.1) 100%);
          border-radius: inherit;
          z-index: -1;
        }

        .soft-skills-slider-arrows {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          position: absolute !important;
          top: 50% !important;
          left: 0 !important;
          right: 0 !important;
          transform: translateY(-50%) !important;
          pointer-events: none !important;
          z-index: 10 !important;
        }

        .soft-skills-slider-arrow {
          width: 44px !important;
          height: 44px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(74, 36, 181, 0.2) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          pointer-events: auto !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          backdrop-filter: blur(10px) !important;
        }

        .soft-skills-slider-arrow:hover {
          background: rgba(74, 36, 181, 0.1) !important;
          border-color: rgba(74, 36, 181, 0.4) !important;
          transform: scale(1.05) !important;
        }

        .soft-skills-slider-arrow:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: scale(1) !important;
        }

        .soft-skills-slider-arrow svg {
          width: 18px !important;
          height: 18px !important;
          fill: #4A24B5 !important;
        }

        .soft-skills-slider-prev svg {
          transform: rotate(180deg) !important;
        }

        .soft-skills-slider-prev {
          left: -22px !important;
        }

        .soft-skills-slider-next {
          right: -22px !important;
        }

        .soft-skills-slider-pagination {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 8px !important;
          margin-top: 24px !important;
          padding: 0 !important;
          list-style: none !important;
        }

        .soft-skills-slider-page {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: rgba(74, 36, 181, 0.3) !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          padding: 0 !important;
        }

        .soft-skills-slider-page.is-active {
          background: #4A24B5 !important;
          transform: scale(1.2) !important;
        }

        .soft-skills-slider-page:hover {
          background: rgba(74, 36, 181, 0.6) !important;
          transform: scale(1.1) !important;
        }

        @media (max-width: 767px) {
          .soft-skills-slider-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          .soft-skills-splide {
            padding: 0 !important;
            margin: 0 !important;
          }

          .soft-skills-slide {
            padding: 0 !important;
          }
        }

        @media (max-width: 480px) {
          .soft-skills-slider-prev {
            left: -15px !important;
          }

          .soft-skills-slider-next {
            right: -15px !important;
          }

          .soft-skills-slider-arrow {
            width: 36px !important;
            height: 36px !important;
          }

          .soft-skills-slider-arrow svg {
            width: 14px !important;
            height: 14px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
      <motion.div
        className="soft-skills-slider-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
      <Splide
        ref={splideRef}
        options={splideOptions}
        className="soft-skills-splide"
        aria-label="Soft Skills Cards Slider"
      >
        {softSkillsData.map((skill, index) => (
          <SplideSlide key={skill.id} className="soft-skills-slide">
            <motion.div
              className="skill-card-slider"
              style={cardStyles}
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
              <div style={headerStyles}>
                <div style={numberStyles}>{skill.id}</div>
              </div>

              {/* Card Content */}
              <div style={contentStyles}>
                <h3 style={titleStyles}>{skill.title}</h3>
              </div>

              {/* Card Description */}
              <div style={descriptionStyles}>
                <p style={normalTextStyles}>
                  {skill.description}
                </p>
                <p style={highlightTextStyles}>
                  {skill.highlight}
                </p>
              </div>
            </motion.div>
          </SplideSlide>
        ))}
      </Splide>
      </motion.div>
  );
};

export default SoftSkillsSlider;
