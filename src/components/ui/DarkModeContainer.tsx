import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicFooter } from './DynamicFooter';

interface DarkModeContainerProps {
  children: React.ReactNode;
}

export function DarkModeContainer({ children }: DarkModeContainerProps) {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('aurin-theme');
    const shouldBeDark = savedTheme === 'dark';

    setIsDark(shouldBeDark);

    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark-mode');
      document.body.style.backgroundColor = '#050112';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ececec';
      document.body.style.color = '#1f2937';
    }

    // Listen for dark mode changes from HeaderPill
    const handleDarkModeChange = (event: CustomEvent) => {
      const newIsDark = event.detail.isDark;
      setIsDark(newIsDark);

      // Apply theme to document with smooth transition
      document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

      if (newIsDark) {
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
    };

    window.addEventListener('darkModeChange', handleDarkModeChange as EventListener);

    return () => {
      window.removeEventListener('darkModeChange', handleDarkModeChange as EventListener);
    };
  }, []);

  if (!isClient) {
    return (
      <div>
        {children}
        <DynamicFooter isDark={false} />
      </div>
    );
  }

  return (
    <motion.div
      className={isDark ? 'dark-mode' : 'light-mode'}
      initial={false}
      animate={{
        backgroundColor: isDark ? '#050112' : '#ececec',
        color: isDark ? '#ffffff' : '#1f2937'
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>

      {/* Dynamic Footer with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'dark-footer' : 'light-footer'}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <DynamicFooter isDark={isDark} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
