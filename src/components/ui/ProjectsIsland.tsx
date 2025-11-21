import React, { useState } from 'react';
import type { Project as CMSProject } from '../../lib/cms';

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
  slug?: string;
}

interface ProjectsIslandProps {
  projects: CMSProject[];
}

// Helper function to convert Payload rich text to plain text
const richTextToPlainText = (richText: any): string => {
  if (!richText) return '';

  // If it's already a string, return it
  if (typeof richText === 'string') return richText;

  // If it's a Payload rich text object, extract text from children
  if (Array.isArray(richText)) {
    return richText.map(node => {
      if (node.text) return node.text;
      if (node.children) return richTextToPlainText(node.children);
      return '';
    }).join(' ');
  }

  // If it has a root array (Payload v2 format)
  if (richText.root?.children) {
    return richTextToPlainText(richText.root.children);
  }

  return '';
};

const ProjectsIsland: React.FC<ProjectsIslandProps> = ({ projects: cmsProjects }) => {
  const [activeProject, setActiveProject] = useState<number>(1); // Primer proyecto activo por defecto
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Fallback projects
  const fallbackProjects: Project[] = [
    {
      id: 1,
      title1: "THIS",
      title2: "PORTFOLIO",
      description: "The very portfolio you're experiencing right now! A self-referential showcase built with Astro, React, and Three.js featuring custom cursor effects, magnetic buttons, flip text animations, and seamless interactions. This meta-project demonstrates modern web development capabilities through creative coding techniques and innovative design patterns. Every animation and visual element has been carefully crafted to create an immersive, performance-optimized experience.",
      tags: ["Astro", "React", "TypeScript", "Three.js", "Tailwind", "Motion", "Creative Coding"],
      images: [
        "https://picsum.photos/300/300?random=25",
        "https://picsum.photos/300/300?random=26",
        "https://picsum.photos/300/300?random=27",
        "https://picsum.photos/300/300?random=28"
      ],
      positions: [
        { x: -42, y: 3, rotate: -5 },
        { x: -14, y: -8, rotate: 2 },
        { x: 14, y: 5, rotate: -8 },
        { x: 42, y: -3, rotate: 3 }
      ]
    },
    {
      id: 2,
      title1: "Aurin Task",
      title2: "Manager",
      description: "Enterprise task management platform revolutionizing team collaboration with AI-powered automation and real-time synchronization. Features intelligent task assignment suggestions, smart notifications, collaborative editing, advanced analytics, and bottleneck detection. Built with Next.js 15, React 19, and dual AI integration (Google Gemini + OpenAI) for optimal team productivity and scalability.",
      tags: ["Next.js 15", "React 19", "TypeScript", "Firebase", "Google Gemini", "OpenAI", "Vercel"],
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
      id: 3,
      title1: "OPINATOR Platform",
      title2: "Redesign",
      description: "Complete UX/UI redesign of OPINATOR's live forms platform, enhancing user experience and accessibility for better form response rates. Led a collaborative team of five to redesign the entire WebApp interface, implementing a modular design system in Figma and developing the frontend with React. The redesign resulted in a 30% boost in form response rates and significantly improved developer workflows.",
      tags: ["Figma", "React", "UX/UI Design", "Design System", "Frontend"],
      images: [
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/opinator1.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/opinator2.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/opinator3.webp",
        "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/opinator4.webp"
      ],
      positions: [
        { x: -45, y: -5, rotate: 5 },
        { x: -15, y: 8, rotate: -3 },
        { x: 15, y: -3, rotate: 8 },
        { x: 45, y: 5, rotate: -5 }
      ]
    },
    {
      id: 4,
      title1: "AI",
      title2: "INTEGRATIONS",
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
      id: 5,
      title1: "Mobile",
      title2: "Apps",
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

  // Transform CMS projects to component format
  const projects: Project[] = cmsProjects && cmsProjects.length > 0
    ? cmsProjects.map((cmsProject, index) => ({
        id: index + 1,
        title1: cmsProject.homepageTitle1 || cmsProject.title.split(' ').slice(0, 1).join(' '),
        title2: cmsProject.homepageTitle2 || cmsProject.title.split(' ').slice(1).join(' '),
        description: richTextToPlainText(cmsProject.briefDescription) || cmsProject.homepageDescription || '',
        tags: cmsProject.homepageTags?.map(tag => tag.tag) || [],
        images: cmsProject.homepageImages && cmsProject.homepageImages.length > 0
          ? cmsProject.homepageImages.map(img => img.image.url)
          : [
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
        ],
        slug: cmsProject.slug
      }))
    : fallbackProjects;

  const handleProjectClick = (projectId: number) => {
    setActiveProject(activeProject === projectId ? 0 : projectId); // Toggle para todos los dispositivos
    setHoveredProject(activeProject === projectId ? null : projectId);
  };

  const handleReadMore = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project?.slug) {
      // Navegar a la página del case study usando el slug del CMS
      window.location.href = `/${project.slug}`;
    } else {
      // Fallback para proyectos legacy
      if (projectId === 1) {
        window.location.href = '/ThisPortfolio';
      } else if (projectId === 2) {
        window.location.href = '/AurinTaskManager';
      } else {
        console.log(`Read more about project ${projectId}`);
      }
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
                <h3 className={`project-title ${!isActive ? 'inactive' : ''}`}>
                  {project.title1} {project.title2}
                </h3>
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
                    {(project.id === 1 || project.id === 2) ? 'View Project' : 'Read More'}
                  </button>
                </div>
                {/* Images now handled by ProjectImageCursor component */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsIsland;
