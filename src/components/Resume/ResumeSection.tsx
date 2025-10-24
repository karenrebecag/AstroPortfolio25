"use client"

import { motion } from "motion/react"

interface ResumeSectionProps {
  children: React.ReactNode
  id?: string
  index?: number
  className?: string
  noPadding?: boolean
}

export function ResumeSection({ 
  children, 
  id, 
  index = 0, 
  className, 
  noPadding = false 
}: ResumeSectionProps) {
  return (
    <motion.section
      id={id}
      className={`${noPadding ? "min-h-screen" : "min-h-screen py-20 sm:py-32"} ${className || ""}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.2 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.section>
  )
}
