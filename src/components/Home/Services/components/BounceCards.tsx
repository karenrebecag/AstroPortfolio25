import { motion } from "motion/react"
import { cn } from "../../../../lib/utils"
import { useState, useRef, useEffect } from 'react';

interface Position {
  x: number
  y: number
  rotate: number
}

interface BounceCardsProps {
  className?: string
  images?: string[]
  animationDelay?: number
  animationStagger?: number
  positions?: Position[]
}

export function BounceCards({
  className = "",
  images = [],
  animationDelay = 0.5,
  animationStagger = 0.06,
  positions = [
    { x: -35, y: 0, rotate: 10 },
    { x: -12, y: 0, rotate: 5 },
    { x: 0, y: 0, rotate: -3 },
    { x: 12, y: 0, rotate: -10 },
    { x: 35, y: 0, rotate: 2 }
  ]
}: BounceCardsProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
      style={{
        minHeight: '140px',
        aspectRatio: '2.5/1'
      }}
    >
      {images.map((src, idx) => {
        const position = positions[idx] || { x: 0, y: 0, rotate: 0 };

        return (
          <motion.div
            key={idx}
            className={cn(
              "absolute aspect-square rounded-[20px] overflow-hidden",
              "border-4 border-white dark:border-white/90",
              "shadow-xl dark:shadow-black/30"
            )}
            style={{
              left: '50%',
              top: '50%',
              width: '25%',
              marginLeft: '-12.5%',
              marginTop: '-12.5%'
            }}
            initial={{
              scale: 0,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            animate={shouldAnimate ? {
              scale: 1,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            } : {
              scale: 0,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: animationDelay + (idx * animationStagger),
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <img
              className="w-full h-full object-contain"
              src={src}
              alt={`card-${idx}`}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        );
      })}
    </div>
  );
}