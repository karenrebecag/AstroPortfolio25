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
    // STALE-WHILE-REVALIDATE PATTERN
    // Check if reviews are already in sessionStorage
    const cachedData = sessionStorage.getItem('serviceReviews');
    
    if (cachedData) {
      try {
        const { reviews: cachedReviews, timestamp } = JSON.parse(cachedData);
        
        // Convert timestamp strings back to Date objects
        const reviews = cachedReviews.map((review: any) => ({
          ...review,
          timestamp: new Date(review.timestamp)
        }));
        
        // SERVE STALE CONTENT IMMEDIATELY (no loading state)
        set({ reviews, isLoading: false, error: null });
        
        // REVALIDATE IN BACKGROUND if data is older than 1 minute
        const isStale = Date.now() - timestamp > 60000; // 1 min
        
        if (isStale) {
          console.log('🔄 Reviews cache is stale, revalidating in background...');
          
          // Background revalidation (no loading state, no user interruption)
          fetch('/api/get-reviews')
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                const freshReviews = result.reviews.map((review: any) => ({
                  ...review,
                  timestamp: new Date(review.timestamp)
                }));
                
                // Update cache with fresh data + timestamp
                sessionStorage.setItem('serviceReviews', JSON.stringify({
                  reviews: result.reviews,
                  timestamp: Date.now()
                }));
                
                // Update state silently
                set({ reviews: freshReviews });
                console.log('✅ Reviews revalidated successfully');
              }
            })
            .catch(error => {
              console.warn('⚠️ Background revalidation failed, serving stale content:', error);
              // Fail silently - user already has stale content showing
            });
        }
        
        return; // Exit early, we've served cached content
      } catch (error) {
        console.error('Error parsing cached reviews:', error);
        // If parsing fails, continue to fetch from API
      }
    }

    // NO CACHE: First time loading - show loading state
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

        // Cache reviews in sessionStorage with timestamp
        sessionStorage.setItem('serviceReviews', JSON.stringify({
          reviews: result.reviews,
          timestamp: Date.now()
        }));

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
        // Clear cached reviews so they'll be refetched with fresh data
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
