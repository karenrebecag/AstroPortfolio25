// Comments Module - Centralized exports
// This module contains all components, stores, types, and hooks related to the comments system

// Components
export { default as RedditCommentsIsland } from './components/RedditCommentsIsland';
export { default as CommentsWithToast } from './components/CommentsWithToast';

// Stores
export { useCommentsStore } from './stores/commentsStore';

// Hooks (re-exported from centralized Toasts module)
export { useToast, ToastProvider } from '../Toasts';
export { useUserCache } from './hooks/useUserCache';

// Types
export type { Comment, CommentFormData, ModerationEmailData } from './types/comments';
