// Types for the reviews system

export interface Review {
  id: string;
  name: string;
  position?: string; // Job title, company, or how they know Karen
  review: string;
  rating?: number; // 1-5 star rating
  avatar?: string; // Profile picture URL
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  moderationToken?: string; // Token for email moderation links
}

export interface ReviewFormData {
  name: string;
  position: string;
  review: string;
  rating?: number;
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

// Props for ReviewsSection component
export interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
  reviews: Review[];
  showWorldSvg?: boolean;
  showBrushBackground?: boolean;
  layout?: 'world' | 'stack' | 'grid' | 'marquee';
  theme?: 'light' | 'dark';
  className?: string;
}
