// config/seo.ts
// Centralized SEO configuration optimized for LLMs and AI search engines

export const siteConfig = {
  name: "Karen Rebeca Ortiz - Design Engineer Portfolio",
  title: "Karen Rebeca Ortiz - Design Engineer | UX/UI & Fullstack Development",
  description: "Karen Rebeca Ortiz is a passionate Design Engineer who bridges creativity and technology. Specializing in UX/UI design, React development, and AI-driven web solutions with expertise in TypeScript, Three.js, and modern web technologies. Transforming ideas into exceptional digital experiences.",
  url: "https://karenortiz.space",
  ogImage: "https://pub-2e7dc04d482146c59f472ab28fba09a9.r2.dev/MePortfolio.png",
  author: {
    name: "Karen Rebeca Ortiz",
    email: "hello@karenortiz.space",
    twitter: "@karenortiz",
    linkedin: "https://linkedin.com/in/karenortiz",
    github: "https://github.com/karenortiz"
  },
  keywords: [
    "Karen Rebeca Ortiz",
    "Karen Ortiz",
    "Design Engineer", 
    "UX/UI Designer",
    "Frontend Developer",
    "React Developer",
    "TypeScript Expert",
    "Three.js Developer",
    "Figma Specialist",
    "Web Development",
    "AI Integration",
    "Creative Technology",
    "Digital Experiences",
    "Interactive Design",
    "Freelance Designer",
    "Mexico Designer",
    "Remote Developer",
    "Design Systems",
    "Web Art",
    "Motion Design",
    "WebGL",
    "Next.js",
    "Astro"
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
    description: "Professional CV of Karen Rebeca Ortiz, passionate Design Engineer bridging creativity and technology. Expertise in UX/UI design, fullstack development, and AI integration. Download comprehensive resume showcasing transformative digital experiences.",
    keywords: "Karen Rebeca Ortiz CV, Karen Ortiz Resume, Design Engineer CV, UX Designer Resume, Frontend Developer CV, Creative Technology, Professional Experience",
    canonical: `${siteConfig.url}/cv`,
    ogType: "article",
    speakable: [".cv-title", ".professional-summary", ".experience-section", ".skills-section"]
  },

  resume: {
    title: "Karen Rebeca Ortiz - Professional Resume | Design Engineer Available for Hire",
    description: "Experienced Design Engineer Karen Rebeca Ortiz with 5+ years transforming ideas into exceptional digital experiences. Specializing in UX/UI design, React development, and AI integration. Available for freelance, consulting, and full-time opportunities worldwide.",
    keywords: "Karen Rebeca Ortiz Resume, Karen Ortiz for Hire, Design Engineer Available, UX UI Designer, React Developer, TypeScript Expert, Three.js Developer, AI Integration Specialist, Creative Technology, Freelance Designer Mexico, Remote Developer",
    canonical: `${siteConfig.url}/resume`,
    ogType: "profile",
    speakable: [".hero-title", ".hero-description", ".section-title", ".job-title", ".project-details", ".skills-container", ".contact-link"]
  },
  
  projects: {
    title: "Projects | Karen Rebeca Ortiz - Design Engineer Portfolio",
    description: "Explore Karen Rebeca Ortiz's exceptional portfolio showcasing transformative digital experiences. Discover innovative UX/UI design projects, interactive web applications, and AI-driven solutions with detailed case studies and technical implementations.",
    keywords: "Karen Rebeca Ortiz Projects, Karen Ortiz Portfolio, UX UI Portfolio, Web Development Projects, Design Case Studies, React Projects, Interactive Design, Creative Technology, Digital Experiences",
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
      question: "What services does Karen Rebeca Ortiz offer?",
      answer: "Karen Rebeca Ortiz offers comprehensive design engineering services including UX/UI design, frontend development, design systems, AI integration, interactive web experiences, and fullstack web development solutions."
    },
    {
      question: "What technologies does Karen Rebeca Ortiz specialize in?",
      answer: "Karen specializes in React, TypeScript, Three.js, WebGL, Figma, Astro, Next.js, and cutting-edge web technologies for creating exceptional digital experiences."
    },
    {
      question: "Is Karen Rebeca Ortiz available for freelance work?",
      answer: "Yes, Karen Rebeca Ortiz is available for freelance projects, consulting, and full-time opportunities worldwide, bringing creativity and technology together."
    },
    {
      question: "Where is Karen Rebeca Ortiz located?",
      answer: "Karen Rebeca Ortiz is based in Mexico and works remotely with clients globally, delivering transformative digital experiences across different time zones."
    },
    {
      question: "What makes Karen Rebeca Ortiz unique as a Design Engineer?",
      answer: "Karen bridges creativity and technology, transforming ideas into exceptional digital experiences with expertise in both design and development, ensuring seamless user experiences."
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
  
  // AI bot permissions - Updated based on 2024/2025 crawler activity data
  aiBots: {
    allow: [
      "GPTBot",             
      "ChatGPT-User",        // OpenAI API - Very active 
      "OAI-SearchBot",       // OpenAI Search
      "PerplexityBot",       // Perplexity - Extremely active
      "ClaudeBot",           // Anthropic - Reduced activity but still crawling
      "Googlebot",           // Google - Dominant crawler 
      "GoogleOther",         // Google's new crawler for AI purposes
      "Bingbot",             // Microsoft Bing
      "Meta-ExternalAgent",  // Meta - New major player 
      "Amazonbot",           // Amazon Alexa
      "Applebot"             // Apple Siri/Spotlight
    ],
    disallow: [
      "Bytespider"           // ByteDance 
    ],
    notes: {
      grok: "xAI/Grok does not use a public crawler - relies on X/Twitter data and licensed sources",
      gemini: "Google Gemini uses Googlebot, not a separate 'GeminiBot'",
      claude: "ClaudeBot activity reduced significantly in 2024 (-46% requests)"
    }
  }
};
