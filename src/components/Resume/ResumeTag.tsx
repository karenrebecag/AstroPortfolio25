"use client"

import { motion } from "motion/react"

interface ResumeTagProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline"
  index?: number
  className?: string
}

const tagVariants = {
  default: "border-transparent bg-white text-black hover:bg-white/90",
  secondary: "border-transparent bg-gray-700 text-gray-300 hover:bg-gray-600",
  outline: "border-gray-600 text-white hover:border-gray-400",
}

export function ResumeTag({ children, variant = "default", index = 0, className }: ResumeTagProps) {
  return (
    <motion.div 
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${tagVariants[variant]} ${className || ""}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

interface ResumeTagGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
}

export function ResumeTagGroup({ label, children, className }: ResumeTagGroupProps) {
  return (
    <motion.div 
      className={`space-y-3 ${className || ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {label && (
        <h4 className="text-lg font-medium text-white">{label}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </motion.div>
  )
}
