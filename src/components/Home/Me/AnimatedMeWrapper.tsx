import React from 'react';
import { motion } from 'motion/react';

interface AnimatedMeHeaderProps {
  children: React.ReactNode;
}

export function AnimatedMeHeader({ children }: AnimatedMeHeaderProps) {
  return (
    <motion.div 
      className="sticky-image-column sticky top-0 h-screen flex items-center rounded-2xl"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedMeSectionProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedMeSection({ children, delay = 0 }: AnimatedMeSectionProps) {
  return (
    <motion.div 
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedMeElementProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export function AnimatedMeElement({ children, delay = 0, direction = 'up' }: AnimatedMeElementProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: -30 };
      case 'right':
        return { opacity: 0, x: 30 };
      default:
        return { opacity: 0, y: 20 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div 
      initial={getInitialPosition()}
      whileInView={getFinalPosition()}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedMeStatsProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedMeStats({ children, delay = 0 }: AnimatedMeStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedMeButtonProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedMeButton({ children, delay = 0 }: AnimatedMeButtonProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
}
