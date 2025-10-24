import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import type { Review } from '../../types/reviews';

interface BounceReviewsProps {
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Array of reviews to display
   */
  reviews?: Review[];
  /**
   * Width of the container in pixels
   */
  containerWidth?: number;
  /**
   * Height of the container in pixels
   */
  containerHeight?: number;
  /**
   * Delay before animation starts (in seconds)
   */
  animationDelay?: number;
  /**
   * Delay between each card animation (in seconds)
   */
  animationStagger?: number;
}

/**
 * A component that displays review cards with a bouncing animation effect.
 * Similar to BounceCards but adapted for review content with Motion.dev animations.
 */
export const BounceReviewsIsland: React.FC<BounceReviewsProps> = ({
  className = "",
  reviews = [],
  containerWidth = 500,
  containerHeight = 500,
  animationDelay = 0.5,
  animationStagger = 0.08
}) => {
  // Card colors and styles similar to existing review system
  const cardColors = ['#C0D645', '#151515', '#EEEEEE', '#FFFFFF'];
  const textColors = ['#000000', '#FFFFFF', '#333333', '#000000'];
  const positionColors = ['#494949', '#9ca3af', '#494949', '#494949'];

  return (
    <div
      className={`${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}
    >
      {reviews.slice(0, 4).map((review, idx) => (
        <motion.div
          key={review.id}
          className="bounce-review-card"
          initial={{ opacity: 0 }}
          whileInView={{ 
            opacity: 1
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: idx * 0.1
          }}
          style={{
            width: '280px',
            height: '240px',
            backgroundColor: cardColors[idx % 4],
            borderRadius: '30px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Review Text */}
          <div 
            style={{
              color: textColors[idx % 4],
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '16px'
            }}
          >
            "{review.review}"
          </div>
          
          {/* Author Info */}
          <div>
            <div 
              style={{
                color: positionColors[idx % 4],
                fontSize: '12px',
                marginBottom: '8px'
              }}
            >
              {review.position || 'Client'}
            </div>
            <div 
              style={{
                color: textColors[idx % 4],
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}
            >
              {review.name}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BounceReviewsIsland;
