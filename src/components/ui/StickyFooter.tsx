import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
    InstagramIcon,
    LinkedinIcon,
    CircleArrowOutUpRight,
    Link,
    Github,
} from 'lucide-react';
import { DitheringShader } from '../three/DitheringShader';
import { NoiseBackground } from './NoiseBackground';
import FlipText from './FlipText';
import { SpeedlifyStats } from './SpeedlifyStats';
import Toast from './Toast';
import { SpaceInvadersIsland } from './SpaceInvadersIsland';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterLinkGroup {
    label: string;
    links: FooterLink[];
}

interface ToastData {
    id: string;
    type: 'success' | 'error';
    message: string;
}

type StickyFooterProps = React.ComponentProps<'footer'>;

function Button({ children, size, variant, className, ...props }: {
    children: React.ReactNode;
    size?: 'icon';
    variant?: 'outline';
    className?: string;
} & React.ComponentProps<'button'>) {
    const baseStyles = "inline-flex items-center justify-center rounded border transition-colors";
    const sizeStyles = size === 'icon' ? 'h-8 w-8' : 'px-4 py-2';
    const variantStyles = variant === 'outline' ? 'border-gray-600 bg-transparent text-white hover:bg-gray-800' : '';

    return (
        <button
            className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function StickyFooter({ className, ...props }: StickyFooterProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [showSpaceInvaders, setShowSpaceInvaders] = useState(false);

    const addToast = (type: 'success' | 'error', message: string) => {
        const id = Date.now().toString();
        console.log('Adding toast:', { id, type, message }); // Debug log
        setToasts(prev => {
            const newToasts = [...prev, { id, type, message }];
            console.log('New toasts array:', newToasts); // Debug log
            return newToasts;
        });
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    const copyToClipboard = async () => {
        try {
            const url = window.location.href;
            console.log('Attempting to copy:', url); // Debug log
            await navigator.clipboard.writeText(url);
            console.log('Copy successful, adding toast'); // Debug log
            addToast('success', 'Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy link:', err);
            addToast('error', 'Failed to copy link. Please try again.');
        }
    };

    const activateEasterEgg = () => {
        if (window.innerWidth < 768) return;
        // Play game start sound from Cloudflare R2 CDN
        const gameStartSound = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/gameStart-1.mp3');
        gameStartSound.volume = 0.4;
        gameStartSound.play().catch(e => console.log('Audio play failed:', e));

        setShowSpaceInvaders(true);
    };

    const exitSpaceInvaders = () => {
        setShowSpaceInvaders(false);
    };
    
    return (
        <>
            <footer
            className={`relative h-[720px] w-full ${className || ''}`}
            style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
            {...props}
        >
            <div className="fixed bottom-0 h-[720px] w-full">
                <div className="sticky top-[calc(100vh-720px)] h-full overflow-y-auto">
                    <div className="footer-grid-texture relative flex h-full w-full flex-col justify-center items-center gap-5 text-white" style={{ 
                        backgroundColor: '#111111',
                        boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.15), 0 -10px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* Noise Background Effect */}
                        <div className="absolute inset-0 z-0">
                            <NoiseBackground opacity={0.06} speed={0.15} className="dark" />
                        </div>
                        
                        {/* DitheringShader Background Scene */}
                        <div className="absolute inset-0 z-0" style={{ filter: 'hue-rotate(12deg) saturate(0.78) brightness(1.4)' }}>
                            <DitheringShader
                                width={1920}
                                height={720}
                                colorBack="#010111"
                                colorFront="#4523AE"
                                shape="wave"
                                type="8x8"
                                pxSize={3}
                                speed={0.6}
                            />
                        </div>
                        
                        {/* Fallback decorative elements (mantener como backup) */}
                        <div
                            aria-hidden
                            className="absolute inset-0 z-0 opacity-30"
                        >
                            <div className="absolute top-0 left-0 h-80 w-40 rounded-full opacity-10" style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
                                transform: 'translateY(-5rem) rotate(-45deg)'
                            }} />
                            <div className="absolute top-0 left-0 h-80 w-60 rounded-full opacity-10" style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 80%, transparent 100%)',
                                transform: 'translateX(2rem) translateY(-24rem) rotate(-45deg)'
                            }} />
                        </div>

                        {/* Footer Content Container with max-width - Centered */}
                        <AnimatePresence mode="wait">
                            {showSpaceInvaders ? (
                                <motion.div
                                    key="space-invaders"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col justify-center items-center py-8 relative z-20 overflow-x-hidden"
                                >
                                    <SpaceInvadersIsland onExit={exitSpaceInvaders} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="normal-footer"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col justify-between gap-5 py-8 relative z-20"
                                >
                            <div className="w-full  flex flex-col justify-start items-start gap-16 mt-10 xl:mt-0">
                                <AnimatedContainer className="w-full">
                                    {/* Main Title */}
                                    <h2 className="text-white font-secondary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-16" >
                                        Let's make Something<br />Extraordinary, together.
                                    </h2>
                                    
                                    {/* Follow Me Section */}
                                    <div className="w-full flex flex-col justify-start items-start gap-6" >
                                        <div className="w-full flex flex-col justify-start items-start gap-3">
                                            <h3 className="text-white font-primary text-2xl font-semibold leading-tight">
                                                Follow Me
                                            </h3>
                                            <p className="w-full max-w-lg text-white font-primary text-lg font-medium leading-relaxed">
                                                Stay connected and inspired! Follow us on our social media platforms to keep up with the latest design trends, project updates, and behind-the-scenes insights
                                            </p>
                                        </div>
                                        <div className="flex justify-start items-center gap-6">
                                            {socialLinks.map((link, index) => (
                                                <a
                                                    key={link.title}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
                                                    title={link.title}
                                                    data-cursor-text={`Visit ${link.title}`}
                                                >
                                                    <link.icon className="w-6 h-6 text-white" />
                                                </a>
                                            ))}
                                            <button
                                                onClick={copyToClipboard}
                                                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
                                                title="Copy Link"
                                                data-cursor-text="Copy Link"
                                            >
                                                <Link className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </AnimatedContainer>
                            </div>
                            
                            {/* Texto gigante KAREN ORTIZ con FlipText */}
                            <div 
                                className="karen-ortiz-container text-white cursor-pointer"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={activateEasterEgg}
                                data-cursor-text="Hm? Somebody said 80s?"
                            >
                                <FlipText 
                                    text="KAREN ORTIZ" 
                                    isHovered={isHovered}
                                    className="karen-ortiz-flip-text"
                                />
                            </div>
                            
                            {/* Performance Stats Section */}
                            <AnimatedContainer delay={0.4} className="w-full">
                                <div className="w-full flex flex-col gap-4 py-10 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-white font-primary text-lg font-semibold">
                                                Site Performance
                                            </h3>
                                            <button
                                                onClick={() => window.open('https://guileless-douhua-b2ff53.netlify.app/karen-ortiz-portfolio/', '_blank')}
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                                                title="View detailed performance report"
                                                data-cursor-text="View Report"
                                            >
                                                <CircleArrowOutUpRight className="w-4 h-4 text-white group-hover:text-white/90" />
                                            </button>
                                        </div>
                                        <span className="text-white/50 text-sm font-primary">
                                            Powered by Speedlify
                                        </span>
                                    </div>
                                    <SpeedlifyStats className="w-full" />
                                </div>
                            </AnimatedContainer>
               
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            </footer>

            {/* Toast Container */}
            <div 
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'none'
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                            <Toast
                                id={toast.id}
                                type={toast.type}
                                message={toast.message}
                                onClose={removeToast}
                                duration={3000}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}

// Icono personalizado para Dribbble
const DribbbleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
    </svg>
);

