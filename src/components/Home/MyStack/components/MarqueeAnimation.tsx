"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "motion/react";
// Using a simple wrap function instead of motion/utils
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

type MarqueeAnimationProps = {
  children: string;
  className?: string;
  direction?: "left" | "right";
  baseVelocity: number;
};

function MarqueeAnimation({
  children,
  className = "",
  direction = "left",
  baseVelocity = 10,
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance optimization: pause when not visible
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Set direction factor
  useEffect(() => {
    directionFactor.current = direction === "left" ? 1 : -1;
  }, [direction]);

  // Intersection Observer for visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '200px' // Start animation before fully visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Page Visibility API for tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Animation loop with performance optimizations
  useAnimationFrame((t, delta) => {
    // Only animate if visible AND not paused AND no reduced motion
    if (!isVisible || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden w-full text-nowrap flex-nowrap flex relative">
      <motion.div
        className={`font-bold uppercase text-4xl md:text-5xl flex flex-nowrap text-nowrap whitespace-nowrap ${className}`}
        style={{ x, width: "max-content" }}
      >
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

export { MarqueeAnimation };
