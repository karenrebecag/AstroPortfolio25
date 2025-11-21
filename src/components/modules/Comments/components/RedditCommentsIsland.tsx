// RedditCommentsIsland.tsx - Reddit-style nested comments system
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import TypeSound from '../../../ui/TypeSound.tsx';
import { TextDisperseBlack } from '../../../ui/TextDisperseBlack.tsx';
import { Heart, MessageSquare, Reply, ChevronDown, ChevronUp, ArrowUpDown, Upload, Trash2 } from 'lucide-react';
import { useCommentsStore } from '../stores/commentsStore';
import { useToast } from '../../Toasts';
import { useUserCache } from '../hooks/useUserCache';
import { translations } from '../../../../i18n/translations.js';
import { getLangFromUrl } from '../../../../i18n/utils.js';
import type { Comment } from '../types/comments';

// Props for individual comment component
interface CommentItemProps {
  
  comment: Comment;
  depth?: number;
  onReply: (parentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  currentUserId?: string;
}

// Get current language from URL
const getCurrentLang = () => {
  if (typeof window !== 'undefined') {
    return getLangFromUrl(new URL(window.location.href));
  }
  return 'en';
};

// Get translations for current language
const getTranslations = () => {
  const lang = getCurrentLang();
  return translations[lang as keyof typeof translations]?.comments || translations.en.comments;
};

// Individual comment component with Reddit-style design
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  depth = 0, 
  onReply, 
  onLike,
  currentUserId = 'anonymous'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [userLiked, setUserLiked] = useState(comment.likedBy.includes(currentUserId));
  const t = getTranslations();

