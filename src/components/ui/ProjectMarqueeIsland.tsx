import React, { useEffect, useRef } from 'react';

// Array de project data para proyectos rápidos (landing pages, no-code, vibe code, etc.)
const projectData = [
  {
    id: "01",
    title: "AWE MX",
    description: "Global XR community platform promoting spatial computing and AI innovation in Mexico",
    tags: ["Astro", "XR Community", "Events Platform"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/AWEMX.webp",
    url: "https://awexr.mx/",
    type: "Community Platform"
  },
  {
    id: "02", 
    title: "Zachariel Banking",
    description: "Fintech waitlist landing page with $100 signup bonus and premium banking features",
    tags: ["Webflow", "UI Design", "Fintech"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Zachariel.webp",
    url: "#",
    type: "Landing Page"
  },
  {
    id: "03",
    title: "Vibe Music App",
    description: "Creative music streaming interface with particle effects",
    tags: ["React", "Three.js", "Vibe Code"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/project-music.jpg", 
    url: "https://vibe-music-app.netlify.app",
    type: "Vibe Code"
  },
  {
    id: "04",
    title: "E-commerce Store",
    description: "Minimalist fashion store with smooth animations",
    tags: ["Shopify", "Liquid", "GSAP"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/project-ecommerce.jpg",
    url: "https://fashion-store-demo.myshopify.com",
    type: "E-commerce"
  },
  {
    id: "05",
    title: "Portfolio Template",
    description: "Creative portfolio template with custom cursor effects",
    tags: ["Astro", "TypeScript", "Motion"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/project-portfolio.jpg",
    url: "https://portfolio-template-demo.vercel.app", 
    type: "Template"
  },
  {
    id: "06",
    title: "Restaurant Menu",
    description: "Interactive digital menu with QR code integration",
    tags: ["Vue.js", "PWA", "QR Code"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/project-restaurant.jpg",
    url: "https://restaurant-menu-pwa.netlify.app",
    type: "PWA"
  }
];

const ProjectMarqueeIsland: React.FC = () => {
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
    };

    // Configurar IntersectionObserver para performance
    const setupIntersectionObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const marquee = entry.target.querySelector('.project-marquee');
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
      {/* El contenido se genera dinámicamente con JavaScript vanilla */}
    </div>
  );
};

export default ProjectMarqueeIsland;
