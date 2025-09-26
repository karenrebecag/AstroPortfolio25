import React, { useEffect, useRef } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  position?: string;
  review: string;
  timestamp: Date;
  status: 'approved' | 'pending' | 'rejected';
}

interface ReviewsSliderProps {
  reviewsData: Review[];
}

const ReviewsSlider: React.FC<ReviewsSliderProps> = ({ reviewsData }) => {
  const splideRef = useRef<Splide>(null);

  useEffect(() => {
    // Initialize custom arrows
    const prevButton = document.querySelector('.reviews-slider-prev');
    const nextButton = document.querySelector('.reviews-slider-next');

    if (prevButton && nextButton && splideRef.current) {
      const splideInstance = splideRef.current.splide;

      const handlePrev = () => splideInstance?.go('<');
      const handleNext = () => splideInstance?.go('>');

      prevButton.addEventListener('click', handlePrev);
      nextButton.addEventListener('click', handleNext);

      return () => {
        prevButton.removeEventListener('click', handlePrev);
        nextButton.removeEventListener('click', handleNext);
      };
    }
  }, []);

  return (
    <div className="reviews-slider-container">
      <Splide
        ref={splideRef}
        className="reviews-splide"
        options={{
          type: 'loop',
          perPage: 1,
          perMove: 1,
          gap: '1rem',
          arrows: false,
          pagination: false,
          autoplay: false,
          pauseOnHover: true,
          resetProgress: false,
        }}
      >
        {reviewsData.map((review) => (
          <SplideSlide key={review.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 10px' }}>
            <div style={{
              width: '100%',
              minHeight: '300px',
              background: 'transparent',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              <div style={{
                position: 'relative',
                border: '2px solid transparent',
                borderRadius: '45px',
                padding: '2.5rem',
                background: 'linear-gradient(135deg, #141020 0%, rgb(30, 26, 32) 50%, #141020 100%)',
                backgroundClip: 'padding-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '45px',
                  background: 'linear-gradient(71deg, #333333, #ffffff, #333333)',
                  zIndex: '-1'
                }}></div>
                
                {/* Profile section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    margin: '0',
                    letterSpacing: '-0.02em'
                  }}>{review.name}</h3>
                  {review.position && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      margin: '0.25rem 0 0 0',
                      fontWeight: '400'
                    }}>{review.position}</p>
                  )}
                </div>
                
                {/* Review description */}
                <div style={{ 
                  flex: '1', 
                  width: '100%', 
                  overflowY: 'auto', 
                  maxHeight: '150px' 
                }}>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>{review.review}</p>
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Custom Arrow Navigation - Below cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        width: '100%'
      }}>
        <button style={{
          width: '44px',
          height: '44px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }} className="reviews-slider-prev">
          <ChevronRight style={{ transform: 'rotate(180deg)', width: '18px', height: '18px', fill: '#333' }} />
        </button>
        <button style={{
          width: '44px',
          height: '44px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }} className="reviews-slider-next">
          <ChevronRight style={{ width: '18px', height: '18px', fill: '#333' }} />
        </button>
      </div>
    </div>
  );
};

export default ReviewsSlider;
