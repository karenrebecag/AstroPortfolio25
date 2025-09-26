import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Reply, 
  Share, 
  MoreHorizontal,
  Upload,
  X,
  Loader2,
  Send
} from 'lucide-react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Card, CardContent, CardHeader } from './Card';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { useCommentsStore } from '../../stores/commentsStore';
import { useToast } from './ToastContainer';
import type { Comment } from '../../types/comments';

// Props for the internal Comment component
interface CommentProps {
  comment: Comment;
  depth?: number;
}

// Internal recursive component to render each comment
const CommentItem: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(0);

  const handleVote = (voteType: 'up' | 'down') => {
    const previousVote = userVote;
    const newVote = userVote === voteType ? null : voteType;
    
    setUserVote(newVote);
    
    // Calculate vote change
    let voteChange = 0;
    if (previousVote === 'up' && newVote === null) voteChange = -1;
    else if (previousVote === 'down' && newVote === null) voteChange = 1;
    else if (previousVote === null && newVote === 'up') voteChange = 1;
    else if (previousVote === null && newVote === 'down') voteChange = -1;
    else if (previousVote === 'up' && newVote === 'down') voteChange = -2;
    else if (previousVote === 'down' && newVote === 'up') voteChange = 2;
    
    setLocalUpvotes(prev => prev + voteChange);
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

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const netScore = localUpvotes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0);

  return (
    <motion.div 
      className={`${depth > 0 ? 'ml-4 md:ml-6 border-l-2 border-purple-200 dark:border-purple-800 pl-4 md:pl-6' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
    >
      <Card className="mb-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar 
              src={comment.profilePicUrl}
              alt={comment.name}
              fallback={getInitials(comment.name)}
              size="sm"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {comment.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              
              <div className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-200">
                {comment.comment}
              </div>
              
              <div className="flex flex-wrap items-center gap-1">
                {/* Vote buttons */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${
                      userVote === 'up' 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                        : ''
                    }`}
                    onClick={() => handleVote('up')}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <span className={`px-2 text-xs font-medium min-w-[24px] text-center ${
                    userVote === 'up' 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : userVote === 'down' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {netScore}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 rounded-full ${
                      userVote === 'down' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                        : ''
                    }`}
                    onClick={() => handleVote('down')}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Action buttons */}
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Reply className="h-3 w-3 mr-1" /> Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Share className="h-3 w-3 mr-1" /> Share
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

// Props for CommentsIsland
interface CommentsIslandProps {
  storyId: string;
}

// Main Comments Island component
const CommentsIsland: React.FC<CommentsIslandProps> = ({ storyId }) => {
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
    submitComment
  } = useCommentsStore();

  const { showSuccess, showError, ToastContainer } = useToast();
  const [dragActive, setDragActive] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments(storyId);
  }, [fetchComments, storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitComment(storyId);
    if (success) {
      showSuccess('Comment submitted successfully! It will appear after moderation.');
      // Refresh comments after a short delay
      setTimeout(() => {
        fetchComments(storyId);
      }, 1000);
    } else if (error) {
      showError(error);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      showError('Profile picture is too large. Maximum size is 5MB.');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      return;
    }
    
    setFormField('profilePic', file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-display">
          Comments
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-primary">
          Share your thoughts about my work and projects
        </p>
      </motion.div>

      {/* New comment form */}
      {!showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 items-center">
                <Avatar fallback="YU" size="sm" />
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Share your thoughts...
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile section */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar 
                      src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : undefined}
                      fallback={formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YU'}
                      size="sm"
                    />
                    
                    {/* Profile pic upload */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-2 transition-colors ${
                        dragActive 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-4 w-4 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                        Photo
                      </p>
                    </div>
                    
                    {formData.profilePic && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormField('profilePic', null)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Name input */}
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    
                    {/* Comment textarea */}
                    <Textarea
                      placeholder="What are your thoughts?"
                      value={formData.comment}
                      onChange={(e) => setFormField('comment', e.target.value)}
                      className="min-h-[100px] resize-none"
                      required
                    />
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.name.trim() || !formData.comment.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Post Comment
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Comments list */}
      <motion.div 
        className="space-y-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-purple-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} depth={0} />
          ))
        )}
      </motion.div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default CommentsIsland;
