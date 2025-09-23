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
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      hoverBackground: 'rgba(255, 255, 255, 0.12)',
      hoverBorder: '1px solid rgba(255, 255, 255, 0.25)'
    },
    secondary: {
      background: 'rgba(69, 35, 174, 0.1)',
      border: '1px solid rgba(69, 35, 174, 0.3)',
      color: '#B794F6',
      hoverBackground: 'rgba(69, 35, 174, 0.15)',
      hoverBorder: '1px solid rgba(69, 35, 174, 0.5)'
    },
    accent: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: '#6EE7B7',
      hoverBackground: 'rgba(16, 185, 129, 0.15)',
      hoverBorder: '1px solid rgba(16, 185, 129, 0.5)'
    }
  }

  const currentVariant = variants[variant]

  return (
    <motion.div
      className="skill-tag"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
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
        target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)'
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: delay * 0.1 + 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
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
