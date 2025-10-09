'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface LineHeadingProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LineHeading({ children, className = '', style = {} }: LineHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={style}
    >
      {/* Text Content with smooth fade-in from bottom */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
          delay: 0.1
        }}
        className="font-display text-4xl md:text-5xl lg:text-6xl font-medium uppercase tracking-tight"
        style={{
          fontFamily: 'var(--font-display, "Median", serif)',
        }}
      >
        {children}
      </motion.h2>
      
      {/* Decorative element with scroll-based animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3
        }}
        className="mt-4 flex items-center gap-4"
      >
        <motion.span
          className="text-purple-500 text-2xl md:text-3xl"
          animate={isVisible ? { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
            delay: 1
          }}
        >
          ✽
        </motion.span>
        <motion.div
          className="h-px bg-gradient-to-r from-black to-transparent flex-1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isVisible ? { 
            scaleX: 1, 
            opacity: 1 
          } : { 
            scaleX: 0, 
            opacity: 0 
          }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{ transformOrigin: 'left center' }}
        />
      </motion.div>
    </div>
  );
}
