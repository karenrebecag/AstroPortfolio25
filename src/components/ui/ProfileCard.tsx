import React, { useState } from 'react';
import { 
  KAREN_PROFILE_DATA, 
  generateFallbackAvatar, 
  PROFILE_CARD_CLASSES,
  type SocialLink as BaseSocialLink 
} from '../../config/profileData';
import { useProfileTranslations } from '../../hooks/useProfileTranslations';
import { createSocialLinksWithLabels, getProfileCardClasses } from '../../utils/profileUtils';

interface SocialLink extends BaseSocialLink {
  label: string;
}

interface ProfileCardProps {
  avatarUrl?: string;
  name?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

const ProfileCard = ({
  avatarUrl = KAREN_PROFILE_DATA.avatarUrl,
  name = KAREN_PROFILE_DATA.name,
  bio,
  socialLinks = [],
  className = '',
  variant = 'default',
}: ProfileCardProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={getProfileCardClasses(className, variant)}>
      <div className={PROFILE_CARD_CLASSES.card}>
        <div className={PROFILE_CARD_CLASSES.contentWrapper}>
          <div className={PROFILE_CARD_CLASSES.avatar}>
            <img
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              className={PROFILE_CARD_CLASSES.avatarImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = generateFallbackAvatar(name);
              }}
            />
          </div>

          <div className={PROFILE_CARD_CLASSES.infoContainer}>
            <h2 className={PROFILE_CARD_CLASSES.name}>{name}</h2>
            <p className={PROFILE_CARD_CLASSES.bio}>{bio}</p>
          </div>
        </div>

        <div className={PROFILE_CARD_CLASSES.divider} />

        <div className={PROFILE_CARD_CLASSES.socialLinks}>
          {socialLinks.map((item) => (
            <SocialButton
              key={item.id}
              item={item}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
            />
          ))}
        </div>
      </div>

      <div className={PROFILE_CARD_CLASSES.backdrop} />
    </div>
  );
};

const SocialButton = ({ item, setHoveredItem, hoveredItem }: {
  item: SocialLink;
  setHoveredItem: (id: string | null) => void;
  hoveredItem: string | null;
}) => (
  <div className={PROFILE_CARD_CLASSES.socialButtonWrapper}>
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={PROFILE_CARD_CLASSES.socialButton}
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      aria-label={item.label}
    >
      <div className={PROFILE_CARD_CLASSES.socialIcon}>
        <item.icon />
      </div>
    </a>
    <Tooltip item={item} hoveredItem={hoveredItem} />
  </div>
);


const Tooltip = ({ item, hoveredItem }: {
  item: SocialLink;
  hoveredItem: string | null;
}) => (
  <div
    role="tooltip"
    className={`${PROFILE_CARD_CLASSES.tooltip} ${
      hoveredItem === item.id ? PROFILE_CARD_CLASSES.tooltipVisible : ''
    }`}
  >
    {item.label}
    <div className={PROFILE_CARD_CLASSES.tooltipArrow} />
  </div>
);

export { ProfileCard };

// Profile Card personalizada para Karen - DRY implementation
export const KarenProfileCard = () => {
  const translations = useProfileTranslations();

  // Create social links with translations using utility function
  const socialLinksWithLabels = createSocialLinksWithLabels(
    KAREN_PROFILE_DATA.socialLinks,
    translations
  );

  return (
    <ProfileCard
      bio={translations.bio}
      socialLinks={socialLinksWithLabels}
    />
  );
};