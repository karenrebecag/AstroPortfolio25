import React from 'react';
import { ToastProvider } from '../../hooks/useToast';
import ReviewsIsland from './ReviewsIsland';

const ReviewsWithToast: React.FC = () => {
  return (
    <ToastProvider>
      <ReviewsIsland />
    </ToastProvider>
  );
};

export default ReviewsWithToast;
