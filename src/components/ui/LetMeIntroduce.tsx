import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";

const experienceData = [
  {
    id: "01",
    title: "UX/UI & Frontend Developer",
    company: "OPINATOR (Madrid, Spain)",
    description: "Collaborated Within A Team Of Five UX/UI Designers To Lead The Redesign Of OPINATORs Core WebAPP - A Live Forms Online Creator. Focused On A Developer-First Design Approach.",
    highlight: "I Implemented Modular, Server-Side Rendered Architecture Using Shaden Ul And Modern Frontend Best Practices"
  },
  {
    id: "02",
    title: "UX/UI & Frontend Developer",
    company: "ANCIENT GLOBAL (Texas, USA)",
    description: "Led A Four-Month UX Engineering Process To Design And Develop The Main Web For Ancient. Global. Built Entirely In Webflow, The Project Focused On Delivering A Seamless And Intelligent User Experience.",
    highlight: " I Was Primarily Responsible For Designing And Implementing The Platform's Hero Banner, Which Integrates An Al-Driven Interaction Layer."
  },
  {
    id: "03",
    title: "UX/UI & Fullstack Developer",
    company: "AURIN (Cuernavaca, México)",
    description: "I Made: ",
    highlight: "Mobile UX/UI For MonexOne App (Mex & US), Web UX/UI, AI Automations & Fullstack Development In Partnership With Ancient Technologies (Global), Project Managment & UX/Ul For Web Apps Like Inglesindividual , Galicia MX, Dentol MX, Fintpay Baking And May More."
  },
  {
    id: "04",
    title: "FOUNDER & DEV",
    company: "WebCrafters (Mexico City)",
    description: "Founded and currently lead WebCrafters, a UX/UI and WebArt agency focused on merging aesthetics, user experience, and AI-powered development.",
    highlight: "Spearhead the design and implementation of custom web applications with intelligent features and scalable infrastructure for clients across diverse industries."
  }
];

export default function LetMeIntroduce() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#E8E7E7] p-6 md:p-12 lg:p-20 xl:p-25"
    >
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-15">
        {/* Title */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-black text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-median font-normal leading-tight text-center max-w-6xl">
            LET ME INTRODUCE MYSELF
          </h1>
        </motion.div>

        {/* Hero Image */}
        <motion.img
          className="w-full h-64 md:h-80 lg:h-96 xl:h-[528px] rounded-lg object-cover"
          src="https://placehold.co/1800x528"
          alt="Introduction"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />

        {/* Experience Cards Container - Horizontal Scroll */}
        <div className="w-full rounded-3xl border border-[#EBEBEB] overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 md:gap-8 p-6 md:p-8">
            {experienceData.map((experience, index) => (
              <motion.div
                key={experience.id}
                className="flex-shrink-0 w-80 md:w-96 bg-[#F0F0F0] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-3 md:gap-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Number */}
                <div className="text-[#1B1B1B] text-xl md:text-2xl font-inter font-medium leading-8">
                  {experience.id}
                </div>

                {/* Title and Company */}
                <div className="flex flex-col">
                  <div className="text-black text-lg md:text-xl lg:text-2xl font-inter font-bold uppercase leading-tight md:leading-8">
                    {experience.title}
                  </div>
                  <div className="text-[#1B1B1B] text-base md:text-lg font-inter font-medium leading-6 md:leading-7 mt-1">
                    {experience.company}
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm md:text-base lg:text-lg leading-relaxed">
                  <span className="text-[#1B1B1B] font-inter font-medium">
                    {experience.description}
                  </span>
                  <span className="text-[#4A24B5] font-inter font-medium">
                    {experience.highlight}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}