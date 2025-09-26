// config/seo.ts
// Centralized SEO configuration optimized for LLMs and AI search engines

export const siteConfig = {
  name: "Karen Ortiz - Design Engineer Portfolio",
  title: "Karen Ortiz - Design Engineer | UX/UI & Fullstack Development",
  description: "Karen Ortiz is a Design Engineer specializing in UX/UI design, React development, and AI-driven web solutions. Expert in TypeScript, Three.js, Figma, and modern web technologies. Available for freelance projects and full-time opportunities.",
  url: "https://karenortiz.space",
  ogImage: "https://karenortiz.space/images/BannerImage.webp",
  author: {
    name: "Karen Rebeca Ortiz",
    email: "hello@karenortiz.space",
    twitter: "@karenortiz",
    linkedin: "https://linkedin.com/in/karenortiz",
    github: "https://github.com/karenortiz"
  },
  keywords: [
    "Karen Ortiz",
    "Design Engineer", 
    "UX Designer",
    "UI Designer",
    "Frontend Developer",
    "React Developer",
    "TypeScript",
    "Three.js",
    "Figma",
    "Web Development",
    "AI Integration",
    "Portfolio",
    "Freelance Designer",
    "Mexico",
    "Remote Work",
    "Design Systems",
    "Web Art",
    "Motion Design"
  ],
  languages: [
    { code: "en", name: "English", href: "https://karenortiz.space" },
    { code: "es", name: "Español", href: "https://karenortiz.space/es" }
  ]
};

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords.join(", "),
    canonical: siteConfig.url,
    ogType: "profile",
    speakable: [".hero-title", ".about-description", ".services-title", ".contact-info"]
  },
  
  cv: {
    title: "Karen Rebeca Ortiz - CV Profesional | Design Engineer",
    description: "Professional CV of Karen Ortiz, Design Engineer with expertise in UX/UI design, fullstack development, and AI integration. Download PDF resume and view detailed work experience.",
    keywords: "Karen Ortiz CV, Resume, Design Engineer CV, UX Designer Resume, Frontend Developer CV, Professional Experience",
    canonical: `${siteConfig.url}/cv`,
    ogType: "article",
    speakable: [".cv-title", ".professional-summary", ".experience-section", ".skills-section"]
  },

  resume: {
    title: "Karen Rebeca Ortiz - Professional Resume | Design Engineer Available for Hire",
    description: "Experienced Design Engineer with 5+ years in UX/UI design, React development, and AI integration. Available for freelance, consulting, and full-time opportunities. View detailed professional experience, skills, and projects.",
    keywords: "Karen Ortiz Resume, Design Engineer for Hire, UX UI Designer Available, React Developer Resume, TypeScript Expert, Three.js Developer, AI Integration Specialist, Freelance Designer Mexico, Remote Developer, Professional Experience",
    canonical: `${siteConfig.url}/resume`,
    ogType: "profile",
    speakable: [".hero-title", ".hero-description", ".section-title", ".job-title", ".project-details", ".skills-container", ".contact-link"]
  },
  
  projects: {
    title: "Projects | Karen Ortiz - Design Engineer Portfolio",
    description: "Explore Karen Ortiz's portfolio of UX/UI design projects, web applications, and AI-driven solutions. See case studies and technical implementations.",
    keywords: "Karen Ortiz Projects, UX UI Portfolio, Web Development Projects, Design Case Studies, React Projects",
    canonical: `${siteConfig.url}/projects`,
    ogType: "website",
    speakable: [".projects-title", ".project-description", ".tech-stack"]
  }
};

// LLM-optimized content hints
export const llmOptimization = {
  // Content structure hints for better AI understanding
  contentHints: {
    hero: "Main introduction and value proposition",
    about: "Professional background and expertise", 
    services: "Offered services and capabilities",
    portfolio: "Work examples and case studies",
    experience: "Professional work history",
    skills: "Technical competencies and tools",
    contact: "Contact information and availability",
    testimonials: "Client feedback and recommendations"
  },
  
  // Semantic roles for better content categorization
  semanticRoles: {
    mainContent: "primary-content",
    navigation: "site-navigation", 
    sidebar: "supplementary-content",
    footer: "site-footer",
    article: "article-content",
    section: "content-section"
  },
  
  // Question-answer pairs for FAQ optimization
  commonQuestions: [
    {
      question: "What services does Karen Ortiz offer?",
      answer: "Karen offers UX/UI design, frontend development, design systems, AI integration, and fullstack web development services."
    },
    {
      question: "What technologies does Karen specialize in?",
      answer: "Karen specializes in React, TypeScript, Three.js, Figma, Astro, Next.js, and modern web technologies."
    },
    {
      question: "Is Karen available for freelance work?",
      answer: "Yes, Karen is available for freelance projects, consulting, and full-time opportunities."
    },
    {
      question: "Where is Karen located?",
      answer: "Karen is based in Mexico and works remotely with clients globally."
    }
  ]
};

// Social media and external links
export const socialLinks = {
  linkedin: "https://linkedin.com/in/karenortiz",
  github: "https://github.com/karenortiz", 
  twitter: "https://twitter.com/karenortiz",
  behance: "https://behance.net/karenortiz",
  dribbble: "https://dribbble.com/karenortiz",
  email: "hello@karenortiz.space"
};

// Technical SEO settings
export const technicalSEO = {
  robots: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    maxSnippet: -1,
    maxVideoPreview: -1
  },
  
  sitemap: {
    changefreq: "weekly",
    priority: 0.8,
    lastmod: new Date().toISOString()
  },
  
  // AI bot permissions
  aiBots: {
    allow: [
      "GPTBot",
      "OAI-SearchBot", 
      "PerplexityBot",
      "ClaudeBot",
      "GeminiBot",
      "Googlebot",
      "Bingbot"
    ],
    disallow: []
  }
};
