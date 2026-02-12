import React from 'react';
import { translations } from '../../../../i18n/translations.js';
import type { Service as CMSService } from '../../../../lib/cms';
import { useStackingCardsParallax } from '../hooks/useStackingCardsParallax';

interface Service {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  technologies: string[];
  example: string;
}

interface ServicesIslandProps {
  services: CMSService[];
  lang?: string;
}

const ServicesIsland: React.FC<ServicesIslandProps> = ({ services: cmsServices, lang = 'en' }) => {
  // Initialize stacking cards parallax effect
  const { containerRef } = useStackingCardsParallax({
    yPercent: 50,
    scale: 0.95,
    fadeOut: false,
  });

  // Obtener traducciones para el idioma actual (para fallback)
  const t = translations[lang as keyof typeof translations] || translations.en;
  const servicesData = t.services?.items || translations.en.services.items;

  // Fallback services array
  const fallbackServices: Service[] = [
    {
      id: 1,
      title1: "UX/UI Design",
      title2: "& Engineering",
      description: "I craft intuitive, user-centered interfaces and bridge design with development through technical UX engineering. From mobile prototypes in Figma to developer-friendly design systems with React components, I ensure seamless handoff and implementation.",
      tags: ["User Interface", "User Experience", "Design Systems", "Component Libraries", "Mobile Design", "Developer Handoff"],
      technologies: ["Figma", "Sketch", "Webflow", "Framer", "React", "TypeScript", "Storybook", "Tailwind", "Zeplin"],
      example: "Led UX/UI redesign for MonexOne app and developed reusable component library for Athenis AI, improving form response rates by 30% and developer efficiency by 25%.",
    },
    {
      id: 2,
      title1: "Creative Frontend",
      title2: "Development",
      description: "I build fast, scalable web interfaces that blend art and technology. Using React, Next.js, and WebGL, I create visually stunning, interactive experiences with Three.js animations while ensuring optimal performance and responsive design.",
      tags: ["React", "Next.js", "WebGL", "3D Graphics", "Interactive Art", "Responsive Design"],
      technologies: ["JavaScript", "React", "TypeScript", "Next.js", "Astro", "Three.js", "WebGL", "GSAP", "SASS", "Tailwind"],
      example: "Built interactive landing page for Athenis AI with 3D visualizations and developed Aurin Task Manager with dynamic UI components and WebGL effects.",
    },
    {
      id: 3,
      title1: "AI-Powered",
      title2: "Automation",
      description: "I design intelligent automation systems that enhance productivity through AI integration. Using tools like N8N and Make combined with Gemini/OpenAI APIs, I create smart workflows, chatbots, and automated processes that streamline operations.",
      tags: ["AI Integration", "Process Automation", "Chatbots", "Machine Learning", "Workflow Design", "Efficiency"],
      technologies: ["Gemini API", "OpenAI API", "Anthropic API", "LangChain", "N8N", "Make", "Zapier", "Cursor", "Claude.ai", "Google Cloud AI"],
      example: "Integrated AI-powered chatbot and task summaries in Aurin Task Manager, plus automated task reporting reducing manual workload by 40%.",
    },
    {
      id: 4,
      title1: "Full-Stack",
      title2: "& DevOps",
      description: "I develop complete backend systems with Node.js, Python, and Firestore, then deploy them with robust CI/CD pipelines. From secure APIs and database design to automated deployments on Vercel with monitoring via Sentry.",
      tags: ["Node.js", "Python", "APIs", "Database Design", "DevOps", "CI/CD", "Monitoring"],
      technologies: ["Node.js", "Python", "FastAPI", "Prisma", "Firestore", "Supabase", "PostgreSQL", "MongoDB", "Git", "Docker", "Vercel", "GitHub", "GitHub Actions", "Sentry", "Clerk"],
      example: "Implemented dynamic link system for Aurin Task Manager with Firestore and deployed with automated CI/CD pipelines for seamless updates.",
    },
    {
      id: 5,
      title1: "Vibe Coding",
      title2: "Creative Development",
      description: "I blend creative problem-solving with disciplined coding to deliver innovative, reliable solutions. Rooted in JavaScript and Python, my 'vibe coding' approach infuses personality into clean, maintainable code, ensuring projects are functional and uniquely expressive.",
      tags: ["Creative Coding", "Innovation", "Problem Solving", "Clean Code"],
      technologies: ["JavaScript", "Python", "TypeScript", "React", "Node.js", "Wix Studio", "Shopify", "WordPress"],
      example: "Crafted custom animated UI components for MonexOne, combining creativity with robust functionality.",
    }
  ];

  // Transform CMS services to component format
  const services: Service[] = cmsServices && cmsServices.length > 0
    ? cmsServices.map((cmsService, index) => ({
        id: index + 1,
        title1: cmsService.title1,
        title2: cmsService.title2,
        description: cmsService.description,
        tags: cmsService.serviceTags.map(tag => tag.tag),
        technologies: cmsService.techTags.map(tech => tech.tech),
        example: cmsService.exampleProject || '',
      }))
    : fallbackServices;

  return (
    <div className="services-list stacking-cards-collection" ref={containerRef}>
      {services.map((service) => {
        return (
          <div
            key={service.id}
            className="service-item active"
            data-service={service.id}
            data-stacking-cards-item
          >
            <div className="service-number">
              {service.id.toString().padStart(2, '0')}.
            </div>
            <div className="service-content" data-stacking-cards-content>
              <div className="service-title-container">
                <h3 className="service-title">{service.title1}</h3>
                <h3 className="service-title">{service.title2}</h3>
              </div>
              <div className="service-details">
                <div className="service-info">
                  <div className="service-tags">
                    {service.tags.map((tag, index) => (
                      <span key={index} className="tag clickable">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="service-description">
                    {service.description}
                  </p>
                  <div className="service-technologies">
                    <h3 className="tech-title">Technologies & Tools:</h3>
                    <div className="tech-tags">
                      {service.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="service-example">
                    <h3 className="example-title">Example Project:</h3>
                    <p className="example-text">{service.example}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesIsland;