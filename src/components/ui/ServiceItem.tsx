import React, { useState } from 'react';
import FlipText from './FlipText';
import Tag from './Tag.astro';

interface ServiceItemProps {
  number: string;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  isActive: boolean;
  onToggle: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  number,
  title1,
  title2,
  description,
  tags,
  isActive,
  onToggle
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`service-item ${isActive ? 'active' : ''}`}
      data-service={number}
      onMouseEnter={() => {
        setIsHovered(true);
        if (window.innerWidth > 768) {
          onToggle();
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (window.innerWidth <= 768) {
          onToggle();
        }
      }}
    >
      <div className={`service-number ${!isActive ? 'inactive' : ''}`}>
        {number.padStart(2, '0')}.
      </div>
      <div className="service-content">
        <div className="service-title-container">
          <FlipText
            text={title1}
            className={`service-title ${!isActive ? 'inactive' : ''}`}
            isHovered={isHovered}
          />
          <FlipText
            text={title2}
            className={`service-title ${!isActive ? 'inactive' : ''}`}
            isHovered={isHovered}
          />
        </div>
        <div className="service-details">
          <div className="service-info">
            <div className="service-tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <p className="service-description">
              {description}
            </p>
          </div>
          <div className="service-images">
            <div className="service-image"></div>
            <div className="service-image"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;