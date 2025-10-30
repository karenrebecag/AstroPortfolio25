export type TechHighlightId =
    | 'astro'
    | 'react'
    | 'typescript'
    | 'zustand'
    | 'tailwind'
    | 'gsap'
    | 'threejs'
    | 'blender'
    | 'figma'
    | 'payload'
    | 'resend'
    | 'firestore'
    | 'cloudflare'
    | 'vercel'
    | 'windsurf'
    | 'claude'
    | 'perplexity';

export type TechHighlight = {
    id: TechHighlightId;
    href: string;
    icon: string;
};

export const techHighlights: TechHighlight[] = [
    {
        id: 'astro',
        href: 'https://astro.build',
        icon: '/Icons/Astro.svg',
    },
    {
        id: 'react',
        href: 'https://react.dev',
        icon: '/Icons/React.svg',
    },
    {
        id: 'typescript',
        href: 'https://www.typescriptlang.org',
        icon: '/Icons/Typescript.svg',
    },
    {
        id: 'zustand',
        href: 'https://zustand-demo.pmnd.rs',
        icon: '/Icons/Zustand.svg',
    },
    {
        id: 'tailwind',
        href: 'https://tailwindcss.com',
        icon: '/Icons/Tailwind CSS.svg',
    },
    {
        id: 'gsap',
        href: 'https://gsap.com',
        icon: '/Icons/gsap-white.svg',
    },
    {
        id: 'threejs',
        href: 'https://threejs.org',
        icon: '/Icons/Three.js.svg',
    },
    {
        id: 'blender',
        href: 'https://www.blender.org',
        icon: '/Icons/Blender.svg',
    },
    {
        id: 'figma',
        href: 'https://www.figma.com',
        icon: '/Icons/Figma.svg',
    },
    {
        id: 'payload',
        href: 'https://payloadcms.com',
        icon: '/Icons/PayloadIconWhite.svg',
    },
    {
        id: 'resend',
        href: 'https://resend.com',
        icon: '/Icons/Resend.svg',
    },
    {
        id: 'firestore',
        href: 'https://firebase.google.com/products/firestore',
        icon: '/Icons/Firebase.svg',
    },
    {
        id: 'cloudflare',
        href: 'https://www.cloudflare.com',
        icon: '/Icons/Cloudflare.svg',
    },
    {
        id: 'vercel',
        href: 'https://vercel.com',
        icon: '/Icons/Vercel.svg',
    },
    {
        id: 'windsurf',
        href: 'https://codeium.com/windsurf',
        icon: '/Icons/windsurf.svg',
    },
    {
        id: 'claude',
        href: 'https://claude.ai',
        icon: '/Icons/claude.svg',
    },
    {
        id: 'perplexity',
        href: 'https://www.perplexity.ai',
        icon: '/Icons/perplexity-color.svg',
    },
];
