import { create } from 'zustand';
import type { Review, ReviewFormData } from '../types/reviews';

interface ReviewsState {
  // Reviews data
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  // Form data
  formData: ReviewFormData;
  
  // UI state
  isSubmitting: boolean;
  showPopup: boolean;
  
  // Actions
  setReviews: (reviews: Review[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Form actions
  setFormField: (field: keyof ReviewFormData, value: any) => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  setShowPopup: (show: boolean) => void;
  
  // API actions
  fetchReviews: () => Promise<void>;
  submitReview: () => Promise<boolean>;
}

const initialFormData: ReviewFormData = {
  name: '',
  position: '',
  review: ''
};

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  // Initial state
  reviews: [],
  isLoading: false,
  error: null,
  formData: { ...initialFormData },
  isSubmitting: false,
  showPopup: false,
  
  // Basic setters
  setReviews: (reviews) => set({ reviews }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Form actions
  setFormField: (field, value) => 
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),
    
  resetForm: () => set({ formData: { ...initialFormData } }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setShowPopup: (showPopup) => set({ showPopup }),
  
  // API actions
  fetchReviews: async () => {
    // Check if reviews are already in sessionStorage
    const cachedReviews = sessionStorage.getItem('serviceReviews');
    if (cachedReviews) {
      try {
        const parsedReviews = JSON.parse(cachedReviews);
        // Convert timestamp strings back to Date objects
        const reviews = parsedReviews.map((review: any) => ({
          ...review,
          timestamp: new Date(review.timestamp)
        }));
        set({ reviews, isLoading: false });
        return;
      } catch (error) {
        console.error('Error parsing cached reviews:', error);
        // If parsing fails, continue to fetch from API
      }
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/get-reviews');
      const result = await response.json();

      if (result.success) {
        // Convert timestamp strings back to Date objects
        const reviews = result.reviews.map((review: any) => ({
          ...review,
          timestamp: new Date(review.timestamp)
        }));

        // Cache reviews in sessionStorage
        sessionStorage.setItem('serviceReviews', JSON.stringify(result.reviews));

        set({ reviews, isLoading: false });
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({
        error: 'Failed to load reviews. Please try again.',
        isLoading: false
      });
    }
  },
  
  submitReview: async () => {
    const { formData } = get();
    
    // Validación básica
    if (!formData.name.trim() || !formData.review.trim()) {
      set({ error: 'Name and review are required' });
      return false;
    }
    
    set({ isSubmitting: true, error: null });
    
    try {
      // Crear FormData para enviar al API
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('position', formData.position.trim());
      submitData.append('review', formData.review.trim());
      
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear cached reviews so they'll be refetched
        sessionStorage.removeItem('serviceReviews');

        // Reset form and close popup
        set({
          isSubmitting: false,
          showPopup: false,
          formData: { ...initialFormData }
        });
        return true;
      } else {
        set({ 
          error: result.message, 
          isSubmitting: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      set({ 
        error: 'Failed to submit review. Please try again.', 
        isSubmitting: false 
      });
      return false;
    }
  }
}));
