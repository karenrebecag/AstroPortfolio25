import React from 'react';
import { motion } from 'motion/react';

interface AnimatedCommentsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCommentsWrapper({ children, className }: AnimatedCommentsWrapperProps) {
  return (
    <motion.div 
      className={`section-container ${className || ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCommentsHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCommentsHeader({ children, className }: AnimatedCommentsHeaderProps) {
  return (
    <motion.div 
      className={`section-header ${className || ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCommentsContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCommentsContent({ children, className }: AnimatedCommentsContentProps) {
  return (
    <motion.div 
      className={`comments-island-wrapper ${className || ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
