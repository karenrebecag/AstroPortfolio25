import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ReviewData {
  review: string;
  author: string;
  position: string;
  avatar?: string;
  rotation: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

interface ReviewCardsStackIslandProps {
  className?: string;
}

const ReviewCardsStackIsland: React.FC<ReviewCardsStackIslandProps> = ({ 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Maximum 4 reviews with exact design specifications - row layout with slight stacking
  const reviewsData: ReviewData[] = [
    {
      review: "Karen's design engineering approach transformed our entire user experience. The attention to detail and technical execution exceeded all expectations.",
      author: "M. Rodriguez",
      position: "Product Manager, TechFlow",
      avatar: undefined,
      rotation: 2,
      backgroundColor: "#C0D645",
      textColor: "#000000",
      fontFamily: "font-primary" // Inter
    },
    {
      review: "Working with Karen was a game-changer for our startup. Her ability to bridge design and development saved us months of iteration.",
      author: "S. Chen",
      position: "CTO, InnovateLab",
      avatar: undefined,
      rotation: -1,
      backgroundColor: "#EEEEEE",
      textColor: "#000000",
      fontFamily: "font-primary" // Inter
    },
    {
      review: "The 3D animations and WebGL implementations Karen delivered were absolutely stunning. Her technical expertise in modern web technologies is exceptional.",
      author: "A. Thompson",
      position: "Creative Director, PixelForge",
      avatar: undefined,
      rotation: 1.5,
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      fontFamily: "font-primary" // Inter
    },
    {
      review: "A rebrand is not typically done in a chaotic industry like ours, so their work has really set us apart. 10/10 for Karen's team.",
      author: "B. Gordon",
      position: "CEO & Founder, Archin Studio",
      avatar: undefined,
      rotation: -2,
      backgroundColor: "#151515",
      textColor: "#FFFFFF",
      fontFamily: "font-primary" // Inter
    }
  ].slice(0, 4); // Ensure maximum 4 reviews

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Set initial state - cards start from left with scale 0
    gsap.set(cards, {
      x: -200,
      scale: 0,
      opacity: 0,
      rotation: 0,
      transformOrigin: "center center"
    });

    // Create ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        once: true
      }
    });

    // Animate cards from left to right with stagger
    tl.to(cards, {
      x: 0,
      scale: (index) => index === 0 ? 0.85 : index === 1 ? 0.9 : index === 2 ? 0.95 : 1,
      opacity: 1,
      rotation: (index) => reviewsData[index]?.rotation || 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "elastic.out(1, 0.6)",
      delay: 0.2,
      transformOrigin: "center center"
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && cardsRef.current) {
      cardsRef.current[index] = el;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`review-cards-stack-island ${className}`}
    >
      {reviewsData.map((data, index) => (
        <div
          key={index}
          ref={(el) => addToRefs(el, index)}
          className={`card-position card-${index}`}
          style={{
            '--card-bg': data.backgroundColor,
            '--card-text': data.textColor,
            transform: `translateY(-50%) scale(${index === 0 ? 0.85 : index === 1 ? 0.9 : index === 2 ? 0.95 : 1}) rotate(${data.rotation}deg)`,
          } as React.CSSProperties}
        >
          <div className={`card-content ${data.fontFamily}`}>
            <div className="review-content">
              <p className="review-text">"{data.review}"</p>
              <div className="author-info">
                <div className="author-name">{data.author}</div>
                <div className="author-position">{data.position}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};

export default ReviewCardsStackIsland;
