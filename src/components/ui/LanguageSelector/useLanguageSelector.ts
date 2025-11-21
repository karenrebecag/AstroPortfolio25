import { useState, useEffect, useRef } from 'react';

export const useLanguageSelector = () => {
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
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Portal container creation
  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'language-selector-portal';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9995'; // Above header (9990), below cursor (9997)

    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  const closeDropdown = () => setIsOpen(false);

  const openDropdown = async () => {
    setIsOpen(true);
    await new Promise(resolve => requestAnimationFrame(resolve));
    if (dropdownRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.right = `${window.innerWidth - triggerRect.right}px`;
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.zIndex = '9996'; // Above header and portal container
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // Event listeners for closing the dropdown
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

  return {
    isOpen,
    portalContainer,
    isDarkMode,
    triggerRef,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
};
