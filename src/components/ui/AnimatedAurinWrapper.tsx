import React from 'react';
import { motion } from 'motion/react';

interface AnimatedAurinHeaderProps {
  children: React.ReactNode;
}

export function AnimatedAurinHeader({ children }: AnimatedAurinHeaderProps) {
  return (
    <motion.div 
      className="features-header"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedAurinFeaturesGridProps {
  children: React.ReactNode;
}

export function AnimatedAurinFeaturesGrid({ children }: AnimatedAurinFeaturesGridProps) {
  return (
    <motion.div 
      className="main-features-grid"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedAurinSideContentProps {
  children: React.ReactNode;
}

export function AnimatedAurinSideContent({ children }: AnimatedAurinSideContentProps) {
  return (
    <motion.div 
      className="side-content"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedAurinTipsSectionProps {
  children: React.ReactNode;
}

export function AnimatedAurinTipsSection({ children }: AnimatedAurinTipsSectionProps) {
  return (
    <motion.div 
      className="tips-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
