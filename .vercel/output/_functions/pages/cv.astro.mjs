import { e as createComponent, m as maybeRenderHead, k as renderComponent, l as renderScript, r as renderTemplate, f as createAstro } from '../chunks/astro/server_BnuYbohY.mjs';
import 'kleur/colors';
import { $ as $$MainButton, a as $$Layout, D as DitheringShader, b as $$SecondaryButton, c as $$GetInTouch } from '../chunks/SecondaryButton_w041qIjB.mjs';
/* empty css                              */
import { jsx, jsxs } from 'react/jsx-runtime';
import { motion } from 'motion/react';
export { renderers } from '../renderers.mjs';

const $$CVHeader = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="cv-header-wrapper" id="cvHeaderWrapper" data-astro-cid-q6qh3kg5> <header class="cv-header" id="cvMainHeader" data-astro-cid-q6qh3kg5> <div class="cv-logo" data-astro-cid-q6qh3kg5>KAREN ORTIZ</div> <nav class="cv-nav" data-astro-cid-q6qh3kg5> <a href="#summary" data-astro-cid-q6qh3kg5>Summary</a> <a href="#experience" data-astro-cid-q6qh3kg5>Experience</a> <a href="#projects" data-astro-cid-q6qh3kg5>Projects</a> <a href="#skills" data-astro-cid-q6qh3kg5>Skills</a> <a href="#education" data-astro-cid-q6qh3kg5>Education</a> </nav> <div class="cv-contact-btn-wrapper" data-astro-cid-q6qh3kg5> ${renderComponent($$result, "MainButton", $$MainButton, { "text": "Contact Me", "href": "#contact", "data-astro-cid-q6qh3kg5": true })} </div> <button class="cv-menu-btn" id="cvMenuBtn" data-astro-cid-q6qh3kg5> <span data-astro-cid-q6qh3kg5></span> <span data-astro-cid-q6qh3kg5></span> <span data-astro-cid-q6qh3kg5></span> </button> </header> </div> <div class="cv-mobile-menu" id="cvMobileMenu" data-astro-cid-q6qh3kg5> <div class="cv-mobile-menu-content" data-astro-cid-q6qh3kg5> <!-- Close Button --> <button class="cv-mobile-close-btn" id="cvMobileCloseBtn" data-astro-cid-q6qh3kg5> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" data-astro-cid-q6qh3kg5> <path d="m18 6-12 12" data-astro-cid-q6qh3kg5></path> <path d="m6 6 12 12" data-astro-cid-q6qh3kg5></path> </svg> </button> <nav class="cv-mobile-nav" data-astro-cid-q6qh3kg5> <a href="#summary" data-astro-cid-q6qh3kg5>Summary</a> <a href="#experience" data-astro-cid-q6qh3kg5>Experience</a> <a href="#projects" data-astro-cid-q6qh3kg5>Projects</a> <a href="#skills" data-astro-cid-q6qh3kg5>Skills</a> <a href="#education" data-astro-cid-q6qh3kg5>Education</a> <button class="cv-mobile-contact-btn" data-astro-cid-q6qh3kg5>Contact Me</button> </nav> </div> </div>  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeader.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeader.astro", void 0);

