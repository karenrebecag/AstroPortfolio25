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
    url: "https://www.figma.com/design/B5hLcZbHpNdXNf0KZDcNEL/Zachariel?node-id=0-1&t=1XoEGZ6UT6SXB8T8-1",
    type: "Landing Page"
  },
  {
    id: "03",
    title: "Ancient Tech Redesign",
    description: "UI/UX redesign for AI-powered tech consulting platform with modern interface",
    tags: ["Figma", "Webflow", "UI Redesign"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/AncientTech.webp", 
    url: "https://www.figma.com/design/wOLxrlsIUMvcRJyOzgjIoD/AncientTech--Redesign-%F0%9F%9A%80?node-id=13-4752&t=NWKMSZ7OjeZrgLd7-1",
    type: "UI Redesign"
  },
  {
    id: "04",
    title: "Health-Ade Kombucha",
    description: "E-commerce redesign for premium probiotic kombucha brand with gut health focus",
    tags: ["Figma", "Shopify", "E-commerce"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/HealtAde.webp",
    url: "https://health-ade.com/",
    type: "E-commerce"
  },
  {
    id: "05",
    title: "Galicia 30 Años",
    description: "30th anniversary website design for prestigious Mexican law firm with disruptive approach",
    tags: ["Figma", "Web Design", "Anniversary"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Galicia30An%CC%83os.webp",
    url: "https://www.figma.com/design/2EkRHWv6kzGtflVeymrd52/Galicia?node-id=0-1&t=NG8PRVK7ZRsTVaAa-1", 
    type: "Anniversary Site"
  },
  {
    id: "06",
    title: "Cadence OTC",
    description: "E-commerce platform for affordable emergency contraception with nationwide store locator",
    tags: ["Figma", "Shopify", "Healthcare"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/cadenceotp.webp",
    url: "https://www.figma.com/proto/DL7gTFQHcZpLk9qdMLnPjF/Cadence_?page-id=0%3A1&node-id=0-2053&starting-point-node-id=0%3A2053&scaling=scale-down&content-scaling=fixed&t=36j4E3j6RBpvITq2-1",
    type: "Healthcare E-commerce"
  },
  {
    id: "07",
    title: "ToTou Energy Bars",
    description: "UI redesign for Mexican energy bar company with modern branding and product showcase",
    tags: ["Figma", "UI Redesign", "Food & Beverage"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/ToYou.webp",
    url: "https://www.figma.com/proto/XrmpPR40YlSaTVcTuNR4Hr/ToYou--Redesign-?page-id=51%3A24&node-id=51-36&scaling=scale-down-width&content-scaling=fixed&t=yYI0ETCoFxSK3m01-1",
    type: "UI Redesign"
  },
  {
    id: "08",
    title: "JarvioAI Canvas Prototype",
    description: "Vibe Code prototype for AI-powered Amazon seller management platform with interactive canvas",
    tags: ["Next.js", "Vibe Code", "AI Platform"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/ChatGPT%20Image%20Sep%2029%2C%202025%2C%2011_13_13%20AM.webp",
    url: "https://github.com/karenrebecag/JarvioPrototype",
    type: "Vibe Code"
  },
  {
    id: "09",
    title: "Inglés Individual Platform",
    description: "Full-stack educational platform for 50+ franchise locations managing students, teachers and payments",
    tags: ["Laravel", "Anime.js", "Bootstrap"],
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/InglesIndividualFrontend.webp",
    url: "#",
    type: "Educational Platform"
  }
];

const ProjectMarqueeIsland: React.FC = React.memo(() => {
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
