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
}

export interface CommentFormData {
  name: string;
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
