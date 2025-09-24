"use client"

import { motion } from "motion/react"

interface SkillTagProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  index?: number
}

export function SkillTag({ children, variant = 'primary', index = 0 }: SkillTagProps) {
  const variants = {
    primary: {
      background: 'rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.15)',
      color: '#1a1a1a',
      hoverBackground: 'rgba(0, 0, 0, 0.08)',
      hoverBorder: '1px solid rgba(0, 0, 0, 0.25)'
    },
    secondary: {
      background: 'rgba(69, 35, 174, 0.08)',
      border: '1px solid rgba(69, 35, 174, 0.2)',
      color: '#4523AE',
      hoverBackground: 'rgba(69, 35, 174, 0.12)',
      hoverBorder: '1px solid rgba(69, 35, 174, 0.35)'
    },
    accent: {
      background: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      color: '#059669',
      hoverBackground: 'rgba(16, 185, 129, 0.12)',
      hoverBorder: '1px solid rgba(16, 185, 129, 0.35)'
    }
  }

  const currentVariant = variants[variant]

  return (
    <motion.div
      className="skill-tag"
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
      style={{
        background: currentVariant.background,
        border: currentVariant.border,
        color: currentVariant.color,
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'var(--font-primary)',
        cursor: 'default',
        userSelect: 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement
        target.style.background = currentVariant.hoverBackground
        target.style.border = currentVariant.hoverBorder
        target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement
        target.style.background = currentVariant.background
        target.style.border = currentVariant.border
        target.style.boxShadow = 'none'
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <motion.h3
        initial={{ opacity: 1, x: 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.2, 
          delay: delay * 0.02,
          ease: "easeOut"
        }}
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          fontFamily: 'var(--font-secondary)',
          marginBottom: '8px',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </motion.h3>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {children}
      </div>
    </motion.div>
  )
}
