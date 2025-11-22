import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { techHighlights, type TechHighlightId } from './techHighlights';
import { translations } from '../../../../i18n/translations.js';

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

        // Registrar plugin de GSAP
        gsap.registerPlugin(Observer);

        const marquee = marqueeRef.current;

        // Calcular el ancho total del contenido
        const contentWidth = marquee.scrollWidth / 2; // Dividimos entre 2 porque está duplicado

        // Crear animación infinita con GSAP
        timelineRef.current = gsap.timeline({
            repeat: -1,
            defaults: { ease: 'none' }
        });

        // Animar de 0 a -contentWidth (movimiento hacia la IZQUIERDA) - Velocidad MUY lenta
        timelineRef.current.to(marquee, {
            x: -contentWidth,
            duration: contentWidth / 20, // 20px por segundo = velocidad base (mucho más lento que 60px)
            ease: 'none'
        });

        // Observer para aceleración en scroll - Aceleración reducida
        observerRef.current = Observer.create({
            onChangeY(self) {
                if (!timelineRef.current) return;

                let factor = 1.2; // Factor de aceleración reducido (antes era 1.5)

                if (self.deltaY < 0) {
                    // Scroll hacia arriba: reducir velocidad
                    factor *= -0.3;
                }

                // Aplicar aceleración temporal con GSAP - más suave y gradual
                gsap.timeline({
                    defaults: { ease: 'none' }
                })
                    .to(timelineRef.current, { timeScale: factor * 1.3, duration: 0.3, overwrite: true }) // factor reducido de 2x a 1.3x
                    .to(timelineRef.current, { timeScale: 1, duration: 1.5 }, '+=0.5'); // Retorno más suave y lento
            }
        });

        // Cleanup
        return () => {
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
