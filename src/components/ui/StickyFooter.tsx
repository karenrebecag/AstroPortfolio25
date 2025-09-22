import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
    FacebookIcon,
    FrameIcon,
    InstagramIcon,
    LinkedinIcon,
    YoutubeIcon,
} from 'lucide-react';
import { DitheringShader } from '../three/DitheringShader';

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
    return (
        <footer
            className={`relative h-[720px] w-full ${className || ''}`}
            style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
            {...props}
        >
            <div className="fixed bottom-0 h-[720px] w-full">
                <div className="sticky top-[calc(100vh-720px)] h-full overflow-y-auto">
                    <div className="footer-grid-texture relative flex h-full w-full flex-col justify-between gap-5 px-4 py-8 md:px-12 text-gray-800" style={{ 
                        backgroundColor: '#e6d9fb',
                        boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.15), 0 -10px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* DitheringShader Background Scene */}
                        <div className="absolute inset-0 z-0" style={{ filter: 'hue-rotate(12deg) saturate(0.78) brightness(1.4)' }}>
                            <DitheringShader
                                width={1920}
                                height={720}
                                colorBack="#e6d9fb"
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
                        <div className="mt-10 flex flex-col gap-8 md:flex-row xl:mt-0 relative z-20">
                            <AnimatedContainer className="w-full max-w-sm space-y-4">
                                <FrameIcon className="h-8 w-8" />
                                <p className="text-gray-600 mt-8 text-body md:mt-4">
                                    Portfolio desarrollado con Astro, React y Tailwind CSS.
                                    Demostrando habilidades en desarrollo frontend moderno y diseño responsivo.
                                </p>
                                <div className="flex gap-2">
                                    {socialLinks.map((link) => (
                                        <Button key={link.title} size="icon" variant="outline" className="h-8 w-8">
                                            <link.icon className="h-4 w-4" />
                                        </Button>
                                    ))}
                                </div>
                            </AnimatedContainer>
                            {footerLinkGroups.map((group, index) => (
                                <AnimatedContainer
                                    key={group.label}
                                    delay={0.1 + index * 0.1}
                                    className="w-full"
                                >
                                    <div className="mb-10 md:mb-0">
                                        <h3 className="text-body-sm uppercase font-semibold text-gray-800">{group.label}</h3>
                                        <ul className="text-gray-600 mt-4 space-y-2 text-body-sm">
                                            {group.links.map((link) => (
                                                <li key={link.title}>
                                                    <a
                                                        href={link.href}
                                                        className="hover:text-gray-900 inline-flex items-center transition-all duration-300"
                                                    >
                                                        {link.icon && <link.icon className="mr-1 h-4 w-4" />}
                                                        {link.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </AnimatedContainer>
                            ))}
                        </div>
                        {/* Texto gigante KAREN ORTIZ */}
                        <div className="karen-ortiz-title relative z-20">KAREN ORTIZ</div>
                        
                        <div className="text-gray-600 flex flex-col items-center justify-between gap-2 pt-4 text-body-sm md:flex-row relative z-20">
                            <p>© 2025 Karen Ortiz. Todos los derechos reservados.</p>
                            <p>Desarrollado con ❤️</p>
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
        .karen-ortiz-title {
            font-family: 'Median', serif;
            font-size: clamp(60px, 30vw, 200px);
            font-weight: 400;
            color: white;
            text-align: center;
            margin: 0;
            text-wrap: nowrap;
            line-height: 0.9;
            letter-spacing: -0.02em;
            width: 100%;
            max-width: 100vw;
            overflow: hidden;
            margin-top: 2rem;
            margin-bottom: 1rem;
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
            .karen-ortiz-title {
                font-size: clamp(40px, 12vw, 120px);
            }
        }
        
        @media (max-width: 480px) {
            .karen-ortiz-title {
                font-size: clamp(30px, 10vw, 80px);
            }
        }
    `;
    document.head.appendChild(style);
}