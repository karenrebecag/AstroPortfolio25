// Shared experience data for Me section
// Used by: Me.astro, ExperienceMarqueeIsland.tsx, ExperienceSlider.tsx

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  description: string;
  highlight: string;
  image: string;
  resumeAnchor?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: "01",
    title: "UX/UI & Frontend Developer",
    company: "OPINATOR (Madrid, Spain)",
    description: "Led the UX/UI redesign of OPINATOR's live forms WebApp, collaborating with a team of five to enhance user experience, accessibility, and developer workflows.",
    highlight: "Designed a modular design system with Figma and implemented frontend with React, boosting form response rates by 30%.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/fe0d8274-c12e-461f-8052-73525d0ecd0d.webp",
    resumeAnchor: "#experience"
  },
  {
    id: "02",
    title: "UX/UI & Webflow Developer",
    company: "AURIN × ANCIENT TECH Partnership",
    description: "Led a collaborative four-month UX engineering project between Aurin and Ancient Tech to design and develop Ancient's main web platform in Webflow, while working directly for Aurin.",
    highlight: "Built an AI-driven interactive hero banner with WebGL animations through this strategic partnership, enhancing engagement and visual appeal.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Ancient.png",
    resumeAnchor: "#experience"
  },
  {
    id: "03",
    title: "Design Engineer & Fullstack Developer",
    company: "AURIN (SODIO) (Cuernavaca, México)",
    description: "Designed mobile and web UX/UI for MonexOne and web apps like Inglesindividual, Galicia MX, Dentol MX, and Fintpay Banking, while leading fullstack development and AI automations.",
    highlight: "Developed Aurin Task Manager with Next.js, Firestore, Clerk, and AI-powered task summaries, streamlining team workflows with temporary dynamic links.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Aurin.jpeg",
    resumeAnchor: "#experience"
  },
  {
    id: "04",
    title: "Senior UX/UI Designer",
    company: "ATHENIS AI (LATAM & EU)",
    description: "Led UX/UI design for an AI-driven educational platform, creating intuitive interfaces and component libraries to enhance user engagement and developer efficiency.",
    highlight: "Crafted a Figma-to-React component library for Login and Dashboard, improving handoff efficiency by 25%.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/AthenisAI.jpeg",
    resumeAnchor: "#experience"
  },
  {
    id: "05",
    title: "Founder & Design Engineer",
    company: "WEBCRAFTERS (Mexico City)",
    description: "Founded WebCrafters, a UX/UI and Web Art agency, delivering custom web applications with AI-driven features, 3D animations, and scalable architectures.",
    highlight: "Led design and deployment of visually stunning web solutions with Three.js and AI integrations, serving diverse industries.",
    image: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/WebCrafters.jpeg",
    resumeAnchor: "#experience"
  }
];
