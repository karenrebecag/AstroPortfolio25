import React, { useState, useCallback, useMemo } from 'react';
import { KAREN_PROFILE_DATA, PROFILE_CARD_CLASSES, generateFallbackAvatar, type ProfileData } from '../../config/profileData';
import '../../styles/ProfileCard.css';

interface ProfileCardProps {
  /** Profile data to display */
  profileData?: ProfileData;
  /** Variant of the card */
  variant?: 'default' | 'compact' | 'minimal';
  /** Additional CSS classes */
  className?: string;
  /** Show bio text */
  showBio?: boolean;
  /** Bio text to display */
  bio?: string;
  /** Enable animations */
  animated?: boolean;
}

interface TooltipState {
  visible: boolean;
  text: string;
}

/**
 * ProfileCard Component
 * 
 * A clean, performant profile card following Astro best practices:
 * - Uses React.memo for performance optimization
 * - Implements proper TypeScript interfaces
 * - Follows component composition patterns
 * - Supports multiple variants and customization
 * - Uses centralized data configuration
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData = KAREN_PROFILE_DATA,
  variant = 'default',
  className = '',
  showBio = true,
  bio = "Full Stack Developer passionate about creating exceptional web experiences with modern technologies.",
  animated = true
}) => {
  // State management with proper TypeScript
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, text: '' });
  const [imageError, setImageError] = useState(false);

  // Memoized values for performance
  const avatarSrc = useMemo(() => 
    imageError ? generateFallbackAvatar(profileData.name) : profileData.avatarUrl,
    [imageError, profileData.name, profileData.avatarUrl]
  );

  const cardClasses = useMemo(() => {
    const baseClasses = [
      PROFILE_CARD_CLASSES.container,
      variant !== 'default' && PROFILE_CARD_CLASSES[variant],
      animated && 'profile-card-animated',
      className
    ].filter(Boolean).join(' ');
    
    return baseClasses;
  }, [variant, animated, className]);

  // Event handlers with useCallback for performance
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const showTooltip = useCallback((text: string) => {
    setTooltip({ visible: true, text });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip({ visible: false, text: '' });
  }, []);

  const handleSocialClick = useCallback((href: string, id: string) => {
    // Analytics or tracking could be added here
    window.open(href, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className={cardClasses}>
      {/* Card backdrop for glass effect */}
      <div className={PROFILE_CARD_CLASSES.backdrop} />
      
      {/* Main card content */}
      <div className={PROFILE_CARD_CLASSES.card}>
        <div className={PROFILE_CARD_CLASSES.contentWrapper}>
          
          {/* Avatar section */}
          <div className={PROFILE_CARD_CLASSES.avatar}>
            <img
              src={avatarSrc}
              alt={`${profileData.name} avatar`}
              className={PROFILE_CARD_CLASSES.avatarImage}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Profile information */}
          <div className={PROFILE_CARD_CLASSES.infoContainer}>
            <h2 className={PROFILE_CARD_CLASSES.name}>
              {profileData.name}
            </h2>
            
            {showBio && variant !== 'minimal' && (
              <p className={PROFILE_CARD_CLASSES.bio}>
                {bio}
              </p>
            )}
          </div>

          {/* Divider */}
          {variant !== 'minimal' && (
            <div className={PROFILE_CARD_CLASSES.divider} />
          )}

          {/* Social links */}
          <div className={PROFILE_CARD_CLASSES.socialLinks}>
            {profileData.socialLinks.map((social) => {
              const IconComponent = social.icon;
              
              return (
                <div 
                  key={social.id}
                  className={PROFILE_CARD_CLASSES.socialButtonWrapper}
                >
                  <button
                    className={PROFILE_CARD_CLASSES.socialButton}
                    onClick={() => handleSocialClick(social.href, social.id)}
                    onMouseEnter={() => showTooltip(social.id)}
                    onMouseLeave={hideTooltip}
                    onFocus={() => showTooltip(social.id)}
                    onBlur={hideTooltip}
                    aria-label={`Visit ${social.id} profile`}
                    type="button"
                  >
                    <IconComponent 
                      className={PROFILE_CARD_CLASSES.socialIcon}
                      aria-hidden="true"
                    />
                  </button>
                  
                  {/* Tooltip */}
                  {tooltip.visible && tooltip.text === social.id && (
                    <div className={`${PROFILE_CARD_CLASSES.tooltip} ${PROFILE_CARD_CLASSES.tooltipVisible}`}>
                      {social.id}
                      <div className={PROFILE_CARD_CLASSES.tooltipArrow} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with React.memo for performance optimization
export default React.memo(ProfileCard);
