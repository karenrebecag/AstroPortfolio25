// Reviews Module - Centralized exports
// This module contains all components, stores, types, and hooks related to the reviews system

// Components
export { default as ReviewsIsland } from './components/ReviewsIsland';
export { default as ServiceReviewsIsland } from './components/ServiceReviewsIsland';
export { default as BounceReviewsIsland } from './components/BounceReviewsIsland';
export { default as ReviewsSlider } from './components/ReviewsSlider';
export { default as ReviewsWithToast } from './components/ReviewsWithToast';

// Astro Components (can't be default exported, need to be imported directly)
// import MainReviewsSection from './components/MainReviewsSection.astro';

// Stores
export { useReviewsStore } from './stores/reviewsStore';

// Types
export type { Review, ReviewFormData, ModerationEmailData, ReviewsSectionProps } from './types/reviews';
