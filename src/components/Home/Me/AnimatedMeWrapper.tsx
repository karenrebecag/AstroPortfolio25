import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Custom hook for IntersectionObserver logic
function useAnimateInView(options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "-100px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after first intersection
        }
      },
      options
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible, shouldReduceMotion };
}


interface AnimatedMeHeaderProps {
  children: React.ReactNode;
}

export function AnimatedMeHeader({ children }: AnimatedMeHeaderProps) {
  const { ref, isVisible, shouldReduceMotion } = useAnimateInView();
  const initial = { opacity: 0, x: -40 };
  const animate = { opacity: 1, x: 0 };

  if (shouldReduceMotion) {
    return <div ref={ref} className="sticky-image-column sticky top-0 h-screen flex items-center rounded-2xl">{children}</div>;
  }

  return (
    <motion.div 
      ref={ref}
      className="sticky-image-column sticky top-0 h-screen flex items-center rounded-2xl"
      initial={initial}
      animate={isVisible ? animate : initial}
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
  const { ref, isVisible, shouldReduceMotion } = useAnimateInView();
  const initial = { opacity: 0, y: 40 };
  const animate = { opacity: 1, y: 0 };

  if (shouldReduceMotion) {
    return <div ref={ref} className="content-section">{children}</div>;
  }

  return (
    <motion.div 
      ref={ref}
      className="content-section"
      initial={initial}
      animate={isVisible ? animate : initial}
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
  const { ref, isVisible, shouldReduceMotion } = useAnimateInView();

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { opacity: 0, x: -30 };
      case 'right': return { opacity: 0, x: 30 };
      default: return { opacity: 0, y: 20 };
    }
  };

  const getFinalPosition = () => ({ opacity: 1, x: 0, y: 0 });

  if (shouldReduceMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div 
      ref={ref}
      initial={getInitialPosition()}
      animate={isVisible ? getFinalPosition() : getInitialPosition()}
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
  const { ref, isVisible, shouldReduceMotion } = useAnimateInView();
  const initial = { opacity: 0, scale: 0.8 };
  const animate = { opacity: 1, scale: 1 };

  if (shouldReduceMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div 
      ref={ref}
      initial={initial}
      animate={isVisible ? animate : initial}
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
  const { ref, isVisible, shouldReduceMotion } = useAnimateInView();
  const initial = { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };

  if (shouldReduceMotion) {
    return <div ref={ref}>{children}</div>;
  }
  
  return (
    <motion.div 
      ref={ref}
      initial={initial}
      animate={isVisible ? animate : initial}
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
