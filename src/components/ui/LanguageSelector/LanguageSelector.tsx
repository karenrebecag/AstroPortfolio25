import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageSelector } from './useLanguageSelector';
import LanguageDropdown from './LanguageDropdown';
import styles from './LanguageSelector.module.css';

interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  growth: string;
}

interface LanguageSelectorProps {
  currentLang: string;
  languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  languages,
}) => {
  const {
    isOpen,
    portalContainer,
    isDarkMode,
    triggerRef,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  } = useLanguageSelector();

  return (
    <>
      <motion.button
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`${styles.triggerButton} ${isDarkMode ? styles.dark : ''}`}
        whileHover={{ scale: 1.02, x: 1, y: 1, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={styles.triggerLangCode}>
          {currentLang.toUpperCase()}
        </span>
        <motion.span
          className={styles.arrow}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          ▼
        </motion.span>
      </motion.button>

      {portalContainer && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && (
            <LanguageDropdown
              languages={languages}
              currentLang={currentLang}
              isDarkMode={isDarkMode}
              dropdownRef={dropdownRef}
              onClose={closeDropdown}
            />
          )}
        </AnimatePresence>,
        portalContainer
      )}
    </>
  );
};

export default LanguageSelector;
