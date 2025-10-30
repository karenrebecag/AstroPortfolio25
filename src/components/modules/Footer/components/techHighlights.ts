export type TechHighlight = {
    name: string;
    href: string;
    icon: string;
    cursorText: string;
    title?: string;
};

export const techHighlights: TechHighlight[] = [
    {
        name: 'Claude',
        href: 'https://claude.ai',
        icon: '/Icons/claude.svg',
        cursorText: 'Claude · AI assistance',
    },
    {
        name: 'Perplexity',
        href: 'https://www.perplexity.ai',
        icon: '/Icons/perplexity-color.svg',
        cursorText: 'Perplexity · Research copilot',
    },
    {
        name: 'Cloudflare',
        href: 'https://www.cloudflare.com',
        icon: '/Icons/Cloudflare.svg',
        cursorText: 'Cloudflare · Storage & protection',
    },
    {
        name: 'Firestore',
        href: 'https://firebase.google.com/products/firestore',
        icon: '/Icons/Firebase.svg',
        cursorText: 'Firestore · Realtime database',
        title: 'Firebase Firestore',
    },
    {
        name: 'Vercel',
        href: 'https://vercel.com',
        icon: '/Icons/Vercel.svg',
        cursorText: 'Vercel · Deployment & edge',
    },
    {
        name: 'Payload CMS',
        href: 'https://payloadcms.com',
        icon: '/Icons/PayloadIconWhite.svg',
        cursorText: 'Payload · Headless CMS',
        title: 'Payload CMS',
    },
    {
        name: 'Astro',
        href: 'https://astro.build',
        icon: '/Icons/Astro.svg',
        cursorText: 'Astro · Frontend framework',
    },
    {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com',
        icon: '/Icons/Tailwind CSS.svg',
        cursorText: 'Tailwind · Design system',
    },
    {
        name: 'React',
        href: 'https://react.dev',
        icon: '/Icons/React.svg',
        cursorText: 'React · Interactive UI',
    },
    {
        name: 'TypeScript',
        href: 'https://www.typescriptlang.org',
        icon: '/Icons/Typescript.svg',
        cursorText: 'TypeScript · Typed DX',
    },
    {
        name: 'Zustand',
        href: 'https://zustand-demo.pmnd.rs',
        icon: '/Icons/Zustand.svg',
        cursorText: 'Zustand · Global state',
    },
    {
        name: 'Three.js',
        href: 'https://threejs.org',
        icon: '/Icons/Three.js.svg',
        cursorText: 'Three.js · Interactive 3D',
    },
    {
        name: 'GSAP',
        href: 'https://gsap.com',
        icon: '/Icons/gsap-white.svg',
        cursorText: 'GSAP · Motion design',
        title: 'GSAP',
    },
    {
        name: 'Blender',
        href: 'https://www.blender.org',
        icon: '/Icons/Blender.svg',
        cursorText: 'Blender · 3D modeling',
    },
    {
        name: 'Figma',
        href: 'https://www.figma.com',
        icon: '/Icons/Figma.svg',
        cursorText: 'Figma · UI design',
    },
    {
        name: 'Windsurf',
        href: 'https://codeium.com/windsurf',
        icon: '/Icons/windsurf.svg',
        cursorText: 'Windsurf · Primary IDE',
    },
    {
        name: 'Resend',
        href: 'https://resend.com',
        icon: '/Icons/Resend.svg',
        cursorText: 'Resend · Transactional email',
    },
];
