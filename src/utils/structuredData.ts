// utils/structuredData.ts
// Structured Data optimized for LLMs and AI search engines

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karen Rebeca Ortiz",
  "alternateName": "Karen Ortiz",
  "jobTitle": "Design Engineer",
  "description": "Design Engineer specializing in UX/UI design, fullstack development, and AI-driven web solutions. Expert in React, TypeScript, Three.js, and modern web technologies.",
  "url": "https://karenortiz.space",
  "image": "https://pub-2e7dc04d482146c59f472ab28fba09a9.r2.dev/MePortfolio.png",
  "sameAs": [
    "https://linkedin.com/in/karenortiz",
    "https://github.com/karenortiz",
    "https://twitter.com/karenortiz"
  ],
  "knowsAbout": [
    "UX/UI Design",
    "Frontend Development", 
    "React",
    "TypeScript",
    "Three.js",
    "Astro",
    "Next.js",
    "Figma",
    "Design Systems",
    "Web Art",
    "AI Integration",
    "Fullstack Development",
    "Motion Design"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Design Engineer",
    "description": "Combines design expertise with technical development skills to create exceptional digital experiences",
    "skills": [
      "User Experience Design",
      "User Interface Design", 
      "Frontend Development",
      "React Development",
      "TypeScript",
      "Three.js",
      "WebGL",
      "Design Systems",
      "Figma",
      "AI Integration"
    ]
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "Universidad Autónoma del Estado de México",
      "description": "Master's in Information and Communication Technologies"
    }
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "WebCrafters",
      "description": "UX/UI and Web Art agency delivering custom web applications with AI-driven features"
    }
  ]
};

export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Karen Ortiz - Design Engineer Portfolio",
  "description": "Professional portfolio showcasing UX/UI design projects, fullstack development work, and AI-driven web solutions by Karen Ortiz, Design Engineer.",
  "url": "https://karenortiz.space",
  "author": {
    "@type": "Person",
    "name": "Karen Rebeca Ortiz",
    "jobTitle": "Design Engineer"
  },
  "dateCreated": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "inLanguage": "en-US",
  "keywords": [
    "UX Design",
    "UI Design", 
    "Frontend Development",
    "React",
    "TypeScript",
    "Three.js",
    "Design Engineer",
    "Portfolio",
    "Web Development",
    "AI Integration"
  ],
  "genre": "Portfolio",
  "audience": {
    "@type": "Audience",
    "audienceType": [
      "Recruiters",
      "Hiring Managers", 
      "Design Teams",
      "Development Teams",
      "Potential Clients",
      "Industry Professionals"
    ]
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Karen Ortiz - Design Engineer",
  "alternateName": "WebCrafters",
  "url": "https://karenortiz.space",
  "logo": "https://karenortiz.space/favicon/android-chrome-512x512.png",
  "description": "Design Engineer specializing in creating exceptional digital experiences through UX/UI design and fullstack development.",
  "founder": {
    "@type": "Person",
    "name": "Karen Rebeca Ortiz"
  },
  "foundingDate": "2022",
  "knowsAbout": [
    "UX/UI Design",
    "Frontend Development",
    "React Development",
    "TypeScript",
    "Three.js",
    "Design Systems",
    "AI Integration",
    "Web Art"
  ],
  "serviceArea": {
    "@type": "Place",
    "name": "Global"
  },
  "areaServed": "Worldwide"
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Karen Ortiz - Design Engineer Portfolio",
  "alternateName": "Karen Ortiz Portfolio",
  "url": "https://karenortiz.space",
  "description": "Professional portfolio of Karen Ortiz, Design Engineer specializing in UX/UI design, fullstack development, and AI-driven web solutions.",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "creator": {
    "@type": "Person",
    "name": "Karen Rebeca Ortiz"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://karenortiz.space/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does Karen Ortiz offer as a Design Engineer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen Ortiz offers comprehensive digital solutions including UX/UI design, mobile app prototyping, fullstack development, Web Art with 3D animations, AI integration, and workflow automation. She specializes in creating developer-friendly design systems and functional React and TypeScript components."
      }
    },
    {
      "@type": "Question", 
      "name": "How does Karen integrate design and development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen creates developer-friendly design systems in Figma paired with functional React and TypeScript components. This approach ensures seamless handoff between design and development teams while maintaining design consistency and technical feasibility."
      }
    },
    {
      "@type": "Question",
      "name": "What is Karen's approach to coding and development?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen follows a 'Vibe Coding' approach - creative problem-solving with disciplined JavaScript and Python practices. This results in clean, maintainable code with personality, combining technical excellence with creative innovation."
      }
    },
    {
      "@type": "Question",
      "name": "Does Karen work with AI integration?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Karen specializes in AI-driven features including chatbots and automated workflows using Gemini and OpenAI APIs. She integrates AI capabilities seamlessly into web applications to enhance user experience and functionality."
      }
    }
  ]
};

// Combined schema for the main portfolio page
export const getMainPageSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    personSchema,
    portfolioSchema,
    organizationSchema,
    websiteSchema
  ]
});

// FAQ schema for the FAQs section
export const getFAQSchema = () => faqSchema;
