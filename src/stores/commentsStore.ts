import { create } from 'zustand';
import type { Comment, CommentFormData } from '../types/comments';

interface CommentsState {
  // Comments data
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  
  // Form data
  formData: CommentFormData;
  
  // UI state
  isSubmitting: boolean;
  showForm: boolean;
  
  // Actions
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Form actions
  setFormField: (field: keyof CommentFormData, value: any) => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  setShowForm: (show: boolean) => void;
  
  // API actions
  fetchComments: (storyId: string) => Promise<void>;
  submitComment: (storyId: string) => Promise<boolean>;
  submitReply: (storyId: string, parentId: string, content: string) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<boolean>;
}

const initialFormData: CommentFormData = {
  name: '',
  comment: '',
  profilePic: null
};

export const useCommentsStore = create<CommentsState>((set, get) => ({
  // Initial state
  comments: [],
  isLoading: false,
  error: null,
  formData: { ...initialFormData },
  isSubmitting: false,
  showForm: false,
  
  // Basic setters
  setComments: (comments) => set({ comments }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Form actions
  setFormField: (field, value) => 
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),
    
  resetForm: () => set({ formData: { ...initialFormData } }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setShowForm: (showForm) => set({ showForm }),
  
  // API actions
  fetchComments: async (storyId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/get-comments?storyId=${encodeURIComponent(storyId)}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert timestamp strings back to Date objects
        const comments = result.comments.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }));
        set({ comments, isLoading: false });
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      set({ 
        error: 'Failed to load comments. Please try again.', 
        isLoading: false 
      });
    }
  },
  
  submitComment: async (storyId: string) => {
    const { formData } = get();
    
    // Validación básica
    if (!formData.name.trim() || !formData.comment.trim()) {
      set({ error: 'Name and comment are required' });
      return false;
    }
    
    set({ isSubmitting: true, error: null });
    
    try {
      // Crear FormData para enviar al API
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('comment', formData.comment.trim());
      submitData.append('storyId', storyId);
      
      if (formData.profilePic) {
        submitData.append('profilePic', formData.profilePic);
      }
      
      const response = await fetch('/api/submit-comment', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form and close
        set({ 
          isSubmitting: false,
          showForm: false,
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
      console.error('Error submitting comment:', error);
      set({ 
        error: 'Failed to submit comment. Please try again.', 
        isSubmitting: false 
      });
      return false;
    }
  },

  submitReply: async (storyId: string, parentId: string, content: string) => {
    const { formData } = get();
    
    if (!content.trim()) {
      set({ error: 'Reply content is required' });
      return false;
    }
    
    set({ isSubmitting: true, error: null });
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name || 'Anonymous');
      submitData.append('comment', content.trim());
      submitData.append('storyId', storyId);
      submitData.append('parentId', parentId);
      
      const response = await fetch('/api/submit-comment', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (result.success) {
        set({ isSubmitting: false });
        return true;
      } else {
        set({ 
          error: result.message, 
          isSubmitting: false 
        });
        return false;
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      set({ 
        error: 'Failed to submit reply. Please try again.', 
        isSubmitting: false 
      });
      return false;
    }
  },

  likeComment: async (commentId: string) => {
    try {
      const response = await fetch('/api/like-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state optimistically
        const { comments } = get();
        const updateCommentLikes = (commentsList: Comment[]): Comment[] => {
          return commentsList.map(comment => {
            if (comment.id === commentId) {
              const isLiked = comment.likedBy.includes('anonymous');
              return {
                ...comment,
                likes: isLiked ? comment.likes - 1 : comment.likes + 1,
                likedBy: isLiked 
                  ? comment.likedBy.filter(id => id !== 'anonymous')
                  : [...comment.likedBy, 'anonymous']
              };
            }
            if (comment.replies.length > 0) {
              return { ...comment, replies: updateCommentLikes(comment.replies) };
            }
            return comment;
          });
        };
        
        set({ comments: updateCommentLikes(comments) });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  }
}));
