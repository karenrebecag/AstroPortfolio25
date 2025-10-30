import React from 'react';
import { motion } from 'motion/react';
import { techHighlights, type TechHighlightId } from './techHighlights';
import { translations } from '../../../../i18n/translations.js';

type TechHighlightShowcaseProps = {
    variant: 'dark' | 'light';
    lang?: string;
};

const baseClasses = {
    dark: {
        caption: 'text-xs uppercase tracking-[0.4em] text-white/60 font-primary',
        capsule: 'group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:bg-white/10 sm:h-12 sm:w-12',
    },
    light: {
        caption: 'text-xs uppercase tracking-[0.4em] text-gray-500 font-primary',
        capsule: 'group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-sm transition duration-300 hover:border-gray-300 hover:bg-gray-800 sm:h-12 sm:w-12',
    },
};

const marqueeCapsule = {
    dark: 'group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:bg-white/10',
    light: 'group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-sm transition duration-300 hover:border-gray-300 hover:bg-gray-800',
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

    return (
        <div className="flex w-full flex-col items-center gap-6 text-center">
            <p className={baseClasses[variant].caption}>
                {caption}
            </p>

            <div className="hidden w-full flex-col items-center gap-4 md:flex">
                <div className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-4 sm:gap-5">
                    {techHighlights.map((tech) => {
                        const { name, cursor, title } = getHighlightEntry(lang, tech.id);

                        return (
                            <a
                                key={tech.id}
                                href={tech.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={baseClasses[variant].capsule}
                                data-cursor-text={cursor}
                                aria-label={title}
                                title={title}
                            >
                                <img
                                    src={tech.icon}
                                    alt={`${name} logo`}
                                    className="h-6 w-6 brightness-0 invert opacity-85 transition duration-300 group-hover:opacity-100 sm:h-7 sm:w-7"
                                    loading="lazy"
                                />
                            </a>
                        );
                    })}
                </div>
            </div>

            <div className="relative w-full overflow-hidden md:hidden">
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
                                className={marqueeCapsule[variant]}
                                data-cursor-text={cursor}
                                aria-label={title}
                                title={title}
                            >
                                <img
                                    src={tech.icon}
                                    alt={`${name} logo`}
                                    className="h-6 w-6 brightness-0 invert opacity-85 transition duration-300 group-hover:opacity-100"
                                    loading="lazy"
                                />
                            </a>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
