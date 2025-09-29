import React, { useState } from 'react';
import { Mail, Github, Linkedin, Instagram } from 'lucide-react';

interface SocialLink {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  bio: string;
  socialLinks?: SocialLink[];
}

const ProfileCard = ({
  avatarUrl,
  name,
  bio,
  socialLinks = [],
}: ProfileCardProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-content-wrapper">
          <div className="profile-avatar">
            <img
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              className="avatar-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/96x96/6366f1/white?text=${name.charAt(0)}`;
              }}
            />
          </div>

          <div className="profile-info-container">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-bio">{bio}</p>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="social-links">
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

      <div className="profile-card-backdrop" />
    </div>
  );
};

const SocialButton = ({ item, setHoveredItem, hoveredItem }: {
  item: SocialLink;
  setHoveredItem: (id: string | null) => void;
  hoveredItem: string | null;
}) => (
  <div className="social-button-wrapper">
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-button"
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      aria-label={item.label}
    >
      <div className="social-icon">
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
    className={`tooltip ${hoveredItem === item.id ? 'tooltip-visible' : ''}`}
  >
    {item.label}
    <div className="tooltip-arrow" />
  </div>
);

export { ProfileCard };

// Profile Card personalizada para Karen con datos del StickyFooter
export const KarenProfileCard = () => {
  const cardProps = {
    avatarUrl: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/A5A05E33-1DDD-4041-BCF4-4522767BFCEE.webp',
    name: 'Karen Rebeca Ortiz',
    bio: 'Building beautiful and intuitive digital experiences. Passionate about design systems and web animation.',
    socialLinks: [
      { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282' },
      { id: 'instagram', icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/karenrebeca.og/' },
      { id: 'github', icon: Github, label: 'GitHub', href: 'https://github.com/karenrebecag' },
      { id: 'email', icon: Mail, label: 'Email', href: 'mailto:sodioinfo@gmail.com' },
    ],
  };

  return <ProfileCard {...cardProps} />;
};