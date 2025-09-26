import React, { useEffect, useRef } from 'react';

// Array de experience data
const experienceData = [
  {
    id: "01",
    title: "UX/UI & Frontend Developer",
    company: "OPINATOR (Madrid, Spain)",
    description: "Led the UX/UI redesign of OPINATOR's live forms WebApp, collaborating with a team of five to enhance user experience, accessibility, and developer workflows.",
    highlight: "Designed a modular design system with Figma and implemented frontend with React, boosting form response rates by 30%.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Opinator.jpeg"
  },
  {
    id: "02",
    title: "UX/UI & Webflow Developer",
    company: "ANCIENT TECH (Houston, Texas & LATAM)",
    description: "Directed a four-month UX engineering process to design and develop Ancient Tech's main web platform in Webflow, emphasizing intuitive user interactions.",
    highlight: "Built an AI-driven interactive hero banner with WebGL animations, enhancing engagement and visual appeal.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Ancient.png"
  },
  {
    id: "03",
    title: "Design Engineer & Fullstack Developer",
    company: "AURIN (SODIO) (Cuernavaca, México)",
    description: "Designed mobile and web UX/UI for MonexOne and web apps like Inglesindividual, Galicia MX, Dentol MX, and Fintpay Banking, while leading fullstack development and AI automations.",
    highlight: "Developed Aurin Task Manager with Next.js, Firestore, Clerk, and AI-powered task summaries, streamlining team workflows with temporary dynamic links.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Aurin.jpeg"
  },
  {
    id: "04",
    title: "Senior UX/UI Designer",
    company: "ATHENIS AI (LATAM & EU)",
    description: "Led UX/UI design for an AI-driven educational platform, creating intuitive interfaces and component libraries to enhance user engagement and developer efficiency.",
    highlight: "Crafted a Figma-to-React component library for Login and Dashboard, improving handoff efficiency by 25%.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/AthenisAI.jpeg"
  },
  {
    id: "05",
    title: "Founder & Design Engineer",
    company: "WEBCRAFTERS (Mexico City)",
    description: "Founded WebCrafters, a UX/UI and Web Art agency, delivering custom web applications with AI-driven features, 3D animations, and scalable architectures.",
    highlight: "Led design and deployment of visually stunning web solutions with Three.js and AI integrations, serving diverse industries.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/WebCrafters.jpeg"
  }
];

const ExperienceMarqueeIsland: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear el marquee de experience cards
    const createExperienceMarquee = () => {
      const container = containerRef.current;
      if (!container) return;

      // Limpiar contenido existente
      container.innerHTML = '';

      // Crear marquee wrapper
      const marqueeWrapper = document.createElement('div');
      marqueeWrapper.className = 'experience-marquee-wrapper';

      // Crear marquee container
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'experience-marquee';

      // Función para crear una card de experience
      const createExperienceCard = (experience: typeof experienceData[0]) => {
        const card = document.createElement('div');
        card.className = 'experience-card-marquee';
        
        card.innerHTML = `
          <div class="experience-header">
            <div class="experience-number">${experience.id}</div>
            <img class="experience-image" src="${experience.image}" alt="${experience.company}" loading="lazy" />
          </div>
          <div class="experience-content">
            <div class="experience-title">${experience.title}</div>
            <div class="experience-company">${experience.company}</div>
          </div>
          <div class="experience-description">
            <span class="description-normal">${experience.description}</span>
            <span class="description-highlight">${experience.highlight}</span>
          </div>
        `;
        
        return card;
      };

      // Crear primera serie de cards
      const firstSet = document.createElement('div');
      firstSet.className = 'experience-set';
      experienceData.forEach(experience => {
        firstSet.appendChild(createExperienceCard(experience));
      });

      // Crear segunda serie de cards (duplicada para seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'experience-set';
      experienceData.forEach(experience => {
        secondSet.appendChild(createExperienceCard(experience));
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
    };

    // Crear el marquee al montar el componente
    createExperienceMarquee();
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
    <div ref={containerRef} className="experience-marquee-container">
      {/* El contenido se genera dinámicamente con JavaScript vanilla */}
    </div>
  );
};

export default ExperienceMarqueeIsland;
