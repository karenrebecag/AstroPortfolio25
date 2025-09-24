import React, { useMemo } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

interface ScrollRevealProps {
  children?: ReactNode;
  text?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  text,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Use useScroll with target element and proper offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform values for container rotation
  const rotate = useTransform(scrollYProgress, [0, 1], [baseRotation, 0]);

  const splitText = useMemo(() => {
    // Use text prop if provided, otherwise try to extract from children
    const textContent = text || (typeof children === "string" ? children : "");
    
    if (!textContent) {
      console.warn("ScrollReveal: No text content provided");
      return [];
    }
    
    const words = textContent.split(/(\s+)/);
    const totalWords = words.filter(word => !word.match(/^\s+$/)).length;
    
    return words.map((word, index) => {
      if (word.match(/^\s+$/)) {
        return <span key={index}>{word}</span>;
      }
      
      const wordIndex = words.slice(0, index).filter(w => !w.match(/^\s+$/)).length;
      
      return (
        <ScrollRevealWord
          key={index}
          word={word}
          wordIndex={wordIndex}
          totalWords={totalWords}
          scrollProgress={scrollYProgress}
          baseOpacity={baseOpacity}
          enableBlur={enableBlur}
          blurStrength={blurStrength}
        />
      );
    });
  }, [children, text, baseOpacity, enableBlur, blurStrength]);

  return (
    <motion.div 
      ref={containerRef} 
      className={`my-5 ${containerClassName}`}
      style={{ 
        rotate,
        transformOrigin: "0% 50%"
      }}
    >
      <div className={`${textClassName}`}>
        {splitText}
      </div>
    </motion.div>
  );
};

interface ScrollRevealWordProps {
  word: string;
  wordIndex: number;
  totalWords: number;
  scrollProgress: MotionValue<number>;
  baseOpacity: number;
  enableBlur: boolean;
  blurStrength: number;
}

const ScrollRevealWord: React.FC<ScrollRevealWordProps> = ({
  word,
  wordIndex,
  totalWords,
  scrollProgress,
  baseOpacity,
  enableBlur,
  blurStrength,
}) => {
  // Calculate stagger based on word position
  const staggerStart = wordIndex / totalWords * 0.5;
  const staggerEnd = staggerStart + 0.3;
  
  // Create individual transforms for each word with stagger
  const opacity = useTransform(
    scrollProgress,
    [staggerStart, Math.min(staggerEnd, 1)],
    [baseOpacity, 1]
  );

  const blurValue = useTransform(
    scrollProgress,
    [staggerStart, Math.min(staggerEnd, 1)],
    [enableBlur ? blurStrength : 0, 0]
  );

  const filter = useTransform(blurValue, (value) => `blur(${value}px)`);

  return (
    <motion.span
      className="inline-block"
      style={{
        opacity,
        filter: enableBlur ? filter : "none",
        willChange: "opacity, filter"
      }}
    >
      {word}
    </motion.span>
  );
};
