import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, MessageSquare, Star, Briefcase } from 'lucide-react';
import { useReviewsStore } from '../../stores/reviewsStore';
import Toast from './Toast';
import '../../styles/review-popup.css';

interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

// Fallback reviews data (will be replaced by dynamic data)
const fallbackReviewsData = [
  {
    id: "fallback-1",
    name: "Sarah Johnson",
    position: "CEO at TechStart",
    review: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely.",
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "fallback-2",
    name: "Michael Chen",
    position: "Product Manager",
    review: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!",
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "fallback-3",
    name: "Emily Rodriguez",
    position: "Creative Director",
    review: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence.",
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
        </form>
      </motion.div>
    </motion.div>
  );
};

const ReviewsIsland: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const {
    reviews,
    isLoading,
    showPopup,
    setShowPopup,
    fetchReviews
  } = useReviewsStore();

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

    // Use dynamic reviews or fallback data
    const reviewsData = reviews.length > 0 ? reviews : fallbackReviewsData;

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

      // Función para crear una card de review
      const createReviewCard = (review: typeof reviewsData[0]) => {
        const card = document.createElement('div');
        card.className = 'review-card-marquee';
        
        card.innerHTML = `
          <div class="card-inner">
            <div class="gradient-border"></div>
            
            <!-- Profile section -->
            <div class="profile-section">
              <h3 class="reviewer-name">${review.name}</h3>
              ${review.position ? `<p class="reviewer-position" style="font-size: 0.75rem; color: #9ca3af; margin: 0.25rem 0 0 0; font-weight: 400;">${review.position}</p>` : ''}
            </div>
            
            <!-- Review description -->
            <p class="review-description">
              ${review.review}
            </p>
          </div>
        `;
        
        return card;
      };

      // Crear primera serie de cards
      const firstSet = document.createElement('div');
      firstSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        firstSet.appendChild(createReviewCard(review));
      });

      // Crear segunda serie de cards (duplicada para seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        secondSet.appendChild(createReviewCard(review));
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
  }, [reviews]); // Re-create marquee when reviews change

  return (
    <>
      <div ref={containerRef} className="reviews-container">
        {/* El contenido se genera dinámicamente con JavaScript vanilla */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Loading reviews...
          </div>
        )}
      </div>
      
      {/* Submit Review Button */}
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
