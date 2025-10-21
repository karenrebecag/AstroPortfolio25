import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  type: string;
  author: string;
  readTime: string;
}

interface MoreProjectsIslandProps {
  projectData: ProjectData[];
}

const MoreProjectsIsland: React.FC<MoreProjectsIslandProps> = ({ projectData }) => {
  const [selectedProjects, setSelectedProjects] = useState<ProjectData[]>([]);

  // Seleccionar 4 proyectos aleatorios
  useEffect(() => {
    const shuffled = [...projectData].sort(() => 0.5 - Math.random());
    setSelectedProjects(shuffled.slice(0, 4));
  }, [projectData]);

  const handleProjectClick = (url: string) => {
    if (url && url !== '#') {
      window.location.href = url;
    }
  };

  return (
    <div className="projects-grid">
      {selectedProjects.map((project, index) => (
        <motion.div 
          key={project.id} 
          className="project-card"
          onClick={() => handleProjectClick(project.url)}
          style={{ cursor: project.url && project.url !== '#' ? 'pointer' : 'default' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1, 
            ease: "easeOut" 
          }}
          whileHover={{ 
            y: -8,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          {/* Card Header */}
          <motion.div 
            className="card-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1 + 0.1, 
              ease: "easeOut" 
            }}
          >
            <div className="author-section">
              <div className="avatar">
                <img 
                  src="https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/A5A05E33-1DDD-4041-BCF4-4522767BFCEE.webp" 
                  alt="Karen Ortiz"
                  className="avatar-image"
                />
              </div>
              <div className="author-info">
                <div className="editor-label">Editor</div>
                <div className="author-name">{project.author}</div>
              </div>
            </div>
      
          </motion.div>

          {/* Card Image */}
          <motion.div 
            className="card-image"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1 + 0.2, 
              ease: "easeOut" 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <img 
              src={project.image} 
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <div className="image-overlay"></div>
          </motion.div>

          {/* Card Title */}
          <motion.h3 
            className="card-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1 + 0.3, 
              ease: "easeOut" 
            }}
          >
            {project.title}
          </motion.h3>
        </motion.div>
      ))}
    </div>
  );
};

export default MoreProjectsIsland;
