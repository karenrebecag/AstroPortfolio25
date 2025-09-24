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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
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

      dropdown.style.position = 'absolute';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.pointerEvents = 'auto';

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
        background: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid rgba(204, 204, 204, 0.2)',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        opacity: 0,
        pointerEvents: 'auto',
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
            color: '#131019',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            borderBottom: index === languages.length - 1 ? 'none' : '1px solid rgba(204, 204, 204, 0.08)',
            fontFamily: 'var(--font-primary)',
            position: 'relative',
            overflow: 'hidden',
            ...(language.code === currentLang && {
              background: 'rgba(6, 3, 20, 0.06)',
              borderLeft: '3px solid #060314',
              fontWeight: 'var(--font-weight-semibold)',
            }),
          }}
          onMouseEnter={(e) => {
            if (language.code !== currentLang) {
              e.currentTarget.style.background = 'rgba(247, 248, 249, 0.9)';
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.paddingLeft = '20px';
              e.currentTarget.style.boxShadow = 'inset 3px 0 0 rgba(6, 3, 20, 0.1)';
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
              fontWeight: language.code === currentLang ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-normal)',
              fontFamily: 'var(--font-primary)',
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
              fontStyle: 'italic',
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
          border: '1px solid rgba(204, 204, 204, 0.3)',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: '#131019',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          letterSpacing: 'var(--tracking-wide)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#060314';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(204, 204, 204, 0.3)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: 'var(--tracking-wider)',
          fontSize: 'var(--text-sm)'
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