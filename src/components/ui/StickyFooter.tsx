import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
    FacebookIcon,
    FrameIcon,
    InstagramIcon,
    LinkedinIcon,
    YoutubeIcon,
} from 'lucide-react';
import { DitheringShader } from '../three/DitheringShader';
import { NoiseBackground } from './NoiseBackground';
import FlipText from './FlipText';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterLinkGroup {
    label: string;
    links: FooterLink[];
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
    
    return (
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
                        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 flex flex-col justify-between gap-5 py-8 relative z-20">
                            <div className="w-full h-full flex flex-col justify-start items-start gap-16 mt-10 xl:mt-0">
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
                                            {socialLinks.slice(0, 3).map((link, index) => (
                                                <a
                                                    key={link.title}
                                                    href={link.href}
                                                    className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
                                                    title={link.title}
                                                >
                                                    <link.icon className="w-6 h-6 text-white" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedContainer>
                            </div>
                            
                            {/* Texto gigante KAREN ORTIZ con FlipText */}
                            <div 
                                className="karen-ortiz-container text-white cursor-pointer"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <FlipText 
                                    text="KAREN ORTIZ" 
                                    isHovered={isHovered}
                                    className="karen-ortiz-flip-text"
                                />
                            </div>
                            
                            <div className="text-white flex flex-col items-center justify-between gap-2 pt-4 text-body-sm md:flex-row">
                                <p className="text-white">© 2025 Karen Ortiz. Todos los derechos reservados.</p>
                                <p className="text-white">Desarrollado con ❤️</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const socialLinks = [
    { title: 'Facebook', href: '#', icon: FacebookIcon },
    { title: 'Instagram', href: '#', icon: InstagramIcon },
    { title: 'Youtube', href: '#', icon: YoutubeIcon },
    { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
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
            height: 200px;
        }
        
        .karen-ortiz-flip-text {
            font-family: var(--font-display) !important;
            font-size: 15vw !important;
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