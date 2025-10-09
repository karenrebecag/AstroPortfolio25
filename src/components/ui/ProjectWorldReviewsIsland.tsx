// ProjectWorldReviewsIsland.tsx - Interactive reviews island
// Following Astro Islands best practices for performance optimization

import React, { useEffect, useState, useRef } from 'react';

interface Review {
  id: string;
  name: string;
  company: string;
  rating: number;
  comment: string;
  avatar?: string;
  country: string;
}

interface ProjectWorldReviewsIslandProps {
  reviews?: Review[];
}

const ProjectWorldReviewsIsland: React.FC<ProjectWorldReviewsIslandProps> = ({ 
  reviews = [] 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance optimization: IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: '200px', // Load early for smooth experience
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Page Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Placeholder reviews data for demo
  const defaultReviews: Review[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'Tech Innovations Inc.',
      rating: 5,
      comment: 'Karen delivered exceptional UX/UI design that transformed our platform. Her attention to detail and creative vision exceeded our expectations.',
      country: 'United States'
    },
    {
      id: '2',
      name: 'Miguel Rodriguez',
      company: 'Digital Solutions SA',
      rating: 5,
      comment: 'Outstanding work on our e-commerce platform. The design system Karen created is both beautiful and highly functional.',
      country: 'Spain'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      company: 'Creative Agency Ltd.',
      rating: 5,
      comment: 'Working with Karen was a pleasure. Her expertise in React and design engineering brought our vision to life perfectly.',
      country: 'United Kingdom'
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  if (!isVisible) {
    return <div ref={containerRef} className="reviews-island-placeholder" />;
  }

  return (
    <div 
      ref={containerRef} 
      className={`reviews-island ${isPaused ? 'paused' : ''}`}
    >
      <div className="reviews-grid">
        {displayReviews.map((review, index) => (
          <div 
            key={review.id} 
            className="review-card"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="review-header">
              <div className="review-avatar">
                {review.avatar ? (
                  <img 
                    src={review.avatar} 
                    alt={`${review.name} avatar`}
                    loading="lazy"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {review.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="review-info">
                <h4 className="reviewer-name">{review.name}</h4>
                <p className="reviewer-company">{review.company}</p>
                <div className="review-rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < review.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-country">
                <span className="country-flag">🌍</span>
                <span className="country-name">{review.country}</span>
              </div>
            </div>
            <div className="review-content">
              <p className="review-comment">"{review.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProjectWorldReviewsIsland);
