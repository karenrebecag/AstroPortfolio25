"use client"

import { motion } from "motion/react"

interface SkillTagProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  index?: number
}

export function SkillTag({ children, variant = 'primary', index = 0 }: SkillTagProps) {
  return (
    <motion.div
      className={`skill-tag skill-tag-${variant}`}
      initial={{ opacity: 0.8, y: 10, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.03,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}

interface SkillGroupProps {
  children: React.ReactNode
  title: string
  delay?: number
}

export function SkillGroup({ children, title, delay = 0 }: SkillGroupProps) {
  return (
    <motion.div
      className="skill-group"
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.3, 
        delay: delay * 0.05,
        ease: "easeOut"
      }}
    >
      <motion.h3
        className="skill-group-title"
        initial={{ opacity: 1, x: 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.2, 
          delay: delay * 0.02,
          ease: "easeOut"
        }}
      >
        {title}
      </motion.h3>
      
      <div className="skill-tags-container">
        {children}
      </div>
    </motion.div>
  )
}
