import gsap from 'gsap';

/** Tracked instance for cleanup */
interface MarqueeInstance {
  animation: gsap.core.Tween;
  scrollTriggers: any[];
  timeline: gsap.core.Timeline;
  clonedNodes: Node[];
}

const activeInstances: MarqueeInstance[] = [];

/**
 * Initialize a GSAP-powered marquee with scroll direction inversion.
 * Works with any element that has `data-marquee-*` attributes.
 * Can be called with an element ID (Banner) or a direct HTMLElement (TechMarquees).
 */
export async function initMarqueeAdvanced(target: string | HTMLElement) {
  const marquee = typeof target === 'string' ? document.getElementById(target) : target;
  if (!marquee) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
  const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
  if (!marqueeContent || !marqueeScroll) return;

  // Dynamically import ScrollTrigger to avoid ESM/CommonJS issues
  let ScrollTrigger: any;
  try {
    const module = await import('gsap/ScrollTrigger');
    ScrollTrigger = module.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  } catch (error) {
    console.warn(`[initMarquee] Failed to load ScrollTrigger:`, error);
    return;
  }

  // Read data attributes
  const speed = marquee.dataset.marqueeSpeed || '15';
  const direction = marquee.dataset.marqueeDirection || 'left';
  const duplicate = marquee.dataset.marqueeDuplicate || '2';
  const scrollSpeed = marquee.dataset.marqueeScrollSpeed || '10';

  const marqueeSpeedAttr = parseFloat(speed);
  const marqueeDirectionAttr = direction === 'right' ? 1 : -1;
  const duplicateAmount = parseInt(duplicate);
  const scrollSpeedAttr = parseFloat(scrollSpeed);
  const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

  const marqueeSpeed = marqueeSpeedAttr * ((marqueeContent as HTMLElement).offsetWidth / window.innerWidth) * speedMultiplier;

  // Set scroll container dimensions
  (marqueeScroll as HTMLElement).style.marginLeft = `${scrollSpeedAttr * -1}%`;
  (marqueeScroll as HTMLElement).style.width = `${(scrollSpeedAttr * 2) + 100}%`;

  // Duplicate marquee content using DocumentFragment
  const clonedNodes: Node[] = [];
  if (duplicateAmount > 0) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < duplicateAmount; i++) {
      const clone = marqueeContent.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      fragment.appendChild(clone);
      clonedNodes.push(clone);
    }
    marqueeScroll.appendChild(fragment);
  }

  // GSAP animation for marquee content
  const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
  const animation = gsap.to(marqueeItems, {
    xPercent: -100,
    repeat: -1,
    duration: marqueeSpeed || 20,
    ease: 'linear'
  }).totalProgress(0.5);

  gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
  animation.timeScale(marqueeDirectionAttr);
  animation.play();

  marquee.setAttribute('data-marquee-status', 'normal');

  // ScrollTrigger for direction inversion
  const directionTrigger = ScrollTrigger.create({
    trigger: marquee,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self: { direction: number }) => {
      const isInverted = self.direction === 1;
      const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
      animation.timeScale(currentDirection);
      marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
    }
  });

  // Parallax scrub timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: marquee,
      start: '0% 100%',
      end: '100% 0%',
      scrub: 0
    }
  });

  const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
  tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${-scrollStart}vw`, ease: 'none' });

  // Track for cleanup
  activeInstances.push({
    animation,
    scrollTriggers: [directionTrigger, tl.scrollTrigger],
    timeline: tl,
    clonedNodes
  });
}

/** Kill all marquee GSAP instances and remove cloned DOM nodes */
export function cleanupMarquees() {
  for (const instance of activeInstances) {
    instance.animation.kill();
    instance.timeline.kill();
    for (const st of instance.scrollTriggers) {
      if (st) st.kill();
    }
    // Remove cloned nodes from DOM
    for (const node of instance.clonedNodes) {
      node.parentNode?.removeChild(node);
    }
  }
  activeInstances.length = 0;
}
