import React from 'react';
import { motion } from 'motion/react';
import { getLanguagePath } from './utils';
import styles from './LanguageSelector.module.css';

interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  growth: string;
}

interface LanguageDropdownProps {
  languages: Language[];
  currentLang: string;
  isDarkMode: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  languages,
  currentLang,
  isDarkMode,
  dropdownRef,
  onClose,
}) => {
  return (
    <motion.div
      ref={dropdownRef}
      className={`${styles.dropdown} ${isDarkMode ? styles.dark : ''}`}
      initial={{ opacity: 0, scale: 0.92, y: -15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {languages.map((language, index) => (
        <motion.a
          key={language.code}
          href={getLanguagePath(language.code)}
          className={`${styles.languageItem} ${isDarkMode ? styles.dark : ''} ${language.code === currentLang ? styles.current : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.02, x: language.code !== currentLang ? 2 : 0, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          <motion.span className={styles.flag} whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            {language.flag}
          </motion.span>
          <div className={styles.textWrapper}>
            <span className={`${styles.languageName} ${language.code === currentLang ? styles.current : ''}`}>
              {language.name}
            </span>
            <span className={`${styles.greeting} ${isDarkMode ? styles.dark : ''}`}>
              {language.greeting}
            </span>
          </div>
          <span className={`${styles.langCode} ${isDarkMode ? styles.dark : ''}`}>
            {language.code.toUpperCase()}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default LanguageDropdown;
