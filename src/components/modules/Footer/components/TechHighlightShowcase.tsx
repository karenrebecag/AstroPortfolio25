import React from 'react';
import { motion } from 'motion/react';
import { techHighlights, type TechHighlightId } from './techHighlights';
import { translations } from '../../../../i18n/translations.js';

type TechHighlightShowcaseProps = {
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

export function TechHighlightShowcase({ variant, lang = 'en' }: TechHighlightShowcaseProps) {
    const duplicatedHighlights = React.useMemo(
        () => techHighlights.concat(techHighlights),
        []
    );

    const caption = getCaption(lang);

    const isDark = variant === 'dark';

    return (
        <section className="w-full">
            {/* Caption */}
            <p className={`text-xs uppercase tracking-[0.4em] text-center mb-6 font-primary ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                {caption}
            </p>

            {/* Marquee - visible en todos los viewports */}
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '2rem' }}>
                <motion.div
                    className="flex w-max items-center gap-4 px-2"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
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
                </motion.div>
            </div>
        </section>
    );
}
