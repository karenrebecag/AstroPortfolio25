/**
 * Centralized Motion Animations
 *
 * This file contains reusable animation variants for `motion` components.
 * Consolidating animations here helps maintain consistency and reduces code duplication.
 *
 * @module utils/animations
 */

interface AnimationOptions {
  delay?: number;
  duration?: number;
  y?: number;
  ease?: string;
}

/**
 * Generates a "fade in up" animation variant.
 * @param {AnimationOptions} options - Optional configuration for the animation.
 * @returns A motion variant object.
 */
export const fadeInUp = (options: AnimationOptions = {}) => {
  const { delay = 0, duration = 0.6, y = 30, ease = 'easeOut' } = options;

  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease,
        delay,
      },
    },
  };
};

/**
 * A container variant for staggering the animation of its children.
 */
export const STAGGER_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/**
 * A simple fade-in animation.
 */
export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};
