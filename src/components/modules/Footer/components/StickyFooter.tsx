import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
    Instagram,
    Linkedin,
    CircleArrowOutUpRight,
    Link,
    Github,
} from 'lucide-react';
import { DitheringShader } from '../shaders/DitheringShader';
import FlipText from '../../../ui/FlipText';
import { SpeedlifyStats } from '../utils/SpeedlifyStats';
import { useSimpleToast } from '../../Toasts';
import { SpaceInvadersIsland } from '../game/SpaceInvadersIsland';
import { translations } from '../../../../i18n/translations.js';
import { TechHighlightShowcaseGSAP } from './TechHighlightShowcaseGSAP';
import { useFooterParallax } from '../hooks/useFooterParallax';
import css from './StickyFooter.module.css';

// --- Theme config ---
const themes = {
    dark: {
        bg: '#111111',
        overlayBg: 'bg-[#111111]',
        text: 'text-white',
        textSecondary: 'text-white/70',
        textMuted: 'text-white/30',
        textLink: 'text-white/70 hover:text-white',
        textNavDot: 'text-white/30',
        borderStats: 'border-white/10',
        socialBg: 'bg-white/10',
        socialHoverBg: 'hover:bg-white/20',
        socialIconColor: 'text-white',
        statsBtnBg: 'bg-white/10',
        statsArrowColor: 'text-white group-hover:text-white/90',
        shaderColorBack: '#010111',
        shaderColorFront: '#4523AE',
        shaderFilter: 'hue-rotate(12deg) saturate(0.78) brightness(1.4)',
        decorGradient: (opacity: string) => `rgba(255,255,255,${opacity})`,
        decorOpacity: 'opacity-30',
        titleClass: 'text-white',
        followTitleClass: 'text-white',
        followDescClass: 'text-white',
        parallaxOverlayOpacity: 0.5,
    },
    light: {
        bg: '#fdfdfd',
        overlayBg: 'bg-white',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-400',
        textLink: 'text-gray-600 hover:text-gray-900',
        textNavDot: 'text-gray-400',
        borderStats: 'border-gray-200',
        socialBg: 'bg-gray-100',
        socialHoverBg: 'hover:bg-gray-200',
        socialIconColor: 'text-gray-700',
        statsBtnBg: 'bg-gray-100 hover:bg-gray-200',
        statsArrowColor: 'text-gray-700 group-hover:text-gray-600',
        shaderColorBack: '#fdfdfd',
        shaderColorFront: '#f0f0f0',
        shaderFilter: 'hue-rotate(12deg) saturate(0.78) brightness(1.0)',
        decorGradient: (opacity: string) => `rgba(69,35,174,${opacity})`,
        decorOpacity: 'opacity-20',
        titleClass: 'text-gray-900',
        followTitleClass: 'text-gray-900',
        followDescClass: 'text-gray-700',
        parallaxOverlayOpacity: 0.4,
    },
} as const;

// --- Hoisted static styles (fix #7: avoid inline object recreation) ---
const shaderStyle: React.CSSProperties = {
    width: '100%', height: '100%', position: 'absolute', top: 0, left: 0
};

// --- Cached Audio for easter egg (fix #4) ---
let easterEggAudio: HTMLAudioElement | null = null;
function playEasterEggSound() {
    if (typeof window === 'undefined') return;
    if (!easterEggAudio) {
        easterEggAudio = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/gameStart-1.mp3');
        easterEggAudio.volume = 0.4;
    }
    easterEggAudio.currentTime = 0;
    easterEggAudio.play().catch(() => {});
}

// --- Translations helper ---
const getTranslations = (lang: string = 'en') => {
    return translations[lang as keyof typeof translations]?.stickyFooter || translations.en.stickyFooter;
};

// --- Social links data ---
const socialLinksData = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282', icon: Linkedin, delay: 0.2 },
    { title: 'Instagram', href: 'https://www.instagram.com/karenrebeca.og/', icon: Instagram, delay: 0.3 },
    { title: 'GitHub', href: 'https://github.com/karenrebecag', icon: Github, delay: 0.4 },
] as const;

// --- Dribbble icon ---
const DribbbleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
    </svg>
);

// --- AnimatedContainer ---
type AnimatedContainerProps = {
    children?: React.ReactNode;
    delay?: number;
    className?: string;
};

const AnimatedContainer = React.memo(({
    delay = 0.1,
    children,
    className,
}: AnimatedContainerProps) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
});

AnimatedContainer.displayName = 'AnimatedContainer';

