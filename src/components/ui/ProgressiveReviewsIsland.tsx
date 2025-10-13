import React, { useEffect, useRef, useState } from 'react';
import type { Review } from '../../types/reviews';

interface ProgressiveReviewsIslandProps {
  reviews: Review[];
  layout?: 'grid' | 'stack' | 'world' | 'marquee';
  theme?: 'light' | 'dark';
  showSubmitButton?: boolean;
}

export const ProgressiveReviewsIsland: React.FC<ProgressiveReviewsIslandProps> = ({
  reviews,
  layout = 'grid',
  theme = 'light',
  showSubmitButton = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection effect
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof document !== 'undefined') {
        setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
      }
    };

    // Check initial state
    checkDarkMode();

    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Find the sticky wrapper
      const stickyWrapper = containerRef.current.closest('.sticky-scroll-wrapper');
      if (!stickyWrapper) return;

      const wrapperRect = stickyWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the sticky container (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - wrapperRect.top) / (stickyWrapper.clientHeight + windowHeight)
      ));

      setScrollProgress(progress);

      // Calculate how many cards should be visible based on scroll progress
      // Cards appear progressively: 0% = 0 cards, 25% = 1 card, 50% = 2 cards, 75% = 3 cards, 100% = 4 cards
      const totalCards = reviews.length;
      const cardThresholds = Array.from({ length: totalCards }, (_, i) => (i + 1) / (totalCards + 1));
      
      let newVisibleCards = 0;
      for (let i = 0; i < cardThresholds.length; i++) {
        if (progress >= cardThresholds[i]) {
          newVisibleCards = i + 1;
        }
      }

      setVisibleCards(newVisibleCards);
    };

    // Throttled scroll handler
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
  }, [reviews.length]);

  const getCardStyle = (index: number) => {
    const isVisible = index < visibleCards;
    const delay = (index + 2) * 0.15; // Start after header (index + 2), longer delays
    
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-50px) scale(0.8)',
      transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      transitionDelay: isVisible ? `${delay}s` : '0s'
    };
  };

  const getHeaderStyle = (element: 'title' | 'subtitle') => {
    // Header appears first based on scroll progress
    const titleThreshold = 0.1; // Title appears at 10% scroll
    const subtitleThreshold = 0.2; // Subtitle appears at 20% scroll
    
    const isVisible = element === 'title' 
      ? scrollProgress >= titleThreshold 
      : scrollProgress >= subtitleThreshold;
    
    const delay = element === 'title' ? 0 : 0.15;
    
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      transitionDelay: isVisible ? `${delay}s` : '0s'
    };
  };

  const getCardColors = (index: number) => {    
    if (isDarkMode) {
      // Dark mode colors derived from #050112
      const colorVariants = [
        { bg: '#1a1435', textColor: '#f8f4ff', positionColor: '#a29db8' }, // Purple tone
        { bg: '#0f0a2a', textColor: '#f8f4ff', positionColor: '#c4b5fd' }, // Darker purple
        { bg: '#2d1b69', textColor: '#f8f4ff', positionColor: '#a29db8' }, // Medium purple
        { bg: '#3b2c7a', textColor: '#f8f4ff', positionColor: '#c4b5fd' }  // Light purple
      ];
      return colorVariants[index % colorVariants.length];
    } else {
      // Light mode colors (original)
      const colorVariants = [
        { bg: '#C0D645', textColor: 'black', positionColor: '#494949' }, // Green
        { bg: '#151515', textColor: 'white', positionColor: '#9ca3af' },  // Black
        { bg: '#EEEEEE', textColor: 'black', positionColor: '#494949' }, // Gray
        { bg: '#FFFFFF', textColor: 'black', positionColor: '#494949' }  // White
      ];
      return colorVariants[index % colorVariants.length];
    }
  };

  const getRandomFont = (index: number) => {
    const fonts = [
      'var(--font-primary)', // Inter Tight
      'var(--font-secondary)', // Boysen
      'var(--font-display)', // Median
      '"Playfair Display", serif', // Playfair Display
      'var(--font-game)' // Video Game Font
    ];
    // Use index to ensure consistent font per card but still appear random
    return fonts[index % fonts.length];
  };

  const getRandomRotation = (index: number) => {
    // Generate consistent but random-looking rotation for each card
    const rotations = [-15, -10, -5, 5, 10, 15];
    return rotations[index % rotations.length];
  };

  return (
    <div ref={containerRef} className="progressive-reviews-container">
      {/* Brush SVG Overlay - appears at 80% scroll */}
      <div 
        className="brush-svg-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3, // Above GLSLHills (z-index: 1) but below title/subtitle (z-index: 5) and cards (z-index: 10+)
          opacity: scrollProgress >= 0.8 ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          backgroundImage: 'url(https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Brush.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none', // Don't interfere with card interactions
          filter: isDarkMode ? 'invert(0.8)' : 'none'
        }}
      />

      {/* Header with Progressive Animation */}
      <div className="reviews-section__header" style={{ position: 'relative', zIndex: 25 }}>
        <div className="reviews-section__title" style={getHeaderStyle('title')}>
          <div className="title-clients playfair-display-italic">Client's</div>
          <div className="title-reviews" style={{ fontFamily: 'var(--font-primary)' }}>reviews</div>
        </div>
        <p className="reviews-section__subtitle" style={{
          ...getHeaderStyle('subtitle'),
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-lg)',
          lineHeight: 'var(--leading-normal)'
        }}>
          What our clients say about the Aurin Task Manager project
        </p>
      </div>

      {/* Progressive Cards */}
      <div className="progressive-cards-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '-10px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {reviews.map((review, index) => {
          const colors = getCardColors(index);
          const randomFont = getRandomFont(index);
          const rotation = getRandomRotation(index);
          
          return (
            <div
              key={review.id}
              className="progressive-review-card"
              style={{
                ...getCardStyle(index),
                backgroundColor: colors.bg,
                color: colors.textColor,
                width: '320px',
                height: '280px',
                borderRadius: '30px',
                padding: '28px',
                margin: '0 -15px',
                position: 'relative',
                zIndex: 5 + (4 - index), // Z-index para cards: 9, 8, 7, 6 (menores que header z-index: 25)
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                willChange: 'transform, opacity',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: `${getCardStyle(index).transform} rotate(${rotation}deg)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `${getCardStyle(index).transform} rotate(${rotation}deg) translateY(-8px) scale(1.03)`;
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.zIndex = '15'; // Alto en hover pero menor que header (25)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `${getCardStyle(index).transform} rotate(${rotation}deg)`;
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.zIndex = (5 + (4 - index)).toString(); // Volver al z-index original
              }}
            >
              <div className="card-content" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div className="review-text" style={{ 
                  color: colors.textColor,
                  fontSize: '16px',
                  lineHeight: '1.5',
                  marginBottom: '20px',
                  fontFamily: randomFont
                }}>
                  "{review.review}"
                </div>
                <div className="review-author" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div className="author-position" style={{ 
                    color: colors.positionColor,
                    fontSize: '13px',
                    fontFamily: randomFont
                  }}>
                    {review.position}
                  </div>
                  <div className="author-name" style={{ 
                    color: colors.textColor,
                    fontSize: '14px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: randomFont
                  }}>
                    {review.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProgressiveReviewsIsland;
