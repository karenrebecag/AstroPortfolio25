import React from 'react';
import { ToastProvider } from '../../Toasts';
import ReviewsIsland from './ReviewsIsland';
import type { Review } from '../types/reviews';

interface ReviewsWithToastProps {
  reviews?: Review[];
  layout?: 'world' | 'stack' | 'grid' | 'marquee';
  theme?: 'light' | 'dark';
  showSubmitButton?: boolean;
}

// Default reviews data
const defaultReviews: Review[] = [
  {
    id: "default-1",
    name: "Sarah Johnson",
    position: "CEO at TechStart",
    review: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "default-2",
    name: "Michael Chen",
    position: "Product Manager",
    review: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  },
  {
    id: "default-3",
    name: "Emily Rodriguez",
    position: "Creative Director",
    review: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence.",
    rating: 5,
    timestamp: new Date(),
    status: 'approved' as const
  }
];

const ReviewsWithToast: React.FC<ReviewsWithToastProps> = ({ 
  reviews = defaultReviews,
  layout = 'marquee',
  theme = 'dark',
  showSubmitButton = true
}) => {
  return (
    <ToastProvider>
      <ReviewsIsland 
        reviews={reviews}
      />
    </ToastProvider>
  );
};

export default ReviewsWithToast;
