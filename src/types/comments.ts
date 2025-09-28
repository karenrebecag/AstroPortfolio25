// Types for the comments system

export interface Comment {
  id: string;
  name: string;
  comment: string;
  profilePicUrl?: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  moderationToken?: string; // Token for email moderation links
  storyId: string; // ID of the success story this comment belongs to
  parentId?: string; // ID of parent comment for nested replies
  likes: number; // Number of likes (no dislikes)
  likedBy: string[]; // Array of user IDs who liked this comment
  replies: Comment[]; // Nested replies
  depth: number; // Nesting depth for UI indentation
}

export interface CommentFormData {
  name: string;
  email: string;
  comment: string;
  profilePic?: File | null;
}

export interface ModerationEmailData {
  commentId: string;
  name: string;
  comment: string;
  profilePicUrl?: string;
  timestamp: string;
  approveUrl: string;
  rejectUrl: string;
}
