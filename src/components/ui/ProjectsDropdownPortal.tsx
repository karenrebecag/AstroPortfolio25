import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { animate } from 'motion';

interface Project {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
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

    const handleScroll = () => {
      if (isOpen) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const openDropdown = async () => {
    setIsOpen(true);

    // Wait for next frame to ensure dropdown is rendered
    await new Promise(resolve => requestAnimationFrame(resolve));

    if (dropdownRef.current) {
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

      // Animate in with stagger effect
      animate(
        dropdownRef.current,
        {
          opacity: [0, 1],
          scale: [0.92, 1],
          y: [-15, 0],
        },
        {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }
      );

      // Animate individual items with stagger
      const items = dropdownRef.current.querySelectorAll('a');
      items.forEach((item: Element, index: number) => {
        const element = item as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        animate(
          element,
          {
            opacity: [0, 1],
            y: [10, 0],
          },
          {
            duration: 0.3,
            delay: index * 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }
        );
      });
    }
  };

  const closeDropdown = () => {
    if (dropdownRef.current) {
      // Animate items out first (reverse stagger)
      const items = dropdownRef.current.querySelectorAll('a');
      items.forEach((item, index) => {
        const element = item as HTMLElement;
        animate(
          element,
          {
            opacity: 0,
            y: -8,
          },
          {
            duration: 0.15,
            delay: (items.length - index - 1) * 0.02,
            ease: [0.4, 0.0, 0.2, 1],
          }
        );
      });

      // Then animate container
      animate(
        dropdownRef.current,
        {
          opacity: 0,
          scale: 0.92,
          y: -15,
        },
        {
          duration: 0.25,
          delay: 0.1,
          ease: [0.4, 0.0, 0.2, 1],
          onComplete: () => {
            setIsOpen(false);
          }
        }
      );
    } else {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const getProjectUrl = (project: Project) => {
    // Map project IDs to their corresponding URLs
    const projectRoutes = {
      1: '/p_ThisPortfolio',
      2: '/p_AurinTaskManager',
      // Add more projects as needed
    };

    return projectRoutes[project.id as keyof typeof projectRoutes] || '#projects';
  };

  const Dropdown = () => (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        minWidth: '280px',
        maxWidth: '320px',
        background: '#ffffff',
        border: '2px solid #000000',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #000000',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'auto',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {projects.map((project, index) => (
        <a
          key={project.id}
          href={getProjectUrl(project)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '16px 18px',
            color: '#000000',
            textDecoration: 'none',
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            borderBottom: index === projects.length - 1 ? 'none' : '2px solid #000000',
            fontFamily: 'var(--font-primary)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
            e.currentTarget.style.transform = 'translateX(2px)';
            e.currentTarget.style.paddingLeft = '20px';
            e.currentTarget.style.boxShadow = 'inset 2px 0 0 #000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateX(0px)';
            e.currentTarget.style.paddingLeft = '18px';
            e.currentTarget.style.boxShadow = 'none';
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
              color: '#666',
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
          <p style={{
            fontSize: 'var(--text-xs)',
            color: '#666',
            fontWeight: 'var(--font-weight-normal)',
            letterSpacing: 'var(--tracking-normal)',
            opacity: 0.8,
            fontFamily: 'var(--font-primary)',
            fontStyle: 'normal',
            transition: 'color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            margin: 0,
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
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
                color: '#666',
                fontFamily: 'var(--font-primary)',
              }}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <>
      {/* Trigger Button - Hidden but functional */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
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
      {portalContainer && isOpen && createPortal(<Dropdown />, portalContainer)}
    </>
  );
};

export default ProjectsDropdownPortal;