const socialLinks = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-rebeca-ortiz-b5a860282', icon: LinkedinIcon },
    { title: 'Instagram', href: 'https://www.instagram.com/karenrebeca.og/', icon: InstagramIcon },
    { title: 'GitHub', href: 'https://github.com/karenrebecag', icon: Github },
    { title: 'Dribbble', href: 'https://dribbble.com/krog11', icon: DribbbleIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
    {
        label: 'Proyectos',
        links: [
            { title: 'Web Development', href: '#' },
            { title: 'Mobile Apps', href: '#' },
            { title: 'UI/UX Design', href: '#' },
            { title: 'Frontend', href: '#' },
            { title: 'Backend', href: '#' },
            { title: 'Full Stack', href: '#' },
        ],
    },
    {
        label: 'Tecnologías',
        links: [
            { title: 'React', href: '#' },
            { title: 'Astro', href: '#' },
            { title: 'TypeScript', href: '#' },
            { title: 'Node.js', href: '#' },
            { title: 'Tailwind CSS', href: '#' },
            { title: 'Motion', href: '#' },
        ],
    },
    {
        label: 'Recursos',
        links: [
            { title: 'Blog', href: '#' },
            { title: 'Caso de Estudio', href: '#' },
            { title: 'Documentación', href: '#' },
            { title: 'Tutoriales', href: '#' },
            { title: 'Herramientas', href: '#' },
        ],
    },
    {
        label: 'Contacto',
        links: [
            { title: 'Sobre Mí', href: '#' },
            { title: 'Contacto', href: '#' },
            { title: 'CV/Resume', href: '#' },
            { title: 'Colaboraciones', href: '#' },
            { title: 'Freelance', href: '#' },
        ],
    },
];

type AnimatedContainerProps = {
    children?: React.ReactNode;
    delay?: number;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function AnimatedContainer({
    delay = 0.1,
    children,
    className,
    ...props
}: AnimatedContainerProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className} {...props}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Añadir estilos globales para el texto gigante y textura de grid
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .karen-ortiz-container {
            text-align: center;
            margin: 2rem 0 1rem 0;
            width: 100%;
            max-width: 100vw;
            overflow: hidden;
            height: auto;
            min-height: fit-content;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .karen-ortiz-flip-text {
            font-family: var(--font-display) !important;
            font-size: 10.5vw !important;
            font-weight: 400 !important;
            color: white !important;
            text-align: center !important;
            line-height: 0.9 !important;
            letter-spacing: -0.02em !important;
            text-transform: uppercase !important;
        }
        
        .karen-ortiz-flip-text .flip-text-container {
            font-family: var(--font-display) !important;
            font-size: clamp(60px, 30vw, 200px) !important;
            font-weight: 400 !important;
            color: white !important;
            text-align: center !important;
            line-height: 0.9 !important;
            letter-spacing: -0.02em !important;
            justify-content: center !important;
            display: flex !important;
            height: auto !important;
            min-height: fit-content !important;
        }
        
        .footer-grid-texture::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            z-index: 1;
        }
        
        @media (max-width: 768px) {
            .karen-ortiz-flip-text {
                font-size: clamp(40px, 12vw, 120px) !important;
            }
            
            .karen-ortiz-flip-text .flip-text-container {
                font-size: clamp(40px, 12vw, 120px) !important;
            }
        }
        
        @media (max-width: 480px) {
            .karen-ortiz-flip-text {
                font-size: clamp(30px, 10vw, 80px) !important;
            }
            
            .karen-ortiz-flip-text .flip-text-container {
                font-size: clamp(30px, 10vw, 80px) !important;
            }
        }
    `;
    document.head.appendChild(style);
}