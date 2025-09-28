// RedditCommentsIsland.tsx - Reddit-style nested comments system
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './Card.tsx';
import { Avatar, AvatarFallback } from './Avatar.tsx';
import { Badge } from './Badge.tsx';
import { Textarea } from './Textarea.tsx';
import TypeSound from './TypeSound.tsx';
import { Heart, MessageSquare, MoreHorizontal, Reply, ChevronDown, ChevronUp, ArrowUpDown, Upload, Trash2 } from 'lucide-react';
import { useCommentsStore } from '../../stores/commentsStore';
import '../../styles/reddit-comments.css';
import { useToast } from '../../hooks/useToast';
import { useUserCache } from '../../hooks/useUserCache';
import type { Comment } from '../../types/comments';

// Props for individual comment component
interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply: (parentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  currentUserId?: string;
}

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
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
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
                data-cursor-text={userLiked ? 'Unlike' : 'Like Comment'}
              >
                <Heart className={`${userLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              {/* Reply button */}
              <button 
                className="comment-action-btn"
                onClick={() => setShowReplyBox(!showReplyBox)}
                data-cursor-text="Reply to Comment"
              >
                <Reply />
                Reply
              </button>

          
              {/* Collapse toggle for replies */}
              {comment.replies && comment.replies.length > 0 && (
                <button 
                  className="comment-action-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ marginLeft: 'auto' }}
                  data-cursor-text={isExpanded ? 'Hide Replies' : 'Show Replies'}
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  {isExpanded ? 'Collapse' : `Show ${comment.replies.length} replies`}
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
              <div 
                className="comment-avatar comment-avatar-empty"
                style={{
                  background: '#f3f4f6',
                  border: '2px dashed #d1d5db'
                }}
              >
                <Upload style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
              </div>
              <div className="reply-form-content">
                <textarea
                  placeholder="What are your thoughts?"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="comment-input reply-textarea"
                  data-cursor-text="Write Reply"
                />
                <div className="reply-buttons">
                  {/* Cancel Button - SecondaryButton style */}
                  <div className="glass-button-wrap">
                    <button 
                      className="glass-button"
                      onClick={() => { setShowReplyBox(false); setReplyText(''); }}
                      data-cursor-text="Cancel Reply"
                    >
                      <span className="glass-button-text">Discard</span>
                      <div className="glass-button-shadow"></div>
                    </button>
                  </div>
                  
                  {/* Comment Button - MainButton style */}
                  <div className="realism-button-wrapper">
                    <button 
                      className="realism-button"
                      onClick={handleReplySubmit} 
                      disabled={!replyText.trim()}
                      data-cursor-text="Submit Reply"
                    >
                      <div className="button-glow"></div>
                      <div className="button-blob"></div>
                      <div className="button-content">
                        <span className="button-text">Submit</span>
                        <div className="inner-glow"></div>
                      </div>
                    </button>
                  </div>
                </div>
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
        showSuccess(`Welcome back, ${cachedData.name}! Your information has been pre-filled. You can check my privacy policy for more details.`);
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
      
      showSuccess('Comment submitted successfully! It will appear after moderation.');
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
      showSuccess('Reply submitted! It will appear after moderation.');
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
      showError('Failed to update like. Please try again.');
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

      {/* Add Comment Title */}
      <motion.div 
        className="add-comment-title"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span>Add Comment</span>
            <p className="add-comment-hint">
              Share your thoughts and join the discussion. Click on the avatar to add your profile picture and make your comment stand out.
            </p>
          </div>
          
          {/* Clear Cache Button - only show if there's cached data */}
          {hasCachedData && (
            <button
              onClick={handleClearCache}
              className="clear-cache-btn"
              data-cursor-text="Clear Saved Data"
              title="Clear your saved information"
            >
              <Trash2 size={16} />
              <span>Clear Data</span>
            </button>
          )}
        </div>
      </motion.div>

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
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormField('name', e.target.value)}
                  className="comment-input"
                  data-cursor-text="Add Your Name"
                  required
                />
                
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormField('email', e.target.value)}
                  className="comment-input"
                  data-cursor-text="Add Your Email"
                />
                
                <textarea
                  placeholder="Start a discussion..."
                  value={formData.comment}
                  onChange={(e) => setFormField('comment', e.target.value)}
                  className="comment-input comment-textarea"
                  data-cursor-text="Write Your Comment"
                  required
                />
                
                <div className="comment-submit-buttons">
                  {/* Main Button - Post Comment */}
                  <div className="realism-button-wrapper">
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !formData.name.trim() || !formData.comment.trim()}
                      className="realism-button"
                      data-cursor-text="Post Comment"
                    >
                      <div className="button-glow"></div>
                      <div className="button-blob"></div>
                      <div className="button-content">
                        <span className="button-text">{isSubmitting ? 'Posting...' : 'Submit'}</span>
                        <div className="inner-glow"></div>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Privacy Policy Notice */}
                <p className="privacy-notice">
                  By submitting a comment, you agree to my{' '}
                  <a href="/privacy" className="privacy-link" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  . Your data is handled with care and only used for moderation purposes.
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Comments Header */}
      <motion.div 
        className="comments-header"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="comments-title">
          <span>Comments</span>
          <span className="comments-count-pill">{nestedComments.length}</span>
        </div>
        <div className="comments-sort">
          <ArrowUpDown className="sort-icon" />
          <select className="sort-dropdown" data-cursor-text="Sort Comments" aria-label="Sort comments by date">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </motion.div>

      {/* Separator line */}
      <div className="comments-separator"></div>

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
              <p className="loading-text">Loading comments...</p>
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
              <p>No comments yet. Be the first to start the discussion!</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RedditCommentsIsland;
