import React, { useEffect, useRef, useState } from 'react';

interface StickyScrollControllerProps {
  children: React.ReactNode;
  className?: string;
  stickyDuration?: number; // Duration in viewport heights
  fadeInOut?: boolean;
}

export const StickyScrollController: React.FC<StickyScrollControllerProps> = ({
  children,
  className = '',
  stickyDuration = 2,
  fadeInOut = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !stickyRef.current) return;

      const container = containerRef.current;
      const sticky = stickyRef.current;
      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the sticky container
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      
      // Progress from 0 to 1 as we scroll through the container
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - containerTop) / (containerHeight + windowHeight)
      ));

      setScrollProgress(progress);

      // Determine if sticky content should be visible
      const isInViewport = containerTop < windowHeight && containerRect.bottom > 0;
      setIsVisible(isInViewport);

      // Apply fade effect if enabled
      if (fadeInOut && sticky) {
        let opacity = 1;
        
        // Fade in at the beginning
        if (progress < 0.1) {
          opacity = progress / 0.1;
        }
        // Fade out at the end
        else if (progress > 0.9) {
          opacity = (1 - progress) / 0.1;
        }
        
        sticky.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
      }
    };

    // Throttled scroll handler for better performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', handleScroll);
    };
  }, [fadeInOut]);

  return (
    <div 
      ref={containerRef}
      className={`sticky-scroll-container ${className}`}
      style={{
        height: `${stickyDuration * 100}vh`,
        position: 'relative'
      }}
    >
      {/* Top spacer - reduced to minimal */}
      <div className="sticky-scroll-spacer" style={{ height: '20vh' }} />
      
      {/* Sticky content */}
      <div
        ref={stickyRef}
        className="sticky-content"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: fadeInOut ? 0 : 1,
          transition: 'opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {children}
      </div>
      
      {/* Bottom spacer - reduced to minimal */}
      <div className="sticky-scroll-spacer" style={{ height: '20vh' }} />
    </div>
  );
};

export default StickyScrollController;
