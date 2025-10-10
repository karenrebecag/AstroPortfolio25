import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, MessageSquare, Star, Briefcase } from 'lucide-react';
import type { Review } from '../../types/reviews';
import { useReviewsStore } from '../../stores/reviewsStore';
import Toast from './Toast';
import ReviewsSlider from './ReviewsSlider';
import '../../styles/review-popup.css';

interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ReviewsIslandProps {
  reviews: Review[];
  layout?: 'world' | 'stack' | 'grid' | 'marquee';
  theme?: 'light' | 'dark';
  showSubmitButton?: boolean;
}

// Fallback reviews data (will be replaced by dynamic data)
const fallbackReviewsData: Review[] = [
  {
    id: "fallback-1",
    name: "Sarah Johnson",
    position: "CEO at TechStart",
    review: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "fallback-2",
    name: "Michael Chen",
    position: "Product Manager",
    review: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "fallback-3",
    name: "Emily Rodriguez",
    position: "Creative Director",
    review: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  }
];

// Review Popup Component
const ReviewPopup: React.FC<{ onToast: (type: 'success' | 'error', message: string) => void }> = ({ onToast }) => {
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
      onToast('success', 'Review submitted successfully! It will appear after moderation.');
      // Refresh reviews after a short delay
      setTimeout(() => {
        fetchReviews();
      }, 1000);
    } else if (error) {
      onToast('error', error);
    }
  };



  useEffect(() => {
    setCharCount(formData.review.length);
  }, [formData.review]);

  // Block body scroll when popup is open
  useEffect(() => {
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Disable scroll and maintain position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Re-enable scroll on unmount and restore position
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Handle Escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPopup(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setShowPopup]);

  return (
    <motion.div
      className="review-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && setShowPopup(false)}
    >
      <motion.div
        className="review-popup"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Close Button */}
        <button
          className="review-popup-close"
          onClick={() => setShowPopup(false)}
          data-cursor-text="Close Popup"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="review-popup-header">
          <h2 className="review-popup-title">Submit a Review</h2>
          <p className="review-popup-subtitle">
            Share your experience working with Karen. Your review will be published after moderation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="review-popup-form">

          {/* Name Field */}
          <div className="review-form-field">
            <label className="review-form-label">
              <User size={16} />
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormField('name', e.target.value)}
              className="review-form-input"
              data-cursor-text="Enter Your Name"
              required
            />
          </div>

          {/* Position Field */}
          <div className="review-form-field">
            <label className="review-form-label">
              <Briefcase size={16} />
              Your Position <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., CEO at TechStart, Product Manager, Freelancer..."
              value={formData.position}
              onChange={(e) => setFormField('position', e.target.value)}
              className="review-form-input"
              data-cursor-text="Enter Your Position"
            />
          </div>


          {/* Review Field */}
          <div className="review-form-field">
            <label className="review-form-label">
              <MessageSquare size={16} />
              Your Review
            </label>
            <textarea
              placeholder="Share your experience working with Karen..."
              value={formData.review}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setFormField('review', e.target.value);
                }
              }}
              className="review-form-textarea"
              data-cursor-text="Write Your Review"
              required
            />
            <div className={`review-char-counter ${
              charCount > maxChars * 0.9 ? 'warning' : ''
            } ${
              charCount === maxChars ? 'error' : ''
            }`}>
              {charCount}/{maxChars} characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="review-error-message">
              <X size={16} />
              {error}
            </div>
          )}

          {/* Submit Section */}
          <div className="review-submit-section">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="review-cancel-btn"
              data-cursor-text="Cancel Review"
            >
              Cancel
            </button>
            
            <div className="review-submit-btn-wrapper">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.review.trim()}
                className="review-submit-btn"
                data-cursor-text="Submit Review"
              >
                <div className="review-btn-glow"></div>
                <div className="review-btn-blob"></div>
                <div className="review-btn-content">
                  {isSubmitting ? (
                    <>
                      <div className="review-loading-spinner"></div>
                      <span className="review-btn-text">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Star size={16} />
                      <span className="review-btn-text">Submit Review</span>
                    </>
                  )}
                  <div className="review-btn-inner-glow"></div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Privacy Policy Notice */}
          <p className="privacy-notice">
            By submitting a review, you agree to my{' '}
            <a href="/privacy" className="privacy-link" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            . Your data is handled with care and only used for moderation purposes.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ReviewsIsland: React.FC<ReviewsIslandProps> = ({ 
  reviews: propReviews, 
  layout = 'marquee', 
  theme = 'dark',
  showSubmitButton = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
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
                     fallbackReviewsData;

  // Toast functions
  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (!containerRef.current) return;

    // reviewsData is already defined above with proper fallback logic

    // Crear el marquee de reviews
    const createReviewsMarquee = () => {
      const container = containerRef.current;
      if (!container) return;

      // Limpiar contenido existente
      container.innerHTML = '';

      // Crear marquee wrapper
      const marqueeWrapper = document.createElement('div');
      marqueeWrapper.className = 'reviews-marquee-wrapper';

      // Crear marquee container
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'reviews-marquee';

      // Función para crear una card de review con el diseño oscuro original (commit f072ceb)
      const createReviewCard = (review: Review, index: number) => {
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

      // Limitar a máximo 4 reviews
      const limitedReviews = reviewsData.slice(0, 4);

      // Crear primera serie de cards
      const firstSet = document.createElement('div');
      firstSet.className = 'reviews-set';
      limitedReviews.forEach((review: Review, index: number) => {
        firstSet.appendChild(createReviewCard(review, index));
      });

      // Crear segunda serie de cards (duplicada para seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'reviews-set';
      limitedReviews.forEach((review: Review, index: number) => {
        secondSet.appendChild(createReviewCard(review, index));
      });

      // Agregar ambos sets al marquee
      marqueeContainer.appendChild(firstSet);
      marqueeContainer.appendChild(secondSet);
      marqueeWrapper.appendChild(marqueeContainer);
      container.appendChild(marqueeWrapper);
    };

    // Configurar IntersectionObserver para performance
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

    // Crear el marquee al montar el componente
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
  }, [reviewsData]); // Re-create marquee when reviews change

  // Render different layouts based on layout prop
  const renderLayout = () => {
    switch (layout) {
      case 'marquee':
        return (
          <>
            {/* Desktop: Reviews Marquee (visible en vp >= 768px) */}
            <div className="reviews-marquee-desktop">
              <div ref={containerRef} className="reviews-container">
                {/* El contenido se genera dinámicamente con JavaScript vanilla */}
                {isLoading && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading reviews...
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Reviews Slider (visible en vp < 768px) */}
            <div className="reviews-slider-mobile">
              <ReviewsSlider reviewsData={reviewsData} />
            </div>
          </>
        );
      
      case 'stack':
        return (
          <div className="reviews-stack-layout">
            <ReviewsSlider reviewsData={reviewsData} />
          </div>
        );
      
      case 'grid':
        const cardColors = ['#C0D645', '#151515', '#EEEEEE', '#FFFFFF'];
        const textColors = ['black', 'white', 'black', 'black'];
        const positionColors = ['#494949', '#9ca3af', '#494949', '#494949'];
        
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {reviewsData.slice(0, 4).map((review, index) => {
              const colorIndex = index % 4;
              
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ 
                    opacity: 1
                  }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1
                  }}
                  style={{
                    width: '280px',
                    height: '240px',
                    backgroundColor: cardColors[colorIndex],
                    borderRadius: '30px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div 
                    style={{
                      color: textColors[colorIndex],
                      fontSize: '14px',
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}
                  >
                    "{review.review.length > 80 ? review.review.substring(0, 80) + '...' : review.review}"
                  </div>
                  
                  <div>
                    <div 
                      style={{
                        color: positionColors[colorIndex],
                        fontSize: '12px',
                        marginBottom: '8px'
                      }}
                    >
                      {review.position || 'Client'}
                    </div>
                    <div 
                      style={{
                        color: textColors[colorIndex],
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}
                    >
                      {review.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      
      case 'world':
      default:
        return (
          <div className="reviews-world-layout">
            <ReviewsSlider reviewsData={reviewsData} />
          </div>
        );
    }
  };

  return (
    <>
      {renderLayout()}
      
      {/* Submit Review Button */}
      {showSubmitButton && (
        <div className="submit-review-button">
          <div className="submit-review-btn-main">
            <button
              onClick={() => setShowPopup(true)}
              className="review-submit-btn"
              data-cursor-text="Submit Your Review"
            >
              <div className="review-btn-glow"></div>
              <div className="review-btn-blob"></div>
              <div className="review-btn-content">
                <Star size={16} />
                <span className="review-btn-text">Submit a Review</span>
                <div className="review-btn-inner-glow"></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Review Popup */}
      <AnimatePresence>
        {showPopup && <ReviewPopup onToast={addToast} />}
      </AnimatePresence>

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} style={{ pointerEvents: 'auto' }}>
              <Toast
                id={toast.id}
                type={toast.type}
                message={toast.message}
                onClose={removeToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ReviewsIsland;
