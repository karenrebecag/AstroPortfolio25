import { useState, useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

// Custom hook for IntersectionObserver logic
export function useAnimateInView(options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "-100px" }) {
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