function CVSection({
  children,
  id,
  index = 0,
  className,
  noPadding = false
}) {
  return /* @__PURE__ */ jsx(
    motion.section,
    {
      id,
      className: `${noPadding ? "min-h-screen" : "min-h-screen py-20 sm:py-32"} ${className || ""}`,
      initial: { opacity: 0, y: 60 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "0px 0px -10% 0px", amount: 0.2 },
      transition: {
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      children
    }
  );
}

const tagVariants = {
  default: "border-transparent bg-white text-black hover:bg-white/90",
  secondary: "border-transparent bg-gray-700 text-gray-300 hover:bg-gray-600",
  outline: "border-gray-600 text-white hover:border-gray-400"
};
function CVTag({ children, variant = "default", index = 0, className }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${tagVariants[variant]} ${className || ""}`,
      initial: { opacity: 0, scale: 0.8, y: 20 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      },
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      children
    }
  );
}
function CVTagGroup({ label, children, className }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: `space-y-3 ${className || ""}`,
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.6, ease: "easeOut" },
      children: [
        label && /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium text-white", children: label }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children })
      ]
    }
  );
}

function SkillTag({ children, variant = "primary", index = 0 }) {
  const variants = {
    primary: {
      background: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      color: "#ffffff",
      hoverBackground: "rgba(255, 255, 255, 0.12)",
      hoverBorder: "1px solid rgba(255, 255, 255, 0.25)"
    },
    secondary: {
      background: "rgba(69, 35, 174, 0.1)",
      border: "1px solid rgba(69, 35, 174, 0.3)",
      color: "#B794F6",
      hoverBackground: "rgba(69, 35, 174, 0.15)",
      hoverBorder: "1px solid rgba(69, 35, 174, 0.5)"
    },
    accent: {
      background: "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      color: "#6EE7B7",
      hoverBackground: "rgba(16, 185, 129, 0.15)",
      hoverBorder: "1px solid rgba(16, 185, 129, 0.5)"
    }
  };
  const currentVariant = variants[variant];
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "skill-tag",
      initial: { opacity: 0, y: 20, scale: 0.9 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      viewport: { once: true, margin: "-50px" },
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      whileHover: {
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      },
      style: {
        background: currentVariant.background,
        border: currentVariant.border,
        color: currentVariant.color,
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "var(--font-primary)",
        cursor: "default",
        userSelect: "none",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "all 0.3s ease"
      },
      onMouseEnter: (e) => {
        const target = e.target;
        target.style.background = currentVariant.hoverBackground;
        target.style.border = currentVariant.hoverBorder;
        target.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
      },
      onMouseLeave: (e) => {
        const target = e.target;
        target.style.background = currentVariant.background;
        target.style.border = currentVariant.border;
        target.style.boxShadow = "none";
      },
      children
    }
  );
}
function SkillGroup({ children, title, delay = 0 }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "skill-group",
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-100px" },
      transition: {
        duration: 0.6,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      },
      children: [
        /* @__PURE__ */ jsx(
          motion.h3,
          {
            initial: { opacity: 0, x: -20 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: {
              duration: 0.5,
              delay: delay * 0.1 + 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            },
            style: {
              fontSize: "16px",
              fontWeight: "600",
              color: "#ffffff",
              fontFamily: "var(--font-secondary)",
              marginBottom: "8px",
              letterSpacing: "0.5px"
            },
            children: title
          }
        ),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }, children })
      ]
    }
  );
}

function CVHeroBadge({ children, delay = 0 }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.3 + delay, ease: [0.25, 0.46, 0.45, 0.94] },
      children
    }
  );
}
function CVHeroDescription({ children, delay = 0 }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.6 + delay, ease: [0.25, 0.46, 0.45, 0.94] },
      children
    }
  );
}
function CVHeroContact({ children, delay = 0 }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.8, delay: 0.9 + delay, ease: [0.25, 0.46, 0.45, 0.94] },
      children
    }
  );
}
function CVHeroMain({ children }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "min-h-screen flex items-center",
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
      children
    }
  );
}

const $$Astro = createAstro();
const $$Cv = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cv;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Karen Rebeca Ortiz - CV Profesional", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CVHeader", $$CVHeader, { "data-astro-cid-zuwcdr5b": true })} ${maybeRenderHead()}<main class="cv-main" data-astro-cid-zuwcdr5b> <!-- Hero Section with Original CV Animations --> <section class="hero-section" data-astro-cid-zuwcdr5b> <!-- DitheringShader Background Scene --> <div class="hero-dithering-background" data-astro-cid-zuwcdr5b> ${renderComponent($$result2, "DitheringShader", DitheringShader, { "client:visible": true, "width": 1920, "height": 1080, "colorBack": "#010111", "colorFront": "#4523AE", "shape": "wave", "type": "8x8", "pxSize": 3, "speed": 0.6, "client:component-hydration": "visible", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/three/DitheringShader.tsx", "client:component-export": "DitheringShader", "data-astro-cid-zuwcdr5b": true })} </div> ${renderComponent($$result2, "CVHeroMain", CVHeroMain, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeroAnimations.tsx", "client:component-export": "CVHeroMain", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="hero-container-wrapper" data-astro-cid-zuwcdr5b> <div class="hero-container" data-astro-cid-zuwcdr5b> <div class="hero-grid" data-astro-cid-zuwcdr5b> <div class="hero-content" data-astro-cid-zuwcdr5b> ${renderComponent($$result3, "CVHeroBadge", CVHeroBadge, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeroAnimations.tsx", "client:component-export": "CVHeroBadge", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` <div class="hero-badge" data-astro-cid-zuwcdr5b>DESIGN ENGINEER / 2025</div> <h1 class="hero-title" data-astro-cid-zuwcdr5b>
Karen Rebeca
<br data-astro-cid-zuwcdr5b> <span class="hero-subtitle" data-astro-cid-zuwcdr5b>Ortiz</span> </h1> ` })} ${renderComponent($$result3, "CVHeroDescription", CVHeroDescription, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeroAnimations.tsx", "client:component-export": "CVHeroDescription", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` <div class="hero-description" data-astro-cid-zuwcdr5b> <p data-astro-cid-zuwcdr5b>
Passionate technology professional focused on improving quality of life through
<span class="highlight" data-astro-cid-zuwcdr5b> innovative, sustainable, and scalable digital solutions</span>.
</p> <div class="hero-status" data-astro-cid-zuwcdr5b> <div class="status-indicator" data-astro-cid-zuwcdr5b> <div class="status-dot" data-astro-cid-zuwcdr5b></div>
Available for opportunities
</div> <div data-astro-cid-zuwcdr5b>Mexico City (CDMX)</div> </div> </div> ` })} <!-- Action Buttons --> <div class="hero-actions" data-astro-cid-zuwcdr5b> ${renderComponent($$result3, "MainButton", $$MainButton, { "text": "Download CV", "href": "/cv-karen-ortiz.pdf", "data-astro-cid-zuwcdr5b": true })} <div id="portfolio-button" data-astro-cid-zuwcdr5b> ${renderComponent($$result3, "SecondaryButton", $$SecondaryButton, { "text": "Go Portfolio", "variant": "glass", "data-astro-cid-zuwcdr5b": true })} </div> </div> </div> ${renderComponent($$result3, "CVHeroContact", CVHeroContact, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVHeroAnimations.tsx", "client:component-export": "CVHeroContact", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` <div class="hero-contact" data-astro-cid-zuwcdr5b> <div class="contact-section" data-astro-cid-zuwcdr5b> <div class="section-label" data-astro-cid-zuwcdr5b>CONTACT</div> <div class="contact-links" data-astro-cid-zuwcdr5b> <a href="mailto:karen.ortizg@yahoo.com" class="contact-link primary" data-astro-cid-zuwcdr5b>
karen.ortizg@yahoo.com
</a> <a href="tel:+525660014362" class="contact-link" data-astro-cid-zuwcdr5b>
56 6001 43 62
</a> <a href="https://linkedin.com/in/karen-rebeca-ortiz" target="_blank" class="contact-link small" data-astro-cid-zuwcdr5b>
linkedin.com/in/karen-rebeca-ortiz
</a> </div> </div> <div class="specialties-section" data-astro-cid-zuwcdr5b> <div class="section-label" data-astro-cid-zuwcdr5b>SPECIALTIES</div> ${renderComponent($$result4, "CVTagGroup", CVTagGroup, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVTag.tsx", "client:component-export": "CVTagGroup", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "CVTag", CVTag, { "index": 0, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result6) => renderTemplate`UX/UI Design` })} ${renderComponent($$result5, "CVTag", CVTag, { "index": 1, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result6) => renderTemplate`Frontend` })} ${renderComponent($$result5, "CVTag", CVTag, { "index": 2, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result6) => renderTemplate`Fullstack` })} ${renderComponent($$result5, "CVTag", CVTag, { "index": 3, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result6) => renderTemplate`AI Integration` })} ${renderComponent($$result5, "CVTag", CVTag, { "index": 4, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result6) => renderTemplate`Project Management` })} ` })} </div> </div> ` })} </div> </div> </div> ` })} </section> <!-- Professional Summary --> ${renderComponent($$result2, "CVSection", CVSection, { "client:load": true, "id": "summary", "index": 1, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVSection.tsx", "client:component-export": "CVSection", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="section-container" data-astro-cid-zuwcdr5b> <div class="section-header" data-astro-cid-zuwcdr5b> <h2 class="section-title" data-astro-cid-zuwcdr5b>Professional Summary</h2> <div class="section-label" data-astro-cid-zuwcdr5b>OVERVIEW</div> </div> <div class="summary-content" data-astro-cid-zuwcdr5b> <div class="summary-item" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Design Engineer & Fullstack Developer</h3> <p data-astro-cid-zuwcdr5b>
Passionate technology professional focused on improving quality of life through innovative, 
              sustainable, and scalable digital product design and development. Extensive experience in 
              diverse tech roles including technical UX/UI design, frontend development, 3D animation for 
              web environments, project architecture, and backend development on serverless platforms with AI integrations.
</p> </div> <div class="summary-item" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Professional Journey</h4> <p data-astro-cid-zuwcdr5b>
This journey has enabled me to lead large-scale projects autonomously and collaborate with 
              multidisciplinary international teams, adding value and creativity at every development stage. 
              My approach centers on adopting modern and adaptive technologies, prioritizing agile methodologies 
              and phase-by-phase development to ensure high-quality results in large-scale projects.
</p> </div> <div class="summary-item" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Career Focus</h4> <p data-astro-cid-zuwcdr5b>
I actively seek opportunities that challenge me professionally, allowing me to grow and contribute 
              my experience and passion to the success of innovative initiatives. My expertise spans across the 
              full development lifecycle, from user research and design to deployment and maintenance.
</p> </div> </div> </div> ` })} <!-- Experience Section --> ${renderComponent($$result2, "CVSection", CVSection, { "client:load": true, "id": "experience", "index": 2, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVSection.tsx", "client:component-export": "CVSection", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="section-container" data-astro-cid-zuwcdr5b> <div class="section-header" data-astro-cid-zuwcdr5b> <h2 class="section-title" data-astro-cid-zuwcdr5b>Professional Experience</h2> <div class="section-label" data-astro-cid-zuwcdr5b>EXPERIENCE</div> </div> <div class="experience-content" data-astro-cid-zuwcdr5b> <!-- Aurin (Sodio) --> <div class="job-section" data-astro-cid-zuwcdr5b> <h3 class="job-title" data-astro-cid-zuwcdr5b>Design Engineer & Fullstack Developer</h3> <div class="job-header" data-astro-cid-zuwcdr5b> <div class="company" data-astro-cid-zuwcdr5b>Aurin (Sodio)</div> <div class="location" data-astro-cid-zuwcdr5b>Cuernavaca, Morelos</div> </div> <div class="projects-grid" data-astro-cid-zuwcdr5b> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>MonexOne App Design</h4> <p data-astro-cid-zuwcdr5b>Designed mobile UX/UI for MonexOne, collaborating with Ancient Technologies for Mexican and US markets. Implemented atomic design system from UX phase, actively participating in post-design product design and development.</p> </div> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Fintpay WebApp UX/UI Design</h4> <p data-astro-cid-zuwcdr5b>Collaborated with Ancient Technologies in UX engineering development for the platform, leading the creation of atomic components, progressive disclosures in flows, requirement verification, and project management based on primitive modules.</p> </div> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Aurin Task Manager Fullstack Development</h4> <p data-astro-cid-zuwcdr5b>As senior leader, designed UX/UI and developed fullstack the company's main task manager using Next.js and Firestore. Implemented real-time chat, AI assistant, profile management, geolocation, timelogs, and n8n integrations, deployed on Vercel.</p> </div> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Case Management System for Galicia Lawyers</h4> <p data-astro-cid-zuwcdr5b>As senior leader, designed UX/UI and developed fullstack case management system using Next.js, Supabase, Clerk, and Framer. Implemented client onboarding, conflict of interest management, automated service proposals, case categorization, user roles, permissions, and email notifications via cronjobs using Docker package on Hostinger.</p> </div> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Individual English Online Educational Platform</h4> <p data-astro-cid-zuwcdr5b>Participated in UX/UI design and developed the frontend of the national platform with Laravel, using Blade templates, Bootstrap, and Inertia for reactive components.</p> </div> </div> </div> <!-- Athenis AI --> <div class="job-section" data-astro-cid-zuwcdr5b> <h3 class="job-title" data-astro-cid-zuwcdr5b>Senior UX/UI Designer</h3> <div class="job-header" data-astro-cid-zuwcdr5b> <div class="company" data-astro-cid-zuwcdr5b>Athenis AI</div> <div class="location" data-astro-cid-zuwcdr5b>LATAM (Mexico, El Salvador, Peru, EU)</div> </div> <div class="projects-grid" data-astro-cid-zuwcdr5b> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Main Educational Platform UX/UI Design</h4> <p data-astro-cid-zuwcdr5b>Led UX/UI design of main educational platform, leading a team of designers to complete modules. Designed primitive webapp components including Login, Dashboard, Support Material Flow, Resources and Media, Profile, and all interactions with Athenae chatbot.</p> </div> </div> </div> <!-- Ancient Tech --> <div class="job-section" data-astro-cid-zuwcdr5b> <h3 class="job-title" data-astro-cid-zuwcdr5b>UX/UI Designer & Webflow Developer</h3> <div class="job-header" data-astro-cid-zuwcdr5b> <div class="company" data-astro-cid-zuwcdr5b>Ancient Tech</div> <div class="location" data-astro-cid-zuwcdr5b>Houston, Texas & LATAM</div> </div> <div class="projects-grid" data-astro-cid-zuwcdr5b> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Ancient Global Main Website Development</h4> <p data-astro-cid-zuwcdr5b>Led a four-month UX engineering process to design and develop Ancient Global's main website, built entirely in Webflow. Project focused on delivering a smooth and intelligent user experience.</p> </div> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>Ancient AI Implementation</h4> <p data-astro-cid-zuwcdr5b>Evolved Hero Banner functionality into Ancient AI, a custom GPT-based chatbot developed as virtual assistant. This improvement increased user interaction by 25%.</p> </div> </div> </div> <!-- Opinator --> <div class="job-section" data-astro-cid-zuwcdr5b> <h3 class="job-title" data-astro-cid-zuwcdr5b>UX/UI Designer and Frontend Dev</h3> <div class="job-header" data-astro-cid-zuwcdr5b> <div class="company" data-astro-cid-zuwcdr5b>Opinator</div> <div class="location" data-astro-cid-zuwcdr5b>Madrid, Spain</div> </div> <div class="projects-grid" data-astro-cid-zuwcdr5b> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>OPINATOR Main WebApp Redesign</h4> <p data-astro-cid-zuwcdr5b>Participated in redesigning OPINATOR's main WebApp, an online platform for live form creation. Implemented atomic design system based on Shadcn UI components, optimizing development experience for technical teams.</p> </div> </div> </div> <!-- WebCrafters --> <div class="job-section" data-astro-cid-zuwcdr5b> <h3 class="job-title" data-astro-cid-zuwcdr5b>Design Engineer</h3> <div class="job-header" data-astro-cid-zuwcdr5b> <div class="company" data-astro-cid-zuwcdr5b>WebCrafters</div> <div class="location" data-astro-cid-zuwcdr5b>Mexico City</div> </div> <div class="projects-grid" data-astro-cid-zuwcdr5b> <div class="project-card" data-astro-cid-zuwcdr5b> <h4 data-astro-cid-zuwcdr5b>WebArt and UX/UI Agency</h4> <p data-astro-cid-zuwcdr5b>Personal project: WebArt and UX/UI agency with artificial intelligence integrations for web application development and staffing services. Ongoing collaboration with teams in United States and Latin America.</p> </div> </div> </div> </div> </div> ` })} <!-- Technical Skills --> ${renderComponent($$result2, "CVSection", CVSection, { "client:load": true, "id": "skills", "index": 3, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVSection.tsx", "client:component-export": "CVSection", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="section-container" data-astro-cid-zuwcdr5b> <div class="section-header" data-astro-cid-zuwcdr5b> <h2 class="section-title" data-astro-cid-zuwcdr5b>Technical Skills</h2> <div class="section-label" data-astro-cid-zuwcdr5b>EXPERTISE</div> </div> <div class="skills-container" data-astro-cid-zuwcdr5b> ${renderComponent($$result3, "SkillGroup", SkillGroup, { "client:load": true, "title": "Frontend Development", "delay": 0, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SkillTag.tsx", "client:component-export": "SkillGroup", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 0, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Next.js` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 1, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`React` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 2, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`TypeScript` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 3, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Three.js` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 4, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`JavaScript` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 5, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Astro` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 6, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`SASS` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 7, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Tailwind CSS` })} ` })} ${renderComponent($$result3, "SkillGroup", SkillGroup, { "client:load": true, "title": "Backend & Database", "delay": 1, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SkillTag.tsx", "client:component-export": "SkillGroup", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 0, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Node.js` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 1, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Prisma` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 2, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Python` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 3, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`FastAPI` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 4, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Firestore` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 5, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Supabase` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 6, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`PostgreSQL` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "secondary", "index": 7, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`MongoDB` })} ` })} ${renderComponent($$result3, "SkillGroup", SkillGroup, { "client:load": true, "title": "Design & Tools", "delay": 2, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SkillTag.tsx", "client:component-export": "SkillGroup", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 0, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Figma` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 1, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Webflow` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 2, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Framer` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 3, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Wix Studio` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 4, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Shopify` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 5, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`WordPress` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 6, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Git` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "variant": "accent", "index": 7, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Docker` })} ` })} ${renderComponent($$result3, "SkillGroup", SkillGroup, { "client:load": true, "title": "AI & Automation", "delay": 3, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/SkillTag.tsx", "client:component-export": "SkillGroup", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 0, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`OpenAI API` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 1, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Anthropic API` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 2, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`n8n` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 3, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Make` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 4, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Cursor` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 5, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Claude.ai` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 6, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`GitHub` })} ${renderComponent($$result4, "SkillTag", SkillTag, { "index": 7, "data-astro-cid-zuwcdr5b": true }, { "default": ($$result5) => renderTemplate`Vercel` })} ` })} </div> </div> ` })} <!-- Projects Section --> ${renderComponent($$result2, "CVSection", CVSection, { "client:load": true, "id": "projects", "index": 4, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVSection.tsx", "client:component-export": "CVSection", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="section-container" data-astro-cid-zuwcdr5b> <div class="section-header" data-astro-cid-zuwcdr5b> <h2 class="section-title" data-astro-cid-zuwcdr5b>Key Projects</h2> <div class="section-label" data-astro-cid-zuwcdr5b>PORTFOLIO</div> </div> <div class="projects-content" data-astro-cid-zuwcdr5b> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>1</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Aurin Task Manager</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Fullstack Development with AI Integration</div> <p data-astro-cid-zuwcdr5b>Designed UX/UI and developed fullstack the company's main task manager using Next.js and Firestore. Implemented features like real-time chat, AI assistant, profile management, geolocation, timelogs, and n8n integrations, deployed on Vercel.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>Enhanced team productivity through real-time collaboration. AI-powered assistance for task management. Seamless integration with company workflows.</p> </div> </div> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>2</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Case Management System for Galicia Lawyers</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Complete Legal Management Platform</div> <p data-astro-cid-zuwcdr5b>As senior leader, designed UX/UI and developed fullstack case management system using Next.js, Supabase, Clerk, and Framer. Implemented client onboarding, conflict of interest management, automated service proposals, case categorization, user roles, permissions, and email notifications.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>Streamlined legal case management. Automated conflict detection and proposal generation. Enhanced client communication and case tracking.</p> </div> </div> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>3</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>MonexOne Mobile App Design</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Financial Mobile UX/UI for Mexican & US Markets</div> <p data-astro-cid-zuwcdr5b>Designed mobile UX/UI for MonexOne, collaborating with Ancient Technologies for Mexican and US markets. Implemented atomic design system from UX phase, actively participating in post-design product design and development.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>Improved user experience across two major markets. Scalable design system implementation. Enhanced financial service accessibility.</p> </div> </div> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>4</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Ancient Global Website & AI Chatbot</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Complete Web Experience with Custom GPT</div> <p data-astro-cid-zuwcdr5b>Led UX engineering process to design and develop Ancient Global's main website in Webflow. Evolved Hero Banner into Ancient AI, a custom GPT-based chatbot virtual assistant, increasing user interaction by 25%.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>Significant increase in user engagement. Intelligent user assistance through AI. Modern and professional web presence.</p> </div> </div> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>5</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>OPINATOR WebApp Redesign</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Enterprise Form Creation Platform</div> <p data-astro-cid-zuwcdr5b>Participated in redesigning OPINATOR's main WebApp for live form creation, serving high-profile clients including Santander, AT&T, BBVA, Häagen-Dazs, and Pittsburgh Steelers. Implemented atomic design system based on Shadcn UI components.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>30% increase in form response rates. Improved development experience for technical teams. Enhanced usability for enterprise clients.</p> </div> </div> <div class="project-item" data-astro-cid-zuwcdr5b> <div class="project-number" data-astro-cid-zuwcdr5b>6</div> <div class="project-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Athenis AI Educational Platform</h3> <div class="project-subtitle" data-astro-cid-zuwcdr5b>Complete Educational Experience Design</div> <p data-astro-cid-zuwcdr5b>Led UX/UI design of main educational platform, designing primitive webapp components including Login, Dashboard, Support Material Flow, Resources and Media, Profile, and all interactions with Athenae chatbot, using Figma for comprehensive design system.</p> </div> <div class="project-benefits" data-astro-cid-zuwcdr5b> <div class="benefits-label" data-astro-cid-zuwcdr5b>BENEFITS</div> <p data-astro-cid-zuwcdr5b>Cohesive educational experience design. Seamless chatbot integration. Scalable component system for development teams.</p> </div> </div> </div> </div> ` })} <!-- Education Section --> ${renderComponent($$result2, "CVSection", CVSection, { "client:load": true, "id": "education", "index": 5, "client:component-hydration": "load", "client:component-path": "/Users/karenortiz/CascadeProjects/Port25Karen/src/components/ui/CVSection.tsx", "client:component-export": "CVSection", "data-astro-cid-zuwcdr5b": true }, { "default": ($$result3) => renderTemplate` <div class="section-container" data-astro-cid-zuwcdr5b> <div class="section-header" data-astro-cid-zuwcdr5b> <h2 class="section-title" data-astro-cid-zuwcdr5b>Education</h2> <div class="section-label" data-astro-cid-zuwcdr5b>ACADEMIC</div> </div> <div class="education-content" data-astro-cid-zuwcdr5b> <div class="education-item" data-astro-cid-zuwcdr5b> <div class="education-number" data-astro-cid-zuwcdr5b>1</div> <div class="education-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Master's in Software Engineering Management</h3> <div class="education-duration" data-astro-cid-zuwcdr5b>In progress until Sept 2025</div> <ul class="education-points" data-astro-cid-zuwcdr5b> <li data-astro-cid-zuwcdr5b>UTEL</li> <li data-astro-cid-zuwcdr5b>Mexico City</li> <li data-astro-cid-zuwcdr5b>Advanced project management methodologies</li> <li data-astro-cid-zuwcdr5b>Software architecture and design patterns</li> </ul> </div> </div> <div class="education-item" data-astro-cid-zuwcdr5b> <div class="education-number" data-astro-cid-zuwcdr5b>2</div> <div class="education-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Bachelor's in Computer Systems</h3> <div class="education-duration" data-astro-cid-zuwcdr5b>Completed</div> <ul class="education-points" data-astro-cid-zuwcdr5b> <li data-astro-cid-zuwcdr5b>UTEL</li> <li data-astro-cid-zuwcdr5b>Mexico City</li> <li data-astro-cid-zuwcdr5b>Computer science fundamentals</li> <li data-astro-cid-zuwcdr5b>Software development principles</li> </ul> </div> </div> <div class="education-item" data-astro-cid-zuwcdr5b> <div class="education-number" data-astro-cid-zuwcdr5b>3</div> <div class="education-details" data-astro-cid-zuwcdr5b> <h3 data-astro-cid-zuwcdr5b>Professional Certifications</h3> <div class="education-duration" data-astro-cid-zuwcdr5b>2020-2024</div> <ul class="education-points" data-astro-cid-zuwcdr5b> <li data-astro-cid-zuwcdr5b>Data Science Diploma - BEDU + Santander</li> <li data-astro-cid-zuwcdr5b>Frontend Development - Tecnolochicas + Microsoft</li> <li data-astro-cid-zuwcdr5b>AWS Course - Amazon Web Services + Platzi</li> <li data-astro-cid-zuwcdr5b>Machine Learning & AI - Platzi</li> </ul> </div> </div> </div> <div class="learning-badge" data-astro-cid-zuwcdr5b> <div class="badge-title" data-astro-cid-zuwcdr5b>Continuous Learning</div> <div class="badge-subtitle" data-astro-cid-zuwcdr5b>Always growing and expanding technical expertise</div> </div> </div> ` })} </main>  ${renderComponent($$result2, "GetInTouch", $$GetInTouch, { "data-astro-cid-zuwcdr5b": true })} ` })}  ${renderScript($$result, "/Users/karenortiz/CascadeProjects/Port25Karen/src/pages/cv.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/karenortiz/CascadeProjects/Port25Karen/src/pages/cv.astro", void 0);

const $$file = "/Users/karenortiz/CascadeProjects/Port25Karen/src/pages/cv.astro";
const $$url = "/cv";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cv,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
