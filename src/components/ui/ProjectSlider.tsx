import React, { useEffect, useRef } from 'react';
import type { QuickProject } from './types';

interface ProjectSliderProps {
  projectData: QuickProject[];
}

const ProjectSlider: React.FC<ProjectSliderProps> = ({ projectData }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const splideRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadSplide = async () => {
      try {
        const { Splide } = await import('@splidejs/splide');

        if (!mounted || !sliderRef.current) return;

        splideRef.current = new Splide(sliderRef.current, {
          type: 'slide',
          perPage: 1,
          perMove: 1,
          gap: '1rem',
          padding: '2rem',
          arrows: true,
          pagination: true,
          autoplay: false,
          pauseOnHover: true,
          pauseOnFocus: true,
          resetProgress: false,
          breakpoints: {
            768: { padding: '1rem' },
            480: { padding: '0.5rem' }
          }
        });

        splideRef.current.mount();
      } catch (error) {
        console.error('Error loading Splide:', error);
      }
    };

    loadSplide();

    return () => {
      mounted = false;
      splideRef.current?.destroy();
      splideRef.current = null;
    };
  }, []);

  const handleVisitClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (url: string, e: React.MouseEvent) => {
    if (!(e.target as Element).closest('.project-visit-btn')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="project-slider-container">
      <div ref={sliderRef} className="project-splide splide">
        <div className="splide__track">
          <ul className="splide__list">
            {projectData.map((project) => (
              <li key={project.id} className="splide__slide project-slide">
                <div
                  className="project-card-slider"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleCardClick(project.url, e)}
                >
                  <div className="project-card-content">
                    <div className="project-card-header">
                      <div className="project-number-slider">{project.id}</div>
                      <div className="project-type-slider">{project.type}</div>
                    </div>
                    <div className="project-card-body">
                      <h3 className="project-card-title-slider">{project.title}</h3>
                      <p className="project-card-description-slider">{project.description}</p>
                    </div>
                    <div className="project-card-footer">
                      <div className="project-tags-slider">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="project-tag-slider">{tag}</span>
                        ))}
                      </div>
                      <button
                        className="project-visit-btn-slider"
                        onClick={(e) => handleVisitClick(project.url, e)}
                      >
                        <span className="visit-text-slider">Visit</span>
                        <svg className="visit-icon-slider" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlider;
