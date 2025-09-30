// Profile utilities following DRY principles
import type { SocialLink } from '../config/profileData';
import type { ProfileTranslations } from '../hooks/useProfileTranslations';
import { PROFILE_CARD_CLASSES } from '../config/profileData';

/**
 * Creates social links with translated labels
 * @param baseSocialLinks - Base social links without labels
 * @param translations - Profile translations object
 * @returns Social links with translated labels
 */
export const createSocialLinksWithLabels = (
  baseSocialLinks: Omit<SocialLink, 'label'>[],
  translations: ProfileTranslations
): (SocialLink & { label: string })[] => {
  return baseSocialLinks.map(link => ({
    ...link,
    label: translations.socialLinks[link.id as keyof typeof translations.socialLinks] || link.id,
  }));
};

/**
 * Validates profile data
 * @param data - Profile data to validate
 * @returns Boolean indicating if data is valid
 */
export const validateProfileData = (data: {
  name?: string;
  avatarUrl?: string;
  bio?: string;
}): boolean => {
  return Boolean(data.name && data.avatarUrl && data.bio);
};

/**
 * Gets profile card class names
 * @param className - Additional class names
 * @param variant - Profile card variant
 * @returns Combined class names
 */
export const getProfileCardClasses = (
  className?: string,
  variant?: 'default' | 'compact' | 'minimal'
): string => {
  const baseClasses = PROFILE_CARD_CLASSES.container;
  const variantClasses = {
    default: '',
    compact: PROFILE_CARD_CLASSES.compact,
    minimal: PROFILE_CARD_CLASSES.minimal
  };
  
  const classes = [
    baseClasses,
    variant ? variantClasses[variant] : '',
    className || ''
  ].filter(Boolean);
  
  return classes.join(' ');
};
