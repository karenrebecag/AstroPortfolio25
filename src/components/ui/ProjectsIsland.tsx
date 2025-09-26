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

  const projects: Project[] = [
    {
      id: 1,
      title1: "Aurin Task",
      title2: "Manager",
      description: "Enterprise-grade task management platform with AI integration, real-time collaboration, and advanced notification system.",
      tags: ["Next.js", "TypeScript", "Firebase", "AI"],
      images: [
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin1.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin2.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin3.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin4.webp"
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
      id: 3,
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
      id: 4,
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


  const handleProjectClick = (projectId: number) => {
    setActiveProject(activeProject === projectId ? 0 : projectId); // Toggle para todos los dispositivos
    setHoveredProject(activeProject === projectId ? null : projectId);
  };

  const handleReadMore = (projectId: number) => {
    if (projectId === 1) {
      // Navegar a la página del Aurin Task Manager
      window.location.href = '/p_AurinTaskManager';
    } else {
      // Lógica para otros proyectos
      console.log(`Read more about project ${projectId}`);
    }
  };

  return (
    <div className="projects-list relative">
      {projects.map((project) => {
        const isActive = activeProject === project.id;
        const isHovered = hoveredProject === project.id;

        return (
          <div
            key={project.id}
            className={`project-item clickable relative z-10 ${isActive ? 'active' : ''}`}
            data-project={project.id}
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
                      <span key={index} className="tag clickable">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="project-description">
                    {project.description}
                  </p>
                  <button 
                    className="read-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadMore(project.id);
                    }}
                  >
                    {project.id === 1 ? 'View Project' : 'Read More'}
                  </button>
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