// --- Main component ---
type StickyFooterProps = React.ComponentProps<'footer'> & {
    lang?: string;
    variant?: 'dark' | 'light';
};

export function StickyFooter({ className, lang = 'en', variant = 'dark', ...props }: StickyFooterProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showSpaceInvaders, setShowSpaceInvaders] = useState(false);
    const { showSuccess, showError } = useSimpleToast();
    const t = getTranslations(lang);
    const theme = themes[variant];

    // Fix #8: cache split result
    const titleLines = useMemo(() => t.mainTitle.split('\n'), [t.mainTitle]);

    const { wrapperRef, innerRef } = useFooterParallax({
        yPercent: -25,
        withDarkOverlay: true,
        darkOverlayOpacity: theme.parallaxOverlayOpacity,
    });

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showSuccess(t.linkCopied);
        } catch (err) {
            showError(t.copyFailed);
        }
    };

    const activateEasterEgg = () => {
        if (window.innerWidth < 768) return;
        playEasterEggSound();
        setShowSpaceInvaders(true);
    };

    const variantClass = variant === 'dark' ? css.dark : css.light;

    return (
        <>
            <div
                ref={wrapperRef}
                data-footer-parallax
                className={`footer-parallax-wrap relative overflow-hidden ${className || ''}`}
            >
                <footer
                    ref={innerRef as React.RefObject<HTMLElement>}
                    data-footer-parallax-inner
                    className={`${css.gridTexture} relative flex min-h-screen w-full flex-col justify-center items-center gap-5 ${theme.text}`}
                    style={{ backgroundColor: theme.bg }}
                    {...props}
                >
                    {/* DitheringShader Background */}
                    <div className="absolute inset-0 z-0" style={{ filter: theme.shaderFilter, isolation: 'isolate' }}>
                        <DitheringShader
                            width={1920}
                            height={1100}
                            colorBack={theme.shaderColorBack}
                            colorFront={theme.shaderColorFront}
                            shape="wave"
                            type="8x8"
                            pxSize={3}
                            speed={0.6}
                            style={shaderStyle}
                        />
                    </div>

                    {/* Decorative elements */}
                    <div aria-hidden className={`absolute inset-0 z-0 ${theme.decorOpacity}`}>
                        <div className="absolute top-0 left-0 h-80 w-40 rounded-full opacity-10" style={{
                            background: `radial-gradient(circle, ${theme.decorGradient('0.1')} 0%, ${theme.decorGradient('0.02')} 50%, transparent 100%)`,
                            transform: 'translateY(-5rem) rotate(-45deg)'
                        }} />
                        <div className="absolute top-0 left-0 h-80 w-60 rounded-full opacity-10" style={{
                            background: `radial-gradient(circle, ${theme.decorGradient('0.08')} 0%, ${theme.decorGradient('0.01')} 80%, transparent 100%)`,
                            transform: 'translateX(2rem) translateY(-24rem) rotate(-45deg)'
                        }} />
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {showSpaceInvaders ? (
                            <motion.div
                                key="space-invaders"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`${css.contentContainer} w-full max-w-[1200px] mx-auto flex flex-col justify-center items-center py-8 relative overflow-x-hidden`}
                                style={{ zIndex: 50, isolation: 'isolate' }}
                            >
                                <SpaceInvadersIsland onExit={() => setShowSpaceInvaders(false)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="normal-footer"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`${css.contentContainer} w-full max-w-[1200px] mx-auto flex flex-col justify-between gap-5 py-8 relative`}
                                style={{ zIndex: 50, isolation: 'isolate' }}
                            >
                                <div className="w-full flex flex-col justify-start items-start gap-16 mt-10 xl:mt-0">
                                    <AnimatedContainer className="w-full">
                                        {/* Main Title */}
                                        <h2 className={`${theme.titleClass} font-secondary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-16`}>
                                            {titleLines.map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    {index < titleLines.length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </h2>

                                        {/* Follow Me Section */}
                                        <div className="w-full flex flex-col justify-start items-start gap-6">
                                            <div className="w-full flex flex-col justify-start items-start gap-3">
                                                <h3 className={`${theme.followTitleClass} font-primary text-2xl font-semibold leading-tight`}>
                                                    {t.followMe}
                                                </h3>
                                                <p className={`w-full max-w-lg ${theme.followDescClass} font-primary text-lg font-medium leading-relaxed`}>
                                                    {t.followDescription}
                                                </p>
                                            </div>
                                            <div className="flex justify-start items-center gap-6">
                                                {socialLinksData.map(({ title, href, icon: Icon, delay }) => (
                                                    <motion.a
                                                        key={title}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`w-12 h-12 flex items-center justify-center ${theme.socialBg} ${theme.socialHoverBg} rounded-xl transition-all duration-300`}
                                                        title={title}
                                                        data-cursor-text={t.visitSocial.replace('{platform}', title)}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true, margin: "-100px" }}
                                                        transition={{ duration: 0.4, delay, ease: "easeOut" }}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Icon className={`w-6 h-6 ${theme.socialIconColor}`} />
                                                    </motion.a>
                                                ))}

                                                <motion.a
                                                    href="https://dribbble.com/krog11"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-12 h-12 flex items-center justify-center ${theme.socialBg} ${theme.socialHoverBg} rounded-xl transition-all duration-300`}
                                                    title="Dribbble"
                                                    data-cursor-text={t.visitSocial.replace('{platform}', 'Dribbble')}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <DribbbleIcon className={`w-6 h-6 ${theme.socialIconColor}`} />
                                                </motion.a>

                                                <motion.button
                                                    onClick={copyToClipboard}
                                                    className={`w-12 h-12 flex items-center justify-center ${theme.socialBg} ${theme.socialHoverBg} rounded-xl transition-all duration-300`}
                                                    title={t.copyLink}
                                                    data-cursor-text={t.copyLink}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link className={`w-6 h-6 ${theme.socialIconColor}`} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </AnimatedContainer>
                                </div>

                                {/* KAREN ORTIZ FlipText */}
                                <div
                                    className={`${css.karenOrtizContainer} ${variantClass} cursor-pointer`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={activateEasterEgg}
                                    data-cursor-text={t.easterEggHint}
                                >
                                    <FlipText
                                        text="KAREN ORTIZ"
                                        isHovered={isHovered}
                                        className={css.karenOrtizFlipText}
                                    />
                                </div>

                                <div className="w-full relative z-10">
                                    <AnimatedContainer delay={0.25} className="w-full">
                                        <TechHighlightShowcaseGSAP variant={variant} lang={lang} />
                                    </AnimatedContainer>
                                </div>

                                {/* Nav Links */}
                                <div className="flex items-center justify-center gap-8 mt-4 mb-8">
                                    <a
                                        href="/greetings"
                                        className={`${theme.textLink} font-primary text-sm font-medium transition-colors duration-300`}
                                        data-cursor-text={t.greetings}
                                    >
                                        {t.greetings}
                                    </a>
                                    <span className={`${theme.textNavDot} text-sm`}>&bull;</span>
                                    <a
                                        href="/privacy"
                                        className={`${theme.textLink} font-primary text-sm font-medium transition-colors duration-300`}
                                        data-cursor-text={t.privacyPolicy}
                                    >
                                        {t.privacyPolicy}
                                    </a>
                                </div>

                                {/* Performance Stats */}
                                <AnimatedContainer delay={0.4} className="w-full">
                                    <div className={`w-full flex flex-col gap-4 py-16 border-t ${theme.borderStats}`} style={{ paddingTop: '1rem' }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`${theme.text} font-primary text-lg font-semibold`}>
                                                    {t.sitePerformance}
                                                </h3>
                                                <motion.button
                                                    onClick={() => window.open('https://guileless-douhua-b2ff53.netlify.app/karen-ortiz-portfolio/', '_blank')}
                                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${theme.statsBtnBg} transition-all duration-300 group`}
                                                    title={t.viewReportTitle}
                                                    data-cursor-text={t.viewReport}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <CircleArrowOutUpRight className={`w-4 h-4 ${theme.statsArrowColor}`} />
                                                </motion.button>
                                            </div>
                                        </div>
                                        <SpeedlifyStats
                                            className="w-full"
                                            hidePerformance={false}
                                            hideAccessibility={false}
                                            variant={variant}
                                        />
                                    </div>
                                </AnimatedContainer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </footer>
                {/* Overlay for parallax depth */}
                <div
                    data-footer-parallax-dark
                    className={`pointer-events-none absolute inset-0 ${theme.overlayBg}`}
                    style={{ opacity: 0 }}
                    aria-hidden="true"
                />
            </div>
        </>
    );
}

// Backwards-compatible alias
export function WhiteStickyFooter(props: Omit<StickyFooterProps, 'variant'>) {
    return <StickyFooter {...props} variant="light" />;
}