  const handleLike = () => {
    setUserLiked(!userLiked);
    onLike(comment.id);
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);
    const months = Math.floor(diff / 2629746000);
    const years = Math.floor(diff / 31556952000);
    
    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    if (days < 7) return `${days} ${t.daysAgo}`;
    if (weeks < 4) return `${weeks} ${t.weeksAgo}`;
    if (months < 12) return `${months} ${t.monthsAgo}`;
    return `${years} ${t.yearsAgo}`;
  };

  const likesCount = comment.likes + (userLiked && !comment.likedBy.includes(currentUserId) ? 1 : 0) - (comment.likedBy.includes(currentUserId) && !userLiked ? 1 : 0);

  return (
    <motion.div 
      className={`comment-item ${depth > 0 ? 'nested' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
    >
      <div className="comment-card">
        <div className="flex items-start gap-4">
          <div className="comment-avatar clickable">
            {comment.profilePicUrl ? (
              <img 
                src={comment.profilePicUrl} 
                alt={comment.name} 
                className="w-full h-full object-cover rounded-full" 
                loading="lazy"
                decoding="async"
              />
            ) : (
              getInitials(comment.name)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="comment-header">
              <span className="comment-author">{comment.name}</span>
              <span className="comment-separator">•</span>
              <span className="comment-timestamp">{formatTimestamp(comment.timestamp)}</span>
              {comment.name === "Karen Ortiz" && <span className="comment-badge">Author</span>}
            </div>
            
            <div className="comment-content">{comment.comment}</div>
            
            <div className="comment-actions">
              {/* Like button */}
              <button
                className={`comment-action-btn like-button ${userLiked ? 'liked' : ''}`}
                onClick={handleLike}
                data-cursor-text={userLiked ? t.like : t.like}
              >
                <Heart className={`${userLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              {/* Reply button */}
              <button 
                className="comment-action-btn"
                onClick={() => setShowReplyBox(!showReplyBox)}
                data-cursor-text={t.reply}
              >
                <Reply />
                {t.reply}
              </button>

          
              {/* Collapse toggle for replies */}
              {comment.replies && comment.replies.length > 0 && (
                <button 
                  className="comment-action-btn comment-collapse-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  data-cursor-text={isExpanded ? t.hideReplies : t.showReplies}
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  {isExpanded ? t.hideReplies : `${t.showReplies} (${comment.replies.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {showReplyBox && (
          <motion.div 
            className="reply-form"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="reply-form-row">
              <div className="comment-avatar comment-avatar-empty">
                <Upload className="upload-icon" />
              </div>
              <div className="reply-form-content">
                <textarea
                  placeholder={t.placeholder}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="comment-input reply-textarea"
                  data-cursor-text={t.reply}
                />
                <div className="reply-buttons">
                  {/* SecondaryButton Component - Cancel */}
                                    <Button
                                      variant="ghost"
                                      onClick={() => { setShowReplyBox(false); setReplyText(''); }}
                                    >
                                      {t.cancel}
                                    </Button>                  
                  {/* MainButton Component - Submit Reply */}
                                    <Button
                                      variant="default"
                                      onClick={handleReplySubmit}
                                      disabled={!replyText.trim()}
                                    >
                                      {t.submit}
                                    </Button>                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Nested replies */}
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              depth={depth + 1} 
              onReply={onReply}
              onLike={onLike}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Props for main comments component
interface RedditCommentsIslandProps {
  storyId: string;
}

// Main Reddit-style comments component
const RedditCommentsIsland: React.FC<RedditCommentsIslandProps> = ({ storyId }) => {
  const {
    comments,
    isLoading,
    error,
    formData,
    isSubmitting,
    showForm,
    setFormField,
    resetForm,
    setShowForm,
    fetchComments,
    submitComment,
    submitReply,
    likeComment
  } = useCommentsStore();

  const { showSuccess, showError } = useToast();
  const { cachedData, saveUserData, clearUserData, hasCachedData } = useUserCache();
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const t = getTranslations();

  // Fetch comments on mount
  useEffect(() => {
    fetchComments(storyId);
  }, [fetchComments, storyId]);

  // Pre-fill form with cached data
  useEffect(() => {
    if (hasCachedData && !isInitialized) {
      // Pre-fill name if cached
      if (cachedData.name && !formData.name) {
        setFormField('name', cachedData.name);
      }
      
      // Pre-fill email if cached
      if (cachedData.email && !formData.email) {
        setFormField('email', cachedData.email);
      }
      
      setIsInitialized(true);
      
      // Show success message about pre-filled data
      if (cachedData.name) {
        showSuccess(t.welcomeBack.replace('{name}', cachedData.name));
      }
    }
  }, [cachedData, hasCachedData, formData.name, formData.email, setFormField, isInitialized, showSuccess]);

  // Transform flat comments into nested structure
  useEffect(() => {
    const buildNestedComments = (comments: Comment[]): Comment[] => {
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      // First pass: create map and initialize replies arrays
      comments.forEach(comment => {
        commentMap.set(comment.id, { 
          ...comment, 
          replies: [],
          depth: 0,
          likes: comment.likes || 0,
          likedBy: comment.likedBy || []
        });
      });

      // Second pass: build nested structure
      comments.forEach(comment => {
        const commentWithReplies = commentMap.get(comment.id)!;
        
        if (comment.parentId && commentMap.has(comment.parentId)) {
          const parent = commentMap.get(comment.parentId)!;
          commentWithReplies.depth = parent.depth + 1;
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      return rootComments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setNestedComments(buildNestedComments(comments));
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitComment(storyId);
    
    if (result && typeof result === 'object' && result.success) {
      // Cache user data for future interactions with the permanent URL from Vercel Blob
      const dataToCache = {
        name: formData.name,
        email: formData.email,
        // ONLY cache the permanent Vercel Blob URL, not the temporary blob URL
        profilePicUrl: result.profilePicUrl || (cachedData.profilePicUrl && !cachedData.profilePicUrl.startsWith('blob:') ? cachedData.profilePicUrl : '')
      };
      
      saveUserData(dataToCache);
      
      showSuccess(t.commentPosted);
      setTimeout(() => {
        fetchComments(storyId);
      }, 1000);
    } else if (error) {
      showError(error);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    const success = await submitReply(storyId, parentId, content);
    if (success) {
      showSuccess(t.commentPosted);
      setTimeout(() => {
        fetchComments(storyId);
      }, 1000);
    } else if (error) {
      showError(error);
    }
  };

  const handleLike = async (commentId: string) => {
    const success = await likeComment(commentId);
    if (!success) {
      showError(t.commentFailed);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showError('Profile picture is too large. Maximum size is 5MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file.');
      return;
    }
    
    setFormField('profilePic', file);
  };

  const handleClearCache = () => {
    clearUserData();
    resetForm();
    setIsInitialized(false);
    showSuccess('User data cleared. Form has been reset.');
  };


  return (
    <motion.div
      className="reddit-comments-container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <TypeSound />

      {/* Removed duplicate title - title and subtitle are now only in CommentsSection.astro */}
      {/* Clear Cache Button - only show if there's cached data */}
      {hasCachedData && (
        <div className="flex items-end justify-end mb-4">
          <button
            onClick={handleClearCache}
            className="clear-cache-btn"
            data-cursor-text={t.delete}
            title={t.delete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* New comment form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="comment-form-card">
          <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
              {/* Simple Avatar Upload */}
              <div className="avatar-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="avatar-file-input"
                  id="avatar-upload"
                  data-cursor-text="Upload Profile Pic"
                />
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  {formData.profilePic ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePic)} 
                      alt="Profile" 
                      className="avatar-image"
                    />
                  ) : cachedData.profilePicUrl ? (
                    <img 
                      src={cachedData.profilePicUrl} 
                      alt="Cached Profile" 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <Upload size={20} />
                    </div>
                  )}
                </label>
              </div>
              
              <div className="comment-form-content">
                <input
                  type="text"
                  placeholder={t.enterName}
                  value={formData.name}
                  onChange={(e) => setFormField('name', e.target.value)}
                  className="comment-input"
                  data-cursor-text={t.enterName}
                  required
                />
                
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormField('email', e.target.value)}
                  className="comment-input"
                  data-cursor-text="Add Your Email"
                  required
                />
                
                <textarea
                  placeholder={t.placeholder}
                  value={formData.comment}
                  onChange={(e) => setFormField('comment', e.target.value)}
                  className="comment-input comment-textarea"
                  data-cursor-text={t.placeholder}
                  required
                />
                
                <div className="comment-submit-buttons">
                  {/* Primary Button - Post Comment */}
                  <button
                    type="submit"
                    className="comment-submit-btn"
                    disabled={isSubmitting || !formData.name.trim() || !formData.comment.trim()}
                  >
                    <span className="btn-glow"></span>
                    <span className="btn-blob"></span>
                    <span className="btn-content">
                      <span className="btn-text">{isSubmitting ? t.posting : t.submit}</span>
                      <span className="btn-inner-glow"></span>
                    </span>
                  </button>
                </div>
                
                {/* Privacy Policy Notice */}
                <p className="privacy-notice">
                  {t.privacyNotice}{' '}
                  <a href="/privacy" className="privacy-link" target="_blank" rel="noopener noreferrer">
                    {t.privacyPolicy}
                  </a>
                  {t.privacyDetails}
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Removed redundant Comments Header - title and subtitle are now handled by CommentsSection.astro */}

      {/* Comments list container with scroll */}
      <div className="comments-list-container">
        <motion.div 
          className="space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <div className="comments-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">{t.loadingComments}</p>
            </div>
          ) : nestedComments.length > 0 ? (
            nestedComments.map((comment, index) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                depth={0} 
                onReply={handleReply}
                onLike={handleLike}
                currentUserId="anonymous"
              />
            ))
          ) : (
            <div className="comments-empty">
              <MessageSquare />
              <p>{t.noComments}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RedditCommentsIsland;
