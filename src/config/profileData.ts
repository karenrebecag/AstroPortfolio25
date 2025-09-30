// Profile data configuration following DRY principles
import { Mail, Github, Linkedin, Instagram } from 'lucide-react';

export interface SocialLink {
  id: string;
  icon: React.ComponentType<any>;
  href: string;
}

export interface ProfileData {
  name: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
}

// Centralized profile data - single source of truth
export const KAREN_PROFILE_DATA: ProfileData = {
  name: 'Karen Rebeca Ortiz',
  avatarUrl: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/A5A05E33-1DDD-4041-BCF4-4522767BFCEE.webp',
  socialLinks: [
    { 
      id: 'linkedin', 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282' 
    },
    { 
      id: 'instagram', 
      icon: Instagram, 
      href: 'https://www.instagram.com/karenrebeca.og/' 
    },
    { 
      id: 'github', 
      icon: Github, 
      href: 'https://github.com/karenrebecag' 
    },
    { 
      id: 'email', 
      icon: Mail, 
      href: 'mailto:sodioinfo@gmail.com' 
    },
  ],
};

// CSS Classes - Single source of truth for all styling
export const PROFILE_CARD_CLASSES = {
  container: 'profile-card-container',
  card: 'profile-card',
  backdrop: 'profile-card-backdrop',
  contentWrapper: 'profile-content-wrapper',
  avatar: 'profile-avatar',
  avatarImage: 'avatar-image',
  infoContainer: 'profile-info-container',
  name: 'profile-name',
  bio: 'profile-bio',
  divider: 'profile-divider',
  socialLinks: 'social-links',
  socialButtonWrapper: 'social-button-wrapper',
  socialButton: 'social-button',
  socialIcon: 'social-icon',
  tooltip: 'tooltip',
  tooltipVisible: 'tooltip-visible',
  tooltipArrow: 'tooltip-arrow',
  // Variants
  compact: 'profile-card-compact',
  minimal: 'profile-card-minimal',
} as const;

// Fallback avatar generator
export const generateFallbackAvatar = (name: string): string => {
  const initials = name.charAt(0).toUpperCase();
  return `https://placehold.co/96x96/6366f1/white?text=${initials}`;
};
