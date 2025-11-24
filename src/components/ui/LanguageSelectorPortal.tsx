import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

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
      // Position dropdown relative to trigger
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;

      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.zIndex = '10001';
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

    // Check if we're on the greetings page (include ALL language variations)
    const greetingsPages = ['/greetings', '/agradecimientos', '/remerciements', '/dhanyavaad', '/kansha', '/ganxie'];
    const isGreetingsPage = greetingsPages.some(page => currentPath.includes(page));

    if (isGreetingsPage) {
      const greetingsRoutes = {
        'en': '/greetings',
        'es': '/es/agradecimientos',
        'fr': '/fr/remerciements',
        'hi': '/hi/dhanyavaad',
        'ja': '/ja/kansha',
        'zh-cn': '/zh-cn/ganxie',
        'zh-tw': '/zh-tw/ganxie'
      };

      return greetingsRoutes[langCode as keyof typeof greetingsRoutes] || '/greetings';
    }

    // Check if we're on the privacy policy page (include ALL language variations)
    const privacyPages = ['/privacy', '/privacidad', '/confidentialite', '/guptataa', '/puraibashii', '/yinsi', '/yinsi-zhengce'];
    const isPrivacyPage = privacyPages.some(page => currentPath.includes(page));

    if (isPrivacyPage) {
      const privacyRoutes = {
        'en': '/privacy',
        'es': '/es/privacidad',
        'fr': '/fr/confidentialite',
        'hi': '/hi/guptataa',
        'ja': '/ja/puraibashii',
        'zh-cn': '/zh-cn/yinsi',
        'zh-tw': '/zh-tw/yinsi-zhengce'
      };

      return privacyRoutes[langCode as keyof typeof privacyRoutes] || '/privacy';
    }

    // Default behavior for other pages (home)
    if (langCode === 'en') return '/';
    return `/${langCode}/`;
  };

  const Dropdown = () => (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.92, y: -15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        position: 'absolute',
        minWidth: '220px',
        background: isDarkMode ? 'rgba(10, 8, 22, 0.95)' : '#ffffff',
        border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid #000000',
        borderRadius: '0px',
        boxShadow: isDarkMode ? '4px 4px 0px rgba(0, 0, 0, 0.5)' : '4px 4px 0px #000000',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {languages.map((language, index) => (
        <motion.a
          key={language.code}
          href={getLanguagePath(language.code)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02, 
            x: language.code !== currentLang ? 2 : 0,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            color: isDarkMode ? '#ffffff' : '#000000',
            textDecoration: 'none',
            borderBottom: index === languages.length - 1 ? 'none' : isDarkMode ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid #000000',
            fontFamily: 'var(--font-primary)',
            position: 'relative',
            overflow: 'hidden',
            ...(language.code === currentLang && {
              background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#f0f0f0',
              borderLeft: isDarkMode ? '4px solid #ffffff' : '4px solid #000000',
              fontWeight: 'var(--font-weight-bold)',
            }),
          }}
          onClick={() => {
            closeDropdown();
          }}
        >
          <motion.span 
            style={{ fontSize: '18px' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {language.flag}
          </motion.span>
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
              color: isDarkMode ? '#cccccc' : '#666',
              fontWeight: 'var(--font-weight-normal)',
              letterSpacing: 'var(--tracking-normal)',
              opacity: 0.8,
              fontFamily: 'var(--font-primary)',
              fontStyle: 'normal',
            }}>
              {language.greeting}
            </span>
          </div>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: isDarkMode ? '#999999' : '#888',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: 'var(--tracking-wider)',
            fontFamily: 'var(--font-display)',
            opacity: 0.7,
          }}>
            {language.code.toUpperCase()}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={toggleDropdown}
        whileHover={{ 
          scale: 1.02, 
          x: 1, 
          y: 1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid #000000',
          borderRadius: '0px',
          background: isDarkMode ? 'rgba(10, 8, 22, 0.9)' : '#ffffff',
          cursor: 'pointer',
          fontFamily: 'var(--font-game)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: isDarkMode ? '#ffffff' : '#000000',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          boxShadow: isDarkMode ? '2px 2px 0px rgba(0, 0, 0, 0.5)' : '2px 2px 0px #000000',
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
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            fontSize: '10px',
            opacity: 0.7,
          }}
        >
          ▼
        </motion.span>
      </motion.button>

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

export default LanguageSelectorPortal;