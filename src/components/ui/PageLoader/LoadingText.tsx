import React from 'react';
import styles from './PageLoader.module.css';

interface LoadingTextProps {
  text: string;
}

const LoadingText: React.FC<LoadingTextProps> = ({ text }) => {
  return (
    <div className={styles.loadText}>
      {text.split('').map((letter, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default LoadingText;
