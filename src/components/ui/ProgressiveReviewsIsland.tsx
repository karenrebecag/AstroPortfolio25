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
    const colorVariants = [
      { bg: '#C0D645', textColor: 'black', positionColor: '#494949' }, // Green
      { bg: '#151515', textColor: 'white', positionColor: '#9ca3af' },  // Black
      { bg: '#EEEEEE', textColor: 'black', positionColor: '#494949' }, // Gray
      { bg: '#FFFFFF', textColor: 'black', positionColor: '#494949' }  // White
    ];
    return colorVariants[index % colorVariants.length];
  };

  return (
    <div ref={containerRef} className="progressive-reviews-container">
      {/* Header with Progressive Animation */}
      <div className="reviews-section__header">
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
      <div className="progressive-cards-container">
        {reviews.map((review, index) => {
          const colors = getCardColors(index);
          return (
            <div
              key={review.id}
              className="progressive-review-card"
              style={{
                ...getCardStyle(index),
                backgroundColor: colors.bg,
                color: colors.textColor
              }}
            >
              <div className="card-content">
                <div className="review-text" style={{ color: colors.textColor }}>
                  "{review.review}"
                </div>
                <div className="review-author">
                  <div className="author-position" style={{ color: colors.positionColor }}>
                    {review.position}
                  </div>
                  <div className="author-name" style={{ color: colors.textColor }}>
                    {review.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Debug info (remove in production) */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Progress: {Math.round(scrollProgress * 100)}%<br/>
        Visible Cards: {visibleCards}/{reviews.length}
      </div>
    </div>
  );
};

export default ProgressiveReviewsIsland;
