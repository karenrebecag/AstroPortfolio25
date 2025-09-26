// utils/resumeStructuredData.ts
// Structured Data optimized for CV/Resume pages and recruitment LLMs

export const resumePersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karen Rebeca Ortiz",
  "alternateName": "Karen Ortiz",
  "jobTitle": "Design Engineer",
  "description": "Experienced Design Engineer with 5+ years specializing in UX/UI design, fullstack development, and AI-driven web solutions. Expert in React, TypeScript, Three.js, and modern web technologies.",
  "url": "https://karenortiz.space/resume",
  "image": "https://pub-2e7dc04d482146c59f472ab28fba09a9.r2.dev/MePortfolio.png",
  "email": "karen.ortizg@yahoo.com",
  "telephone": "+525660014362",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mexico City",
    "addressCountry": "Mexico"
  },
  "sameAs": [
    "https://linkedin.com/in/karen-rebeca-ortiz",
    "https://github.com/karenortiz",
    "https://karenortiz.space"
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
    "Motion Design",
    "WebGL",
    "Node.js",
    "MongoDB",
    "Firebase"
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
      "TypeScript Programming",
      "Three.js Development",
      "WebGL Programming",
      "Design Systems Creation",
      "Figma Design",
      "AI Integration",
      "Fullstack Development",
      "Motion Design"
    ],
    "occupationLocation": {
      "@type": "Place",
      "name": "Remote / Mexico"
    }
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
      "description": "Founder & Design Engineer - UX/UI and Web Art agency delivering custom web applications with AI-driven features"
    }
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Master's in Information and Communication Technologies",
      "educationalLevel": "Master's Degree",
      "credentialCategory": "degree"
    }
  ]
};

export const resumeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Karen Rebeca Ortiz - Professional Resume",
  "description": "Professional resume of Karen Ortiz, Design Engineer with 5+ years of experience in UX/UI design, fullstack development, and AI integration. Available for hire.",
  "url": "https://karenortiz.space/resume",
  "author": {
    "@type": "Person",
    "name": "Karen Rebeca Ortiz",
    "jobTitle": "Design Engineer"
  },
  "dateCreated": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "inLanguage": ["en-US", "es-MX"],
  "keywords": [
    "Karen Ortiz Resume",
    "Design Engineer CV",
    "UX Designer Resume",
    "Frontend Developer CV",
    "React Developer Resume",
    "TypeScript Developer",
    "Three.js Expert",
    "AI Integration Specialist",
    "Professional Experience",
    "Mexico Developer",
    "Remote Work",
    "Freelance Designer"
  ],
  "genre": "Resume",
  "audience": {
    "@type": "Audience",
    "audienceType": [
      "Recruiters",
      "Hiring Managers",
      "HR Professionals",
      "Design Teams",
      "Development Teams",
      "Startup Founders",
      "Tech Companies",
      "Potential Clients"
    ]
  },
  "mainEntity": {
    "@type": "Person",
    "name": "Karen Rebeca Ortiz"
  }
};

export const workExperienceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Karen Ortiz Work Experience",
  "description": "Professional work experience of Karen Ortiz, Design Engineer",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Role",
        "roleName": "Founder & Design Engineer",
        "startDate": "2022-01-01",
        "endDate": "Present",
        "isCurrentRole": true,
        "worksFor": {
          "@type": "Organization",
          "name": "WebCrafters",
          "description": "UX/UI and Web Art agency"
        },
        "description": "Founded WebCrafters, delivering custom web applications with AI-driven features, 3D animations, and scalable architectures for diverse industries."
      }
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "item": {
        "@type": "Role",
        "roleName": "Design Engineer & Fullstack Developer",
        "startDate": "2023-01-01",
        "endDate": "2024-12-01",
        "worksFor": {
          "@type": "Organization",
          "name": "Aurin (SODIO)",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Cuernavaca",
            "addressCountry": "Mexico"
          }
        },
        "description": "Designed mobile and web UX/UI for MonexOne and multiple web applications while leading fullstack development and AI automations."
      }
    },
    {
      "@type": "ListItem",
      "position": 3, 
      "item": {
        "@type": "Role",
        "roleName": "UX/UI & Webflow Developer",
        "startDate": "2022-06-01",
        "endDate": "2022-10-01",
        "worksFor": {
          "@type": "Organization",
          "name": "Ancient Tech",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "Texas",
            "addressCountry": "United States"
          }
        },
        "description": "Directed UX engineering process to design and develop Ancient Tech's main web platform in Webflow with AI-driven interactive features."
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Role", 
        "roleName": "UX/UI & Frontend Developer",
        "startDate": "2021-01-01",
        "endDate": "2022-05-01",
        "worksFor": {
          "@type": "Organization",
          "name": "OPINATOR",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Madrid",
            "addressCountry": "Spain"
          }
        },
        "description": "Led UX/UI redesign of OPINATOR's live forms WebApp, enhancing user experience and developer workflows with a team of five."
      }
    }
  ]
};

export const skillsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Karen Ortiz Technical Skills",
  "description": "Comprehensive technical skills and competencies of Karen Ortiz, Design Engineer",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "DefinedTerm",
        "name": "Frontend Development",
        "description": "Expert in React, TypeScript, Next.js, Astro, and modern frontend technologies"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "DefinedTerm",
        "name": "UX/UI Design",
        "description": "Proficient in Figma, design systems, user research, and interface design"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "DefinedTerm",
        "name": "3D & WebGL",
        "description": "Advanced Three.js, WebGL, and 3D web development skills"
      }
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "DefinedTerm",
        "name": "AI Integration",
        "description": "Experience with OpenAI APIs, Gemini, and AI-driven web features"
      }
    }
  ]
};

export const resumeFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Karen Ortiz's professional experience?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen Ortiz has 5+ years of experience as a Design Engineer, working with companies like OPINATOR (Spain), Ancient Tech (USA), Aurin (Mexico), and founding WebCrafters. She specializes in UX/UI design, fullstack development, and AI integration."
      }
    },
    {
      "@type": "Question",
      "name": "What technologies does Karen Ortiz specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen specializes in React, TypeScript, Three.js, Next.js, Astro, Figma, Node.js, MongoDB, Firebase, and AI integration with OpenAI and Gemini APIs. She's expert in both frontend development and UX/UI design."
      }
    },
    {
      "@type": "Question",
      "name": "Is Karen Ortiz available for hire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Karen is available for freelance projects, consulting, and full-time opportunities. She works remotely and has experience with international teams across Mexico, USA, and Europe."
      }
    },
    {
      "@type": "Question",
      "name": "What is Karen Ortiz's educational background?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen holds a Master's degree in Information and Communication Technologies from Universidad Autónoma del Estado de México and has completed various professional certifications in design and development."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Karen Ortiz unique as a Design Engineer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Karen combines deep technical development skills with strong design expertise, specializing in AI integration and 3D web experiences. She bridges the gap between design and development, creating both beautiful and functional digital products."
      }
    }
  ]
};

// Combined schema for the resume page
export const getResumePageSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    resumePersonSchema,
    resumeSchema,
    workExperienceSchema,
    skillsSchema
  ]
});

// FAQ schema for resume-related questions
export const getResumeFAQSchema = () => resumeFAQSchema;
