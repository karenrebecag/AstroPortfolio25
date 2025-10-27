import React, { useEffect, useRef } from 'react';

// Definición del tipo para un solo proyecto
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  type: string;
}

// Props del componente
interface ProjectMarqueeIslandProps {
  projects: Project[];
}

const ProjectMarqueeIsland: React.FC<ProjectMarqueeIslandProps> = React.memo(({ projects: projectData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear el marquee de project cards
    const createProjectMarquee = () => {
      const container = containerRef.current;
      if (!container) return;

      // Limpiar contenido existente
      container.innerHTML = '';

      // Crear marquee wrapper
      const marqueeWrapper = document.createElement('div');
      marqueeWrapper.className = 'project-marquee-wrapper';

      // Crear marquee container
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'project-marquee';

      // Función para crear una card de project
      const createProjectCard = (project: typeof projectData[0]) => {
        const card = document.createElement('div');
        card.className = 'project-card-marquee';
        card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${project.image})`;
        
        card.innerHTML = `
          <div class="project-card-content">
            <div class="project-card-header">
              <div class="project-number">${project.id}</div>
              <div class="project-type">${project.type}</div>
            </div>
            <div class="project-card-body">
              <h3 class="project-card-title">${project.title}</h3>
              <p class="project-card-description">${project.description}</p>
            </div>
            <div class="project-card-footer">
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
              </div>
              <button class="project-visit-btn" data-url="${project.url}">
                <span class="visit-text">Visit</span>
                <svg class="visit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </button>
            </div>
          </div>
        `;
        
        // Agregar event listener al botón Visit
        const visitBtn = card.querySelector('.project-visit-btn') as HTMLButtonElement;
        if (visitBtn) {
          visitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const url = visitBtn.dataset.url;
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          });
        }

        // Agregar event listener a toda la card para navegación
        card.addEventListener('click', (e) => {
          // Solo si no se clickeó el botón Visit
          if (!(e.target as Element).closest('.project-visit-btn')) {
            const url = project.url;
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }
        });
        
        return card;
      };

      // Crear primera serie de cards
      const firstSet = document.createElement('div');
      firstSet.className = 'project-set';
      projectData.forEach(project => {
        firstSet.appendChild(createProjectCard(project));
      });

      // Crear segunda serie de cards (duplicada para seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'project-set';
      projectData.forEach(project => {
        secondSet.appendChild(createProjectCard(project));
      });

      // Agregar ambos sets al marquee
      marqueeContainer.appendChild(firstSet);
      marqueeContainer.appendChild(secondSet);
      marqueeWrapper.appendChild(marqueeContainer);
      container.appendChild(marqueeWrapper);

      // Crear segundo marquee (dirección opuesta con elementos invertidos)
      const marqueeWrapper2 = document.createElement('div');
      marqueeWrapper2.className = 'project-marquee-wrapper project-marquee-reverse';

      const marqueeContainer2 = document.createElement('div');
      marqueeContainer2.className = 'project-marquee project-marquee-opposite';

      // Crear primera serie de cards invertidas
      const firstSetReverse = document.createElement('div');
      firstSetReverse.className = 'project-set';
      // Invertir el orden del array
      [...projectData].reverse().forEach(project => {
        firstSetReverse.appendChild(createProjectCard(project));
      });

      // Crear segunda serie de cards invertidas (duplicada para seamless loop)
      const secondSetReverse = document.createElement('div');
      secondSetReverse.className = 'project-set';
      [...projectData].reverse().forEach(project => {
        secondSetReverse.appendChild(createProjectCard(project));
      });

      // Agregar ambos sets al segundo marquee
      marqueeContainer2.appendChild(firstSetReverse);
      marqueeContainer2.appendChild(secondSetReverse);
      marqueeWrapper2.appendChild(marqueeContainer2);
      container.appendChild(marqueeWrapper2);
    };

    // Configurar IntersectionObserver para performance
    const setupIntersectionObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const marquees = entry.target.querySelectorAll('.project-marquee');
            marquees.forEach((marquee) => {
              if (entry.isIntersecting) {
                (marquee as HTMLElement).style.animationPlayState = 'running';
              } else {
                (marquee as HTMLElement).style.animationPlayState = 'paused';
              }
            });
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
    };

    // Crear el marquee al montar el componente
    createProjectMarquee();
    setupIntersectionObserver();

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="project-marquee-container">
      {/* Container will be populated by vanilla JS */}
    </div>
  );
});

export default ProjectMarqueeIsland;
