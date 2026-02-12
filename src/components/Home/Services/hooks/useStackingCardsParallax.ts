import { useEffect, useRef } from 'react';

interface StackingCardsOptions {
  /** Parallax amount in percentage (default: 50) */
  yPercent?: number;
  /** Scale factor for previous card (default: 0.95) */
  scale?: number;
  /** Whether to fade out previous card (default: false) */
  fadeOut?: boolean;
}

/**
 * Hook for creating a stacking cards parallax effect using GSAP ScrollTrigger
 * Based on Osmo Supply's stacking cards pattern
 *
 * Structure required:
 * <div ref={containerRef}>
 *   <div data-stacking-cards-item>...card content...</div>
 *   <div data-stacking-cards-item>...card content...</div>
 * </div>
 */
export function useStackingCardsParallax(options: StackingCardsOptions = {}) {
  const {
    yPercent = 50,
    scale = 0.95,
    fadeOut = false,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scrollTriggers: any[] = [];
    let timelines: gsap.core.Timeline[] = [];

    const initStackingCards = async () => {
      // Dynamic imports to avoid ESM/CommonJS conflicts
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      // Find all card items
      const cards = container.querySelectorAll('[data-stacking-cards-item]');

      if (cards.length < 2) return;

      cards.forEach((card, i) => {
        // Skip the first card - it doesn't need animation
        if (i === 0) return;

        // Target the PREVIOUS card when current section is in view
        const previousCard = cards[i - 1] as HTMLElement;
        if (!previousCard) return;

        // Find optional animated elements inside the previous card
        const previousCardContent = previousCard.querySelector('[data-stacking-cards-content]');

        // Create the parallax timeline
        const tl = gsap.timeline({
          defaults: {
            ease: 'none',
            duration: 1,
          },
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Animate the previous card with parallax and optional scale
        tl.fromTo(
          previousCard,
          { yPercent: 0, scale: 1 },
          { yPercent: yPercent, scale: scale }
        );

        // Optionally fade out the previous card content
        if (fadeOut && previousCardContent) {
          tl.fromTo(
            previousCardContent,
            { opacity: 1 },
            { opacity: 0.3 },
            '<'
          );
        }

        timelines.push(tl);
        if (tl.scrollTrigger) {
          scrollTriggers.push(tl.scrollTrigger);
        }
      });
    };

    initStackingCards();

    // Cleanup
    return () => {
      timelines.forEach((tl) => tl.kill());
      scrollTriggers.forEach((st) => st.kill());
    };
  }, [yPercent, scale, fadeOut]);

  return {
    containerRef,
  };
}

export default useStackingCardsParallax;
