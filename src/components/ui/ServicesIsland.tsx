import React, { useState } from 'react';
import FlipText from './FlipText';
import { BounceCards } from './BounceCards';

interface Position {
  x: number;
  y: number;
  rotate: number;
}

interface Service {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  images: string[];
  positions: Position[];
}

const ServicesIsland: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(1); // Primer servicio activo por defecto
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      title1: "UI/UX",
      title2: "Design",
      description: "Crafting intuitive and visually appealing digital experiences that prioritize user needs and business goals.",
      tags: ["User Interface", "User Experience", "Web Design"],
      images: [
        "https://picsum.photos/300/300?random=1",
        "https://picsum.photos/300/300?random=2",
        "https://picsum.photos/300/300?random=3",
        "https://picsum.photos/300/300?random=4"
      ],
      positions: [
        { x: -45, y: -5, rotate: 5 },
        { x: -15, y: 8, rotate: -3 },
        { x: 15, y: -3, rotate: 8 },
        { x: 45, y: 5, rotate: -5 }
      ]
    },
    {
      id: 2,
      title1: "Motion",
      title2: "Design",
      description: "Creating engaging animations and micro-interactions that enhance user experience and bring interfaces to life.",
      tags: ["Animation", "Micro-interactions", "Prototyping"],
      images: [
        "https://picsum.photos/300/300?random=5",
        "https://picsum.photos/300/300?random=6",
        "https://picsum.photos/300/300?random=7",
        "https://picsum.photos/300/300?random=8"
      ],
      positions: [
        { x: -42, y: 3, rotate: -5 },
        { x: -14, y: -8, rotate: 2 },
        { x: 14, y: 5, rotate: -8 },
        { x: 42, y: -3, rotate: 3 }
      ]
    },
    {
      id: 3,
      title1: "Art",
      title2: "Direction",
      description: "Developing cohesive visual strategies and creative direction that align with brand identity and business objectives.",
      tags: ["Visual Identity", "Brand Strategy", "Creative Direction"],
      images: [
        "https://picsum.photos/300/300?random=9",
        "https://picsum.photos/300/300?random=10",
        "https://picsum.photos/300/300?random=11",
        "https://picsum.photos/300/300?random=12"
      ],
      positions: [
        { x: -43, y: -3, rotate: 3 },
        { x: -15, y: 6, rotate: -5 },
        { x: 15, y: -4, rotate: 7 },
        { x: 43, y: 4, rotate: -2 }
      ]
    }
  ];


  const handleServiceClick = (serviceId: number) => {
    setActiveService(activeService === serviceId ? 0 : serviceId); // Toggle para todos los dispositivos
    setHoveredService(activeService === serviceId ? null : serviceId);
  };

  return (
    <div className="services-list">
      {services.map((service) => {
        const isActive = activeService === service.id;
        const isHovered = hoveredService === service.id;

        return (
          <div
            key={service.id}
            className={`service-item ${isActive ? 'active' : ''}`}
            data-service={service.id}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className={`service-number ${!isActive ? 'inactive' : ''}`}>
              {service.id.toString().padStart(2, '0')}.
            </div>
            <div className="service-content">
              <div className="service-title-container">
                <FlipText
                  text={service.title1}
                  className={`service-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
                <FlipText
                  text={service.title2}
                  className={`service-title ${!isActive ? 'inactive' : ''}`}
                  isHovered={isHovered}
                />
              </div>
              <div className="service-details">
                <div className="service-info">
                  <div className="service-tags">
                    {service.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="service-description">
                    {service.description}
                  </p>
                </div>
                <div className="service-images">
                  <BounceCards
                    images={service.images}
                    animationDelay={0.2}
                    animationStagger={0.15}
                    positions={service.positions}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesIsland;