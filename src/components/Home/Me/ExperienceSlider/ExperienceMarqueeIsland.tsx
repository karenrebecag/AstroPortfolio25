import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ExperienceItem } from '../../../../data/experienceData';

interface ExperienceMarqueeIslandProps {
  experienceData: ExperienceItem[];
  lang: string;
}

// Experience Card Component
const ExperienceCard: React.FC<{ experience: ExperienceItem }> = ({ experience }) => {
  return (
    <div className="experience-card-marquee" draggable="false">
      <div className="experience-header">
        <div className="experience-number">{experience.id}</div>
        <img
          className="experience-image"
          src={experience.image}
          alt={experience.company}
          loading="lazy"
          draggable="false"
        />
      </div>
      <div className="experience-content">
        <div className="experience-title">{experience.title}</div>
        <div className="experience-company">{experience.company}</div>
      </div>
      <div className="experience-description">
        <span className="description-normal">{experience.description}</span>
        <span className="description-highlight">{experience.highlight}</span>
      </div>
    </div>
  );
};

const ExperienceMarqueeIsland: React.FC<ExperienceMarqueeIslandProps> = ({ experienceData }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    if (!wrapperRef.current || !collectionRef.current || !listRef.current) return;

    const initDraggableMarquee = async () => {
      const wrapper = wrapperRef.current!;
      const collection = collectionRef.current!;
      const list = listRef.current!;

      // Import GSAP plugins dynamically
      const [{ Observer }, { ScrollTrigger }] = await Promise.all([
        import('gsap/Observer'),
        import('gsap/ScrollTrigger')
      ]);
      gsap.registerPlugin(Observer, ScrollTrigger);

      // Config values
      const duration = 30;
      const multiplier = 25;
      const sensitivity = 0.008;

      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
      if (!wrapperWidth || !listWidth) return;

      // Clone lists for seamless loop
      const minRequiredWidth = wrapperWidth + listWidth + 100;
      while (collection.scrollWidth < minRequiredWidth) {
        const listClone = list.cloneNode(true) as HTMLElement;
        listClone.setAttribute('data-draggable-marquee-clone', '');
        listClone.setAttribute('aria-hidden', 'true');
        collection.appendChild(listClone);
      }

      const wrapX = gsap.utils.wrap(-listWidth, 0);

      gsap.set(collection, { x: 0 });

      // Create infinite loop animation
      const marqueeLoop = gsap.to(collection, {
        x: -listWidth,
        duration,
        ease: 'none',
        repeat: -1,
        onReverseComplete: () => marqueeLoop.progress(1),
        modifiers: {
          x: (x: string) => wrapX(parseFloat(x)) + 'px'
        }
      });

      // Direction control
      const baseDirection = 1; // left direction
      const timeScale = { value: baseDirection };

      function applyTimeScale(): void {
        marqueeLoop.timeScale(timeScale.value);
        wrapper.setAttribute('data-direction', timeScale.value < 0 ? 'right' : 'left');
      }

      applyTimeScale();

      // Drag observer for interactive control
      const marqueeObserver = Observer.create({
        target: wrapper,
        type: 'pointer,touch',
        preventDefault: true,
        debounce: false,
        onChangeX: (observerEvent: { velocityX: number }) => {
          let velocityTimeScale = observerEvent.velocityX * -sensitivity;
          velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, velocityTimeScale);

          gsap.killTweensOf(timeScale);

          const restingDirection = velocityTimeScale < 0 ? -1 : 1;

          gsap.timeline({ onUpdate: applyTimeScale })
            .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
            .to(timeScale, { value: restingDirection, duration: 1.0 });
        }
      });

      // Pause when out of viewport for performance
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          marqueeLoop.resume();
          applyTimeScale();
          marqueeObserver.enable();
        },
        onEnterBack: () => {
          marqueeLoop.resume();
          applyTimeScale();
          marqueeObserver.enable();
        },
        onLeave: () => {
          marqueeLoop.pause();
          marqueeObserver.disable();
        },
        onLeaveBack: () => {
          marqueeLoop.pause();
          marqueeObserver.disable();
        }
      });

      isInitializedRef.current = true;
    };

    initDraggableMarquee();

    return () => {
      // Cleanup is handled by ScrollTrigger automatically
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="experience-draggable-marquee"
      data-draggable-marquee-init=""
      data-direction="left"
    >
      <div
        ref={collectionRef}
        className="experience-marquee-collection"
        data-draggable-marquee-collection=""
      >
        <div
          ref={listRef}
          className="experience-marquee-list"
          data-draggable-marquee-list=""
        >
          {experienceData.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceMarqueeIsland;
