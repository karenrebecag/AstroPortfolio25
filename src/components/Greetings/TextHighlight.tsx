import React from 'react';
import { motion, useInView } from 'motion/react';

interface TextHighlightProps {
  children: React.ReactNode;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({ children }) => {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.mark
      ref={ref}
      className="text-highlight"
      initial={{ backgroundSize: '0% 100%' }}
      animate={isInView ? { backgroundSize: '100% 100%' } : { backgroundSize: '0% 100%' }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.mark>
  );
};
