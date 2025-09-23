import React, { useEffect, useRef } from 'react';

// Array de reviews
const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    description: "Karen delivered an exceptional website that exceeded all our expectations. Her attention to detail and creative vision transformed our brand completely."
  },
  {
    id: 2,
    name: "Michael Chen",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    description: "Working with Karen was a game-changer for our startup. She created a stunning UI/UX that our users absolutely love. Highly recommended!"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    description: "Karen's motion design skills are incredible. She brought our static designs to life with beautiful animations that perfectly capture our brand essence."
  },
  {
    id: 4,
    name: "David Thompson",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    description: "Professional, creative, and reliable. Karen delivered our e-commerce platform on time and within budget. The results speak for themselves."
  },
  {
    id: 5,
    name: "Lisa Park",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    description: "Karen's art direction elevated our entire visual identity. She has an amazing eye for design and understands how to create compelling user experiences."
  },
  {
    id: 6,
    name: "James Wilson",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    description: "Exceptional work on our mobile app. Karen's technical skills combined with her design expertise resulted in a product our customers can't stop talking about."
  }
];

const ReviewsIsland: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crear el marquee de reviews
    const createReviewsMarquee = () => {
      const container = containerRef.current;
      if (!container) return;

      // Limpiar contenido existente
      container.innerHTML = '';

      // Crear marquee wrapper
      const marqueeWrapper = document.createElement('div');
      marqueeWrapper.className = 'reviews-marquee-wrapper';

      // Crear marquee container
      const marqueeContainer = document.createElement('div');
      marqueeContainer.className = 'reviews-marquee';

      // Función para crear una card de review
      const createReviewCard = (review: typeof reviewsData[0]) => {
        const card = document.createElement('div');
        card.className = 'review-card-marquee';
        
        card.innerHTML = `
          <div class="card-inner">
            <div class="gradient-border"></div>
            
            <!-- Profile section -->
            <div class="profile-section">
              <div class="profile-pic">
                <img src="${review.profilePic}" alt="${review.name}" loading="lazy" />
              </div>
              <h3 class="reviewer-name">${review.name}</h3>
            </div>
            
            <!-- Review description -->
            <p class="review-description">
              ${review.description}
            </p>
          </div>
        `;
        
        return card;
      };

      // Crear primera serie de cards
      const firstSet = document.createElement('div');
      firstSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        firstSet.appendChild(createReviewCard(review));
      });

      // Crear segunda serie de cards (duplicada para seamless loop)
      const secondSet = document.createElement('div');
      secondSet.className = 'reviews-set';
      reviewsData.forEach(review => {
        secondSet.appendChild(createReviewCard(review));
      });

      // Agregar ambos sets al marquee
      marqueeContainer.appendChild(firstSet);
      marqueeContainer.appendChild(secondSet);
      marqueeWrapper.appendChild(marqueeContainer);
      container.appendChild(marqueeWrapper);
    };

    // Configurar IntersectionObserver para performance
    const setupIntersectionObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const marquee = entry.target.querySelector('.reviews-marquee');
            if (marquee) {
              if (entry.isIntersecting) {
                (marquee as HTMLElement).style.animationPlayState = 'running';
              } else {
                (marquee as HTMLElement).style.animationPlayState = 'paused';
              }
            }
          });
        },
        {
          rootMargin: '200px 0px',
          threshold: 0.1
        }
      );

      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    };

    // Crear el marquee al montar el componente
    createReviewsMarquee();
    setupIntersectionObserver();

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="reviews-container">
      {/* El contenido se genera dinámicamente con JavaScript vanilla */}
    </div>
  );
};

export default ReviewsIsland;
