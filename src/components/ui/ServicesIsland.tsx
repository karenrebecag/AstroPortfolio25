import React, { useState } from 'react';
import FlipText from './FlipText';
import { BounceCards } from './BounceCards';
import { translations } from '../../i18n/translations.js';

interface Position {
  x: number;
  y: number;
  rotate: number;
}

interface Service {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  technologies: string[];
  example: string;
  images: string[];
  positions: Position[];
}

interface ServicesIslandProps {
  lang?: string;
}

const ServicesIsland: React.FC<ServicesIslandProps> = ({ lang = 'en' }) => {
  const [activeService, setActiveService] = useState<number>(1); // Primer servicio activo por defecto
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // Obtener traducciones para el idioma actual
  const t = translations[lang as keyof typeof translations] || translations.en;
  const servicesData = t.services?.items || translations.en.services.items;

  const services: Service[] = servicesData.map((service: any, index: number) => ({
    ...service,
    images: [
      `https://picsum.photos/300/300?random=${index * 4 + 1}`,
      `https://picsum.photos/300/300?random=${index * 4 + 2}`,
      `https://picsum.photos/300/300?random=${index * 4 + 3}`,
      `https://picsum.photos/300/300?random=${index * 4 + 4}`
    ],
    positions: [
      { x: -45 + (index * 2), y: -5 + (index % 2), rotate: 5 - (index % 3) },
      { x: -15 + (index % 3), y: 8 - (index % 2), rotate: -3 + (index % 4) },
      { x: 15 - (index % 2), y: -3 + (index % 3), rotate: 8 - (index % 2) },
      { x: 45 - (index % 4), y: 5 - (index % 2), rotate: -5 + (index % 3) }
    ]
  }));

  // Fallback services array (keeping original structure for reference)
  const fallbackServices: Service[] = [
    {
      id: 1,
      title1: "UX/UI Design",
      title2: "& Engineering",
      description: "I craft intuitive, user-centered interfaces and bridge design with development through technical UX engineering. From mobile prototypes in Figma to developer-friendly design systems with React components, I ensure seamless handoff and implementation.",
      tags: ["User Interface", "User Experience", "Design Systems", "Component Libraries", "Mobile Design", "Developer Handoff"],
      technologies: ["Figma", "Sketch", "Webflow", "Framer", "React", "TypeScript", "Storybook", "Tailwind", "Zeplin"],
      example: "Led UX/UI redesign for MonexOne app and developed reusable component library for Athenis AI, improving form response rates by 30% and developer efficiency by 25%.",
      images: [
        "https://picsum.photos/300/300?random=1",
        "https://picsum.photos/300/300?random=2",
        "https://picsum.photos/300/300?random=5",
        "https://picsum.photos/300/300?random=6"
      ],
      positions: [
        { x: -45, y: -5, rotate: 5 },
        { x: -15, y: 8, rotate: -3 },
        { x: 15, y: -3, rotate: 8 },
        { x: 45, y: 5, rotate: -5 }
      ]
    },
    {
      id: 2,
      title1: "Creative Frontend",
      title2: "Development",
      description: "I build fast, scalable web interfaces that blend art and technology. Using React, Next.js, and WebGL, I create visually stunning, interactive experiences with Three.js animations while ensuring optimal performance and responsive design.",
      tags: ["React", "Next.js", "WebGL", "3D Graphics", "Interactive Art", "Responsive Design"],
      technologies: ["JavaScript", "React", "TypeScript", "Next.js", "Astro", "Three.js", "WebGL", "GSAP", "SASS", "Tailwind"],
      example: "Built interactive landing page for Athenis AI with 3D visualizations and developed Aurin Task Manager with dynamic UI components and WebGL effects.",
      images: [
        "https://picsum.photos/300/300?random=9",
        "https://picsum.photos/300/300?random=13",
        "https://picsum.photos/300/300?random=11",
        "https://picsum.photos/300/300?random=15"
      ],
      positions: [
        { x: -43, y: -3, rotate: 3 },
        { x: -15, y: 6, rotate: -5 },
        { x: 15, y: -4, rotate: 7 },
        { x: 43, y: 4, rotate: -2 }
      ]
    },
    {
      id: 3,
      title1: "AI-Powered",
      title2: "Automation",
      description: "I design intelligent automation systems that enhance productivity through AI integration. Using tools like N8N and Make combined with Gemini/OpenAI APIs, I create smart workflows, chatbots, and automated processes that streamline operations.",
      tags: ["AI Integration", "Process Automation", "Chatbots", "Machine Learning", "Workflow Design", "Efficiency"],
      technologies: ["Gemini API", "OpenAI API", "Anthropic API", "LangChain", "N8N", "Make", "Zapier", "Cursor", "Claude.ai", "Google Cloud AI"],
      example: "Integrated AI-powered chatbot and task summaries in Aurin Task Manager, plus automated task reporting reducing manual workload by 40%.",
      images: [
        "https://picsum.photos/300/300?random=21",
        "https://picsum.photos/300/300?random=29",
        "https://picsum.photos/300/300?random=23",
        "https://picsum.photos/300/300?random=31"
      ],
      positions: [
        { x: -41, y: 1, rotate: -4 },
        { x: -14, y: -7, rotate: 3 },
        { x: 14, y: 4, rotate: -5 },
        { x: 41, y: -1, rotate: 2 }
      ]
    },
    {
      id: 4,
      title1: "Full-Stack",
      title2: "& DevOps",
      description: "I develop complete backend systems with Node.js, Python, and Firestore, then deploy them with robust CI/CD pipelines. From secure APIs and database design to automated deployments on Vercel with monitoring via Sentry.",
      tags: ["Node.js", "Python", "APIs", "Database Design", "DevOps", "CI/CD", "Monitoring"],
      technologies: ["Node.js", "Python", "FastAPI", "Prisma", "Firestore", "Supabase", "PostgreSQL", "MongoDB", "Git", "Docker", "Vercel", "GitHub", "GitHub Actions", "Sentry", "Clerk"],
      example: "Implemented dynamic link system for Aurin Task Manager with Firestore and deployed with automated CI/CD pipelines for seamless updates.",
      images: [
        "https://picsum.photos/300/300?random=17",
        "https://picsum.photos/300/300?random=33",
        "https://picsum.photos/300/300?random=19",
        "https://picsum.photos/300/300?random=35"
      ],
      positions: [
        { x: -38, y: -4, rotate: 6 },
        { x: -13, y: 7, rotate: -2 },
        { x: 13, y: -5, rotate: 4 },
        { x: 38, y: 3, rotate: -6 }
      ]
    },
    {
      id: 5,
      title1: "Vibe Coding",
      title2: "Creative Development",
      description: "I blend creative problem-solving with disciplined coding to deliver innovative, reliable solutions. Rooted in JavaScript and Python, my 'vibe coding' approach infuses personality into clean, maintainable code, ensuring projects are functional and uniquely expressive.",
      tags: ["Creative Coding", "Innovation", "Problem Solving", "Clean Code"],
      technologies: ["JavaScript", "Python", "TypeScript", "React", "Node.js", "Wix Studio", "Shopify", "WordPress"],
      example: "Crafted custom animated UI components for MonexOne, combining creativity with robust functionality.",
      images: [
        "https://picsum.photos/300/300?random=25",
        "https://picsum.photos/300/300?random=26",
        "https://picsum.photos/300/300?random=27",
        "https://picsum.photos/300/300?random=28"
      ],
      positions: [
        { x: -39, y: -2, rotate: 5 },
        { x: -11, y: 5, rotate: -3 },
        { x: 11, y: -6, rotate: 7 },
        { x: 39, y: 2, rotate: -4 }
      ]
    }
  ];


  const handleServiceClick = (serviceId: number) => {
    setActiveService(activeService === serviceId ? 0 : serviceId); // Toggle para todos los dispositivos
    setHoveredService(activeService === serviceId ? null : serviceId);
  };

  return (
    <div className="services-list">
      {services.map((service) => {
        const isActive = activeService === service.id;
        const isHovered = hoveredService === service.id;

        return (
          <div
            key={service.id}
            className={`service-item clickable ${isActive ? 'active' : ''}`}
            data-service={service.id}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className={`service-number ${!isActive ? 'inactive' : ''}`}>
              {service.id.toString().padStart(2, '0')}.
            </div>
            <div className="service-content">
              <div className="service-title-container">
                <FlipText
                  text={service.title1}
                  className={`service-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
                <FlipText
                  text={service.title2}
                  className={`service-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
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
                <div className="service-images">
                  <BounceCards
                    images={service.images}
                    animationDelay={0.2}
                    animationStagger={0.15}
                    positions={service.positions}
                  />
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