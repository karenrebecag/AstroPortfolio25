import React, { useState } from 'react';
import FlipText from './FlipText';
import { BounceCards } from './BounceCards';

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

const ServicesIsland: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(1); // Primer servicio activo por defecto
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      title1: "UX/UI Design",
      title2: "& Mobile Prototyping",
      description: "I craft intuitive, user-centered interfaces and interactive prototypes for web and mobile applications, ensuring seamless experiences across devices. Using tools like Figma and Sketch, I design visually compelling layouts that prioritize usability, accessibility, and mobile-first principles.",
      tags: ["User Interface", "User Experience", "Mobile Design", "Prototyping"],
      technologies: ["Figma", "Sketch", "Zeplin", "Adobe XD"],
      example: "Led UX/UI redesign for MonexOne app at Aurin (Sodio), improving form response rates by 30% through mobile-optimized design.",
      images: [
        "https://picsum.photos/300/300?random=1",
        "https://picsum.photos/300/300?random=2",
        "https://picsum.photos/300/300?random=3",
        "https://picsum.photos/300/300?random=4"
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
      title1: "Technical UX",
      title2: "Design Engineering",
      description: "I bridge design and development by creating developer-friendly design systems and interactive components that align with technical requirements. Combining Figma for seamless design handoff with React and TypeScript for functional prototypes.",
      tags: ["Design Systems", "Component Libraries", "Developer Handoff"],
      technologies: ["Figma", "Zeplin", "React", "TypeScript", "Storybook", "Tailwind"],
      example: "Developed a reusable component library for Athenis AI's educational platform, integrating Figma designs with React for efficient developer workflows.",
      images: [
        "https://picsum.photos/300/300?random=5",
        "https://picsum.photos/300/300?random=6",
        "https://picsum.photos/300/300?random=7",
        "https://picsum.photos/300/300?random=8"
      ],
      positions: [
        { x: -42, y: 3, rotate: -5 },
        { x: -14, y: -8, rotate: 2 },
        { x: 14, y: 5, rotate: -8 },
        { x: 42, y: -3, rotate: 3 }
      ]
    },
    {
      id: 3,
      title1: "Web Art &",
      title2: "Creative Visualizations",
      description: "I create visually stunning, interactive web experiences that blend art and technology. Using CSS animations, WebGL, and JavaScript libraries like Three.js, I design immersive digital visuals that captivate users while ensuring performance and accessibility.",
      tags: ["WebGL", "3D Graphics", "Interactive Art", "Creative Coding"],
      technologies: ["CSS Animations", "WebGL", "Three.js", "GSAP", "Canvas API"],
      example: "Built an interactive landing page for Athenis AI, featuring dynamic 3D visualizations of AI-driven insights.",
      images: [
        "https://picsum.photos/300/300?random=9",
        "https://picsum.photos/300/300?random=10",
        "https://picsum.photos/300/300?random=11",
        "https://picsum.photos/300/300?random=12"
      ],
      positions: [
        { x: -43, y: -3, rotate: 3 },
        { x: -15, y: 6, rotate: -5 },
        { x: 15, y: -4, rotate: 7 },
        { x: 43, y: 4, rotate: -2 }
      ]
    },
    {
      id: 4,
      title1: "Modern Frontend",
      title2: "Development",
      description: "I build fast, scalable, and responsive web interfaces using modern frameworks like React and Next.js. Leveraging TypeScript for type safety and Sass/Tailwind for modular styling, I deliver clean, optimized code that ensures engaging user experiences.",
      tags: ["React", "Next.js", "TypeScript", "Responsive Design"],
      technologies: ["JavaScript", "React", "TypeScript", "Next.js", "Sass", "Tailwind"],
      example: "Developed Aurin Task Manager at Aurin (Sodio), a fullstack Next.js app with Clerk authentication and dynamic UI components.",
      images: [
        "https://picsum.photos/300/300?random=13",
        "https://picsum.photos/300/300?random=14",
        "https://picsum.photos/300/300?random=15",
        "https://picsum.photos/300/300?random=16"
      ],
      positions: [
        { x: -40, y: 2, rotate: -3 },
        { x: -12, y: -6, rotate: 5 },
        { x: 12, y: 3, rotate: -7 },
        { x: 40, y: -2, rotate: 4 }
      ]
    },
    {
      id: 5,
      title1: "Backend Development",
      title2: "& Data Management",
      description: "I develop secure, scalable backend systems with Node.js, Python, and Firestore, creating efficient APIs and managing complex data structures. Integrating Clerk for authentication and serverless deployments on Vercel.",
      tags: ["Node.js", "Python", "APIs", "Database Design"],
      technologies: ["Node.js", "Python", "FastAPI", "Firestore", "MongoDB", "Redis", "Clerk"],
      example: "Implemented temporary dynamic link system for guest access in Aurin Task Manager, built with Firestore.",
      images: [
        "https://picsum.photos/300/300?random=17",
        "https://picsum.photos/300/300?random=18",
        "https://picsum.photos/300/300?random=19",
        "https://picsum.photos/300/300?random=20"
      ],
      positions: [
        { x: -38, y: -4, rotate: 6 },
        { x: -13, y: 7, rotate: -2 },
        { x: 13, y: -5, rotate: 4 },
        { x: 38, y: 3, rotate: -6 }
      ]
    },
    {
      id: 6,
      title1: "AI Integration",
      title2: "& Innovation",
      description: "I enhance applications with AI-driven features, such as contextual chatbots, automated summaries, and data analysis. Using APIs like Gemini and OpenAI, combined with LangChain, I deliver intelligent solutions that boost productivity.",
      tags: ["AI Integration", "Chatbots", "Machine Learning", "Automation"],
      technologies: ["Gemini API", "OpenAI API", "LangChain", "Google Cloud AI"],
      example: "Integrated AI-powered chatbot and task summaries in Aurin Task Manager, enhancing team collaboration.",
      images: [
        "https://picsum.photos/300/300?random=21",
        "https://picsum.photos/300/300?random=22",
        "https://picsum.photos/300/300?random=23",
        "https://picsum.photos/300/300?random=24"
      ],
      positions: [
        { x: -41, y: 1, rotate: -4 },
        { x: -14, y: -7, rotate: 3 },
        { x: 14, y: 4, rotate: -5 },
        { x: 41, y: -1, rotate: 2 }
      ]
    },
    {
      id: 7,
      title1: "Vibe Coding",
      title2: "Creative Development",
      description: "I blend creative problem-solving with disciplined coding to deliver innovative, reliable solutions. Rooted in JavaScript and Python, my 'vibe coding' approach infuses personality into clean, maintainable code, ensuring projects are functional and uniquely expressive.",
      tags: ["Creative Coding", "Innovation", "Problem Solving", "Clean Code"],
      technologies: ["JavaScript", "Python", "TypeScript", "React", "Node.js"],
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
    },
    {
      id: 8,
      title1: "Workflow",
      title2: "Automation",
      description: "I design custom automation workflows to streamline processes, connecting apps with tools like N8N and Make. By integrating AI for tasks like data analysis or content generation, I create efficient systems that save time and enhance productivity.",
      tags: ["Process Automation", "Workflow Design", "Integration", "Efficiency"],
      technologies: ["N8N", "Make", "Zapier", "TensorFlow", "PyTorch"],
      example: "Automated task reporting in Aurin Task Manager, reducing manual workload by 40%.",
      images: [
        "https://picsum.photos/300/300?random=29",
        "https://picsum.photos/300/300?random=30",
        "https://picsum.photos/300/300?random=31",
        "https://picsum.photos/300/300?random=32"
      ],
      positions: [
        { x: -37, y: 3, rotate: -2 },
        { x: -12, y: -4, rotate: 4 },
        { x: 12, y: 6, rotate: -6 },
        { x: 37, y: -3, rotate: 3 }
      ]
    },
    {
      id: 9,
      title1: "Deployment & CI/CD",
      title2: "Maintenance",
      description: "I ensure reliable deployments and ongoing maintenance using platforms like Vercel and Netlify, with CI/CD pipelines via GitHub Actions. Leveraging monitoring tools like Sentry, I deliver production-ready applications with optimal performance.",
      tags: ["DevOps", "CI/CD", "Monitoring", "Performance"],
      technologies: ["Vercel", "Netlify", "GitHub Actions", "Sentry", "LogRocket"],
      example: "Deployed Aurin Task Manager on Vercel with automated CI/CD pipelines for seamless updates.",
      images: [
        "https://picsum.photos/300/300?random=33",
        "https://picsum.photos/300/300?random=34",
        "https://picsum.photos/300/300?random=35",
        "https://picsum.photos/300/300?random=36"
      ],
      positions: [
        { x: -36, y: -1, rotate: 3 },
        { x: -10, y: 4, rotate: -5 },
        { x: 10, y: -3, rotate: 6 },
        { x: 36, y: 1, rotate: -2 }
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