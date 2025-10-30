import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, MessageSquare, Star, Briefcase } from 'lucide-react';
import type { Review } from '../types/reviews';
import { useReviewsStore } from '../stores/reviewsStore';
import { useSimpleToast } from '../../Toasts';
import ReviewsSlider from './ReviewsSlider';
import '../styles/review-popup.css';
import { t } from '../../../../i18n/utils';

interface ServiceReviewsIslandProps {
  reviews?: Review[];
  lang: string;
}

// Fallback reviews data for services (different from project reviews)
const fallbackServiceReviews: Review[] = [
  {
    id: "service-1",
    name: "Sarah Johnson",
    position: "CEO at TechStart",
    review: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "service-2",
    name: "Michael Chen",
    position: "Product Manager",
    review: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "service-3",
    name: "Emily Rodriguez",
    position: "Creative Director",
    review: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "service-4",
    name: "David Wilson",
    position: "CTO at InnovateHub",
    review: "The technical implementation was flawless. Karen's expertise in modern web technologies is outstanding. Will definitely work with her again.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  }
];

// Review Popup Component for Services
const ServiceReviewPopup: React.FC<{ 
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  lang: string;
}> = ({ showSuccess, showError, lang }) => {
  const {
    formData,
    isSubmitting,
    error,
    setFormField,
    resetForm,
    setShowPopup,
    submitReview,
    fetchReviews
  } = useReviewsStore();
  
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitReview();
    if (success) {
      showSuccess(t('serviceReviews.success', lang));
      // Refresh reviews after a short delay
      setTimeout(() => {
        fetchReviews();
      }, 1000);
    } else if (error) {
      showError(error);
    }
  };

  useEffect(() => {
    setCharCount(formData.review.length);
  }, [formData.review]);

  // Block body scroll when popup is open
  useEffect(() => {
    const scrollY = window.scrollY;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <motion.div
      className="review-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowPopup(false);
        }
      }}
    >
      <motion.div
        className="review-popup"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="review-popup-close"
          onClick={() => setShowPopup(false)}
          aria-label="Close review form"
        >
          <X size={20} />
        </button>

        <div className="review-popup-header">
          <h2 className="review-popup-title">{t('serviceReviews.title', lang)}</h2>
          <p className="review-popup-subtitle">
            {t('serviceReviews.subtitle', lang)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="review-form-row">
            <div className="review-form-group">
              <label htmlFor="review-name" className="review-form-label">
                <User size={16} />
                {t('serviceReviews.nameLabel', lang)}
              </label>
              <input
                id="review-name"
                type="text"
                className="review-form-input"
                placeholder={t('serviceReviews.namePlaceholder', lang)}
                value={formData.name}
                onChange={(e) => setFormField('name', e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="review-form-group">
              <label htmlFor="review-position" className="review-form-label">
                <Briefcase size={16} />
                {t('serviceReviews.positionLabel', lang)}
              </label>
              <input
                id="review-position"
                type="text"
                className="review-form-input"
                placeholder={t('serviceReviews.positionPlaceholder', lang)}
                value={formData.position}
                onChange={(e) => setFormField('position', e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          <div className="review-form-group">
            <label htmlFor="review-text" className="review-form-label">
              <MessageSquare size={16} />
              {t('serviceReviews.reviewLabel', lang)}
            </label>
            <textarea
              id="review-text"
              className="review-form-textarea"
              placeholder={t('serviceReviews.reviewPlaceholder', lang)}
              value={formData.review}
              onChange={(e) => setFormField('review', e.target.value)}
              required
              maxLength={maxChars}
              rows={4}
            />
            <div className="review-char-count">
              <span className={charCount > maxChars * 0.9 ? 'review-char-warning' : ''}>
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          {error && (
            <div className="review-error-message">
              {error}
            </div>
          )}

          <div className="review-submit-section">
            <button
              type="submit"
              className="review-submit-btn"
              disabled={isSubmitting || !formData.name.trim() || !formData.review.trim()}
            >
              <div className="review-btn-content">
                {isSubmitting ? (
                  <>
                    <div className="review-loading-spinner"></div>
                    <span className="review-btn-text">{t('serviceReviews.submitting', lang)}</span>
                  </>
                ) : (
                  <>
                    <Star size={16} />
                    <span className="review-btn-text">{t('serviceReviews.submit', lang)}</span>
                  </>
                )}
                <div className="review-btn-inner-glow"></div>
              </div>
            </button>
          </div>
          
          {/* Privacy Policy Notice */}
          <p className="privacy-notice">
            {t('serviceReviews.privacy', lang)}
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ServiceReviewsIsland: React.FC<ServiceReviewsIslandProps> = ({
  reviews: propReviews = [],
  lang = 'en'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { showSuccess, showError } = useSimpleToast();
  const {
    reviews: storeReviews,
    isLoading,
    showPopup,
    setShowPopup,
    fetchReviews
  } = useReviewsStore();

  // Use prop reviews if provided, otherwise fallback to store or fallback data
  const reviewsData = propReviews.length > 0 ? propReviews : 
                     storeReviews.length > 0 ? storeReviews : 
                     fallbackServiceReviews;

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Create reviews marquee (exact replica from f072ceb commit)
  useEffect(() => {
    if (!containerRef.current) return;

    const createReviewsMarquee = () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear existing content
      container.innerHTML = '';

      // Create marquee wrapper
      const marqueeWrapper = document.createElement('div');
      marqueeWrapper.className = 'reviews-marquee-wrapper';

      // Create marquee container
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'reviews-marquee';

      // Function to create a review card with original dark design (f072ceb)
      const createReviewCard = (review: Review) => {
        const card = document.createElement('div');
        card.className = 'review-card-marquee';
        
        card.innerHTML = `
          <div style="
            position: relative;
            border: 2px solid transparent;
            border-radius: 45px;
            padding: 2.5rem;
            background: linear-gradient(135deg, #141020 0%, rgb(30, 26, 32) 50%, #141020 100%);
            background-clip: padding-box;
            min-height: 300px;
            display: flex;
            flex-direction: column;
          ">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 45px;
              background: linear-gradient(71deg, #333333, #ffffff, #333333);
              z-index: -1;
            "></div>
            
            <!-- Profile section -->
            <div style="
              display: flex;
              align-items: start;
              margin-bottom: 1.5rem;
              flex-direction: column;
            ">
              <h3 style="
                font-family: var(--font-display);
                font-size: 1.5rem;
                font-weight: 600;
                color: #ffffff;
                margin: 0;
                letter-spacing: -0.02em;
              ">${review.name}</h3>
              ${review.position ? `<p style="
                font-size: 0.75rem;
                color: #9ca3af;
                margin: 0.25rem 0 0 0;
                font-weight: 400;
              ">${review.position}</p>` : ''}
            </div>
            
            <!-- Review description -->
            <div style="
              flex: 1;
              overflow-y: auto;
              max-height: 150px;
            ">
              <p style="
                font-family: var(--font-primary);
                font-size: 1rem;
                text-align: left;
                font-weight: 400;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.7);
                margin: 0;
                max-width: 100%;
              ">
                ${review.review}
              </p>
            </div>
          </div>
        `;
        
        return card;
      };

      // Create first set of cards
      const firstSet = document.createElement('div');
      firstSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        firstSet.appendChild(createReviewCard(review));
      });

      // Create second set of cards (duplicated for seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        secondSet.appendChild(createReviewCard(review));
      });

      // Add both sets to marquee
      marqueeContainer.appendChild(firstSet);
      marqueeContainer.appendChild(secondSet);
      marqueeWrapper.appendChild(marqueeContainer);
      container.appendChild(marqueeWrapper);
    };

    // Setup IntersectionObserver for performance
    const setupIntersectionObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const marquee = entry.target.querySelector('.reviews-marquee');
            if (marquee) {
              if (entry.isIntersecting) {
                (marquee as HTMLElement).style.animationPlayState = 'running';
              } else {
                (marquee as HTMLElement).style.animationPlayState = 'paused';
              }
            }
          });
        },
        {
          rootMargin: '200px 0px',
          threshold: 0.1
        }
      );

      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    };

    // Create marquee and setup observer
    createReviewsMarquee();
    setupIntersectionObserver();

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [reviewsData]);

  return (
    <>
      {/* Desktop: Reviews Marquee (visible >= 768px) */}
      <div className="reviews-marquee-desktop">
        <div ref={containerRef} className="reviews-container">
          {/* Content is generated dynamically with vanilla JavaScript */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              {t('serviceReviews.loading', lang)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Reviews Slider (visible < 768px) */}
      <div className="reviews-slider-mobile">
        <ReviewsSlider reviewsData={reviewsData} />
      </div>
      
      {/* Submit Review Button */}
      <div className="submit-review-button">
        <div className="submit-review-btn-main">
          <button
            onClick={() => setShowPopup(true)}
            className="review-submit-btn"
            data-cursor-text={t('reviews.submit', lang)}
          >
            <div className="review-btn-glow"></div>
            <div className="review-btn-blob"></div>
            <div className="review-btn-content">
              <Star size={16} />
              <span className="review-btn-text">{t('reviews.submit', lang)}</span>
              <div className="review-btn-inner-glow"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Review Popup */}
      <AnimatePresence>
        {showPopup && (
          <ServiceReviewPopup 
            showSuccess={showSuccess}
            showError={showError}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceReviewsIsland;
