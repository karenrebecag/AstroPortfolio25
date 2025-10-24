"use client"

import { useState } from "react"

interface FAQItemProps {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="py-6 border-b border-white/15 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">{question}</h3>
          {isOpen && <p className="text-sm md:text-base text-white/50 leading-6">{answer}</p>}
        </div>
        <button
          className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          >
            <path d="M11 5V17M5 11H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
