import React from 'react';
import { motion } from 'motion/react';

interface FlipTextProps {
  text: string;
  className?: string;
  isHovered?: boolean;
}

const FlipText: React.FC<FlipTextProps> = ({ text, className = '', isHovered = false }) => {
  // Verificar que tenemos un string válido
  if (typeof text !== 'string' || !text) {
    return <div className={className}>Error: No text provided</div>;
  }

  return (
    <div
      className={`flip-text-container relative block overflow-hidden whitespace-nowrap text-hero font-inter font-black uppercase ${className}`}
      style={{
        lineHeight: 0.75,
      }}
    >
      <motion.div className="flex">
        {text.split("").map((letter, i) => (
          <motion.span
            key={`top-${i}`}
            className="inline-block"
            initial={{ y: 0 }}
            animate={{ y: isHovered ? "-110%" : 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.025,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
      <motion.div className="absolute inset-0 flex">
        {text.split("").map((letter, i) => (
          <motion.span
            key={`bottom-${i}`}
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: isHovered ? 0 : "110%" }}
            transition={{
              duration: 0.3,
              delay: i * 0.025,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default FlipText;
