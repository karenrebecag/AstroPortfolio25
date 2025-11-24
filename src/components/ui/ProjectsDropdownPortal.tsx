import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  slug?: string;
  url?: string;
}

interface ProjectsDropdownPortalProps {
  projects: Project[];
}

const ProjectsDropdownPortal: React.FC<ProjectsDropdownPortalProps> = ({
  projects
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const savedTheme = localStorage.getItem('aurin-theme');
      const hasDarkClass = document.documentElement.classList.contains('dark-mode');
      setIsDarkMode(savedTheme === 'dark' || hasDarkClass);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Create portal container
    const container = document.createElement('div');
    container.id = 'projects-dropdown-portal';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10000';

    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (isOpen) {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);

        // Only close if scroll is significant (more than 50px)
        if (scrollDifference > 50) {
          closeDropdown();
        }
        lastScrollY = currentScrollY;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const openDropdown = async () => {
    setIsOpen(true);

    // Wait for next frame to ensure dropdown is rendered
    await new Promise(resolve => requestAnimationFrame(resolve));

    if (dropdownRef.current && triggerRef.current) {
      // Find the projects nav link to position relative to it
      const projectsNavLink = document.querySelector('#projectsNavLink');
      if (projectsNavLink) {
        const triggerRect = projectsNavLink.getBoundingClientRect();
        const dropdown = dropdownRef.current;

        dropdown.style.position = 'fixed';
        dropdown.style.top = `${triggerRect.bottom + 8}px`;
        dropdown.style.left = `${triggerRect.left}px`;
        dropdown.style.pointerEvents = 'auto';
        dropdown.style.zIndex = '10001';
      }
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const getProjectUrl = (project: Project) => {
    // Use slug if available (same pattern as ProjectsIsland.tsx)
    if (project.slug) {
      return `/${project.slug}`;
    }
    if (project.url) {
      return project.url;
    }
    return '#projects';
  };

  const Dropdown = () => (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'absolute',
        minWidth: '280px',
        maxWidth: '320px',
        background: isDarkMode ? 'rgba(10, 8, 22, 0.95)' : '#ffffff',
        border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid #000000',
        borderRadius: '0px',
        boxShadow: isDarkMode ? '4px 4px 0px rgba(0, 0, 0, 0.5)' : '4px 4px 0px #000000',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {projects.map((project, index) => (
        <motion.a
          key={project.id}
          href={getProjectUrl(project)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02, 
            x: 2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '12px 16px',
            color: isDarkMode ? '#ffffff' : '#000000',
            textDecoration: 'none',
            borderBottom: index === projects.length - 1 ? 'none' : isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid #000000',
            fontFamily: 'var(--font-primary)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => {
            closeDropdown();
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              color: isDarkMode ? '#cccccc' : '#666',
              fontWeight: 'var(--font-weight-medium)',
              letterSpacing: 'var(--tracking-wider)',
              fontFamily: 'var(--font-display)',
              opacity: 0.7,
            }}>
              {String(project.id).padStart(2, '0')}
            </span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '2px'
            }}>
              <span style={{
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-normal)',
                fontFamily: 'var(--font-game)',
                textTransform: 'uppercase',
              }}>
                {project.title1} {project.title2}
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginTop: '4px'
          }}>
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: 'rgba(69, 35, 174, 0.1)',
                  color: '#4523AE',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-game)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span style={{
                fontSize: '10px',
                color: isDarkMode ? '#999999' : '#666',
                fontFamily: 'var(--font-primary)',
              }}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </motion.a>
      ))}
    </motion.div>
  );

  return (
    <>
      {/* Trigger Button - Hidden but functional */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        data-projects-dropdown-trigger
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'auto',
          width: '1px',
          height: '1px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
        aria-label="Toggle projects dropdown"
      >
      </button>

      {/* Portal Dropdown */}
      {portalContainer && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && <Dropdown />}
        </AnimatePresence>, 
        portalContainer
      )}
    </>
  );
};

export default ProjectsDropdownPortal;
