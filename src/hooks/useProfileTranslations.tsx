// Custom hook for profile translations following DRY principles
import { translations } from '../i18n/translations.js';
import { getLangFromUrl } from '../i18n/utils.js';

export interface ProfileTranslations {
  bio: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    github: string;
    email: string;
  };
}

export const useProfileTranslations = (): ProfileTranslations => {
  // Get current language from URL
  const getCurrentLang = (): string => {
    if (typeof window !== 'undefined') {
      return getLangFromUrl(new URL(window.location.href));
    }
    return 'en';
  };

  // Get translations for current language with fallback
  const getTranslations = (): ProfileTranslations => {
    const lang = getCurrentLang();
    const langTranslations = translations[lang as keyof typeof translations];
    return langTranslations?.profileCard || translations.en.profileCard;
  };

  return getTranslations();
};
