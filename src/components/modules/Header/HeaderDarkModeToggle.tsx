import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

interface HeaderDarkModeToggleProps {
  className?: string;
}

export function HeaderDarkModeToggle({ className = "" }: HeaderDarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('portfolio-theme');
    const shouldBeDark = savedTheme === 'dark';
    setIsDark(shouldBeDark);

    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.style.backgroundColor = '#050112';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ececec';
      document.body.style.color = '#1f2937';
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('portfolio-theme', newDarkMode ? 'dark' : 'light');

    // Apply theme to document with smooth transition
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.style.backgroundColor = '#050112';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ececec';
      document.body.style.color = '#1f2937';
    }

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('darkModeChange', {
      detail: { isDark: newDarkMode }
    }));
  };

  if (!isClient) {
    return null;
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`header-dark-mode-toggle ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.div
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isDark ? (
          <Sun className="toggle-icon" />
        ) : (
          <Moon className="toggle-icon" />
        )}
      </motion.div>
    </motion.button>
  );
}
