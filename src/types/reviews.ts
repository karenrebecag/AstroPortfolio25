// Types for the reviews system

export interface Review {
  id: string;
  name: string;
  position?: string; // Job title, company, or how they know Karen
  review: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  moderationToken?: string; // Token for email moderation links
}

export interface ReviewFormData {
  name: string;
  position: string;
  review: string;
}

export interface ModerationEmailData {
  reviewId: string;
  name: string;
  review: string;
  profilePicUrl?: string;
  timestamp: string;
  approveUrl: string;
  rejectUrl: string;
}
