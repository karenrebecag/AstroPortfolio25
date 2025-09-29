import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { animate } from 'motion';

interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  growth: string;
}

interface LanguageSelectorPortalProps {
  currentLang: string;
  languages: Language[];
}

const LanguageSelectorPortal: React.FC<LanguageSelectorPortalProps> = ({
  currentLang,
  languages
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
    container.id = 'language-selector-portal';
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

    if (dropdownRef.current && triggerRef.current) {
      // Position dropdown relative to trigger
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;

      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.zIndex = '10001';

      // Animate in with stagger effect
      animate(
        dropdown,
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
      const items = dropdown.querySelectorAll('a');
      items.forEach((item, index) => {
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

  const getLanguagePath = (langCode: string) => {
    // Get current path
    const currentPath = window.location.pathname;

    // Check if we're on a resume/CV page
    const resumePages = ['/resume', '/cv', '/curriculum', '/biodata', '/rirekisho', '/jianli'];
    const isResumePage = resumePages.some(page => currentPath.includes(page));

    if (isResumePage) {
      // Map language codes to their native resume page names
      const resumeRoutes = {
        'en': '/resume',
        'es': '/es/curriculum',
        'fr': '/fr/resume',
        'hi': '/hi/biodata',
        'ja': '/ja/rirekisho',
        'zh-cn': '/zh-cn/jianli',
        'zh-tw': '/zh-tw/jianli'
      };

      return resumeRoutes[langCode as keyof typeof resumeRoutes] || '/resume';
    }

    // Default behavior for other pages
    if (langCode === 'en') return '/';
    return `/${langCode}/`;
  };

  const Dropdown = () => (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        minWidth: '220px',
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
      {languages.map((language, index) => (
        <a
          key={language.code}
          href={getLanguagePath(language.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            color: '#000000',
            textDecoration: 'none',
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            borderBottom: index === languages.length - 1 ? 'none' : '2px solid #000000',
            fontFamily: 'var(--font-primary)',
            position: 'relative',
            overflow: 'hidden',
            ...(language.code === currentLang && {
              background: '#f0f0f0',
              borderLeft: '4px solid #000000',
              fontWeight: 'var(--font-weight-bold)',
            }),
          }}
          onMouseEnter={(e) => {
            if (language.code !== currentLang) {
              e.currentTarget.style.background = '#e0e0e0';
              e.currentTarget.style.transform = 'translateX(2px)';
              e.currentTarget.style.paddingLeft = '18px';
              e.currentTarget.style.boxShadow = 'inset 2px 0 0 #000000';
            }
          }}
          onMouseLeave={(e) => {
            if (language.code !== currentLang) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0px)';
              e.currentTarget.style.paddingLeft = '16px';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          onClick={() => {
            closeDropdown();
          }}
        >
          <span style={{
            fontSize: '18px',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            {language.flag}
          </span>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '2px'
          }}>
            <span style={{
              fontWeight: language.code === currentLang ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-normal)',
              fontFamily: 'var(--font-game)',
              textTransform: 'uppercase',
            }}>
              {language.name}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: '#666',
              fontWeight: 'var(--font-weight-normal)',
              letterSpacing: 'var(--tracking-normal)',
              opacity: 0.8,
              fontFamily: 'var(--font-primary)',
              fontStyle: 'normal',
              transition: 'color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}>
              {language.greeting}
            </span>
          </div>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: '#888',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: 'var(--tracking-wider)',
            fontFamily: 'var(--font-display)',
            opacity: 0.7,
            transition: 'color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            {language.code.toUpperCase()}
          </span>
        </a>
      ))}
    </div>
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          border: '2px solid #000000',
          borderRadius: '0px',
          background: '#ffffff',
          cursor: 'pointer',
          fontFamily: 'var(--font-game)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: '#000000',
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          boxShadow: '2px 2px 0px #000000',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f0f0';
          e.currentTarget.style.transform = 'translate(1px, 1px)';
          e.currentTarget.style.boxShadow = '1px 1px 0px #000000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.transform = 'translate(0px, 0px)';
          e.currentTarget.style.boxShadow = '2px 2px 0px #000000';
        }}
      >
        <span style={{
          fontWeight: 'var(--font-weight-normal)',
          letterSpacing: 'var(--tracking-wider)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-game)',
        }}>
          {currentLang.toUpperCase()}
        </span>
        <span
          style={{
            fontSize: '10px',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.7,
          }}
        >
          ▼
        </span>
      </button>

      {/* Portal Dropdown */}
      {portalContainer && isOpen && createPortal(<Dropdown />, portalContainer)}
    </>
  );
};

export default LanguageSelectorPortal;