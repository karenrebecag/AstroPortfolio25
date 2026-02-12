import { useEffect, useRef } from 'react';

interface FooterParallaxOptions {
  /** Parallax amount in percentage (default: -25) */
  yPercent?: number;
  /** Whether to include dark overlay effect (default: true) */
  withDarkOverlay?: boolean;
  /** Dark overlay starting opacity (default: 0.5) */
  darkOverlayOpacity?: number;
}

/**
 * Hook for creating a parallax footer effect using GSAP ScrollTrigger
 * Based on Osmo Supply's footer parallax pattern
 *
 * Structure required:
 * <div ref={wrapperRef} data-footer-parallax>
 *   <footer ref={innerRef} data-footer-parallax-inner>
 *     ...content...
 *   </footer>
 *   <div data-footer-parallax-dark />
 * </div>
 */
export function useFooterParallax(options: FooterParallaxOptions = {}) {
  const {
    yPercent = -25,
    withDarkOverlay = true,
    darkOverlayOpacity = 0.5,
  } = options;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    let timeline: gsap.core.Timeline | null = null;
    let scrollTriggerInstance: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

    const initParallax = async () => {
      // Dynamic imports to avoid ESM/CommonJS conflicts
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      scrollTriggerInstance = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // Find elements using data attributes (Osmo pattern)
      const inner = wrapper.querySelector('[data-footer-parallax-inner]');
      const dark = wrapper.querySelector('[data-footer-parallax-dark]');

      if (!inner) return;

      // Create the parallax timeline - exactly as Osmo does it
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: true,
        },
      });

      // Animate the inner content with parallax
      timeline.from(inner, {
        yPercent: yPercent,
        ease: 'linear',
      });

      // Animate the dark overlay if present and enabled
      if (withDarkOverlay && dark) {
        timeline.from(
          dark,
          {
            opacity: darkOverlayOpacity,
            ease: 'linear',
          },
          '<' // Start at the same time as the inner animation
        );
      }
    };

    const currentWrapper = wrapperRef.current;
    initParallax();

    // Cleanup - use captured reference to avoid null ref during unmount
    return () => {
      if (timeline) {
        timeline.kill();
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.getAll().forEach((st) => {
          if (st.trigger === currentWrapper) {
            st.kill();
          }
        });
      }
    };
  }, [yPercent, withDarkOverlay, darkOverlayOpacity]);

  return {
    wrapperRef,
    innerRef,
  };
}

export default useFooterParallax;
