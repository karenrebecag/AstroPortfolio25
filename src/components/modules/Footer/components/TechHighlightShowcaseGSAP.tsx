import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { techHighlights, type TechHighlightId } from './techHighlights';
import { translations } from '../../../../i18n/translations.js';

// Dynamic import for Observer to avoid ESM/CommonJS issues in Vercel
let Observer: any = null;

type TechHighlightShowcaseGSAPProps = {
    variant: 'dark' | 'light';
    lang?: string;
};

const getHighlightEntry = (lang: string, id: TechHighlightId) => {
    const langHighlights = translations[lang as keyof typeof translations]?.footer?.techHighlights as Record<string, any> | undefined;
    const fallbackHighlights = translations.en.footer?.techHighlights as Record<string, any> | undefined;

    const langEntry = langHighlights?.[id];
    const fallbackEntry = fallbackHighlights?.[id];

    const name = langEntry?.name ?? fallbackEntry?.name ?? id;
    const cursor = langEntry?.cursor ?? fallbackEntry?.cursor ?? name;
    const title = langEntry?.title ?? fallbackEntry?.title ?? name;

    return { name, cursor, title };
};

const getCaption = (lang: string) => {
    const langHighlights = translations[lang as keyof typeof translations]?.footer?.techHighlights as Record<string, any> | undefined;
    const fallbackHighlights = translations.en.footer?.techHighlights as Record<string, any> | undefined;

    return langHighlights?.caption ?? fallbackHighlights?.caption ?? 'This portfolio was crafted with';
};

export function TechHighlightShowcaseGSAP({ variant, lang = 'en' }: TechHighlightShowcaseGSAPProps) {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const observerRef = useRef<any>(null);

    const duplicatedHighlights = React.useMemo(
        () => techHighlights.concat(techHighlights),
        []
    );

    const caption = getCaption(lang);
    const isDark = variant === 'dark';

    useEffect(() => {
        if (!marqueeRef.current) return;

        let isMounted = true;

        // Dynamically load Observer to avoid ESM/CommonJS issues
        const initAnimation = async () => {
            try {
                const { Observer: GSAPObserver } = await import('gsap/Observer');
                
                if (!isMounted || !marqueeRef.current) return;

                // Register GSAP plugin
                gsap.registerPlugin(GSAPObserver);

                const marquee = marqueeRef.current;

                // Calculate total content width
                const contentWidth = marquee.scrollWidth / 2; // Divide by 2 because it's duplicated

                // Create infinite animation with GSAP
                timelineRef.current = gsap.timeline({
                    repeat: -1,
                    defaults: { ease: 'none' }
                });

                // Animate from 0 to -contentWidth (movement to the LEFT) - Very slow speed
                timelineRef.current.to(marquee, {
                    x: -contentWidth,
                    duration: contentWidth / 20, // 20px per second = base speed
                    ease: 'none'
                });

                // Observer for scroll acceleration - Reduced acceleration
                observerRef.current = GSAPObserver.create({
                    onChangeY(self: { deltaY: number }) {
                        if (!timelineRef.current) return;

                        let factor = 1.2; // Reduced acceleration factor

                        if (self.deltaY < 0) {
                            // Scroll up: reduce speed
                            factor *= -0.3;
                        }

                        // Apply temporary acceleration with GSAP - smoother and more gradual
                        gsap.timeline({
                            defaults: { ease: 'none' }
                        })
                            .to(timelineRef.current, { timeScale: factor * 1.3, duration: 0.3, overwrite: true })
                            .to(timelineRef.current, { timeScale: 1, duration: 1.5 }, '+=0.5');
                    }
                });
            } catch (error) {
                console.warn('[TechHighlightShowcaseGSAP] Failed to load Observer:', error);
            }
        };

        initAnimation();

        // Cleanup
        return () => {
            isMounted = false;
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            if (observerRef.current) {
                observerRef.current.kill();
            }
        };
    }, []);

    return (
        <section className="w-full">
            {/* Caption */}
            <p className={`text-xs uppercase tracking-[0.4em] text-center mb-6 font-primary ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {caption}
            </p>

            {/* Marquee - visible en todos los viewports */}
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '2rem' }}>
                <div
                    ref={marqueeRef}
                    className="flex w-max items-center gap-4 px-2"
                    style={{ willChange: 'transform' }}
                >
                    {duplicatedHighlights.map((tech, index) => {
                        const { name, cursor, title } = getHighlightEntry(lang, tech.id);

                        return (
                            <a
                                key={`${tech.id}-${index}`}
                                href={tech.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    group relative flex items-center justify-center
                                    w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                                    rounded-2xl border transition-all duration-300
                                    ${isDark
                                        ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                        : 'border-gray-200 bg-gray-900 hover:border-gray-300 hover:bg-gray-800'
                                    }
                                    backdrop-blur-sm
                                `}
                                data-cursor-text={cursor}
                                aria-label={title}
                                title={title}
                            >
                                <img
                                    src={tech.icon}
                                    alt={`${name} logo`}
                                    className="w-6 h-6 sm:w-7 sm:h-7 brightness-0 invert opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                                    loading="lazy"
                                />
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
