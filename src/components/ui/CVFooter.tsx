"use client"

import { motion } from "motion/react"

export function CVFooter() {
  return (
    <motion.footer 
      className="cv-footer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="cv-footer-container">
        <div className="cv-footer-content">
          <div className="cv-footer-text">
            © 2025 Karen Rebeca Ortiz - Professional Portfolio
          </div>
        </div>
      </div>
      
      {/* Gradient fade effect like original CV */}
      <div className="cv-footer-gradient"></div>
    </motion.footer>
  )
}
