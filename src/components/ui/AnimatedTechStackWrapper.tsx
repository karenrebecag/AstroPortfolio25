import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTechStackHeaderProps {
  children: React.ReactNode;
}

export function AnimatedTechStackHeader({ children }: AnimatedTechStackHeaderProps) {
  return (
    <motion.div 
      className="sticky-tech-column sticky top-0 h-screen flex items-center rounded-2xl"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedTechSectionProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedTechSection({ children, delay = 0 }: AnimatedTechSectionProps) {
  return (
    <motion.div 
      className="tech-content-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedTechItemProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedTechItem({ children, delay = 0 }: AnimatedTechItemProps) {
  return (
    <motion.div 
      className="tech-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 8px 24px rgba(115, 80, 204, 0.15)"
      }}
    >
      {children}
    </motion.div>
  );
}
