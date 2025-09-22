import React, { useState } from 'react';
import FlipText from './FlipText';
import { BounceCards } from './BounceCards';

interface Position {
  x: number;
  y: number;
  rotate: number;
}

interface Project {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  images: string[];
  positions: Position[];
}

const ProjectsIsland: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number>(1); // Primer proyecto activo por defecto
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detectar si es móvil
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title1: "E-Commerce",
      title2: "Platform",
      description: "Full-stack e-commerce solution with modern UI, payment integration, and inventory management system.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      images: [
        "https://picsum.photos/300/300?random=13",
        "https://picsum.photos/300/300?random=14",
        "https://picsum.photos/300/300?random=15",
        "https://picsum.photos/300/300?random=16"
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
      title1: "Portfolio",
      title2: "Website",
      description: "Creative portfolio website with Three.js animations, responsive design, and optimized performance.",
      tags: ["Astro", "Three.js", "TypeScript", "Tailwind"],
      images: [
        "https://picsum.photos/300/300?random=17",
        "https://picsum.photos/300/300?random=18",
        "https://picsum.photos/300/300?random=19",
        "https://picsum.photos/300/300?random=20"
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
      title1: "Mobile",
      title2: "App",
      description: "Cross-platform mobile application with real-time features, push notifications, and offline capabilities.",
      tags: ["React Native", "Firebase", "Redux", "Expo"],
      images: [
        "https://picsum.photos/300/300?random=21",
        "https://picsum.photos/300/300?random=22",
        "https://picsum.photos/300/300?random=23",
        "https://picsum.photos/300/300?random=24"
      ],
      positions: [
        { x: -43, y: -3, rotate: 3 },
        { x: -15, y: 6, rotate: -5 },
        { x: 15, y: -4, rotate: 7 },
        { x: 43, y: 4, rotate: -2 }
      ]
    }
  ];

  const handleProjectHover = (projectId: number) => {
    if (!isMobile) {
      setActiveProject(projectId); // Cambiar el activo en hover
      setHoveredProject(projectId); // Para el flip text
    }
  };

  const handleProjectLeave = () => {
    if (!isMobile) {
      setHoveredProject(null); // Solo quitar el flip text
      // El activo se mantiene hasta que haya otro hover
    }
  };

  const handleContainerLeave = () => {
    if (!isMobile) {
      setHoveredProject(null);
      setActiveProject(1); // Volver al primer proyecto cuando sale del contenedor
    }
  };

  const handleProjectClick = (projectId: number) => {
    if (isMobile) {
      setActiveProject(activeProject === projectId ? 0 : projectId); // Toggle en móvil
      setHoveredProject(activeProject === projectId ? null : projectId);
    }
  };

  const handleReadMore = (projectId: number) => {
    // Aquí puedes agregar la lógica para "Read More"
    console.log(`Read more about project ${projectId}`);
  };

  return (
    <div className="projects-list" onMouseLeave={handleContainerLeave}>
      {projects.map((project) => {
        const isActive = activeProject === project.id;
        const isHovered = hoveredProject === project.id;

        return (
          <div
            key={project.id}
            className={`project-item ${isActive ? 'active' : ''}`}
            data-project={project.id}
            onMouseEnter={() => handleProjectHover(project.id)}
            onMouseLeave={handleProjectLeave}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className={`project-number ${!isActive ? 'inactive' : ''}`}>
              {project.id.toString().padStart(2, '0')}.
            </div>
            <div className="project-content">
              <div className="project-title-container">
                <FlipText
                  text={project.title1}
                  className={`project-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
                <FlipText
                  text={project.title2}
                  className={`project-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
              </div>
              <div className="project-details">
                <div className="project-info">
                  <div className="project-tags">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="project-description">
                    {project.description}
                  </p>
                  {isMobile && (
                    <button 
                      className="read-more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadMore(project.id);
                      }}
                    >
                      Read More
                    </button>
                  )}
                </div>
                <div className="project-images">
                  <BounceCards
                    images={project.images}
                    animationDelay={0.2}
                    animationStagger={0.15}
                    positions={project.positions}
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

export default ProjectsIsland;
