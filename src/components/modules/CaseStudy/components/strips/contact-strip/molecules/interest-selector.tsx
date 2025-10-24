"use client"

import { useState } from "react"

const interests = ["Website Design", "Website Development", "Motion & Graphic Design"]

export function InterestSelector() {
  const [selected, setSelected] = useState<string[]>(["Website Design"])

  const toggleInterest = (interest: string) => {
    setSelected((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <label className="text-base md:text-lg font-medium">I'm interested in...</label>
      <div className="flex flex-wrap gap-4">
        {interests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`
              px-6 py-2.5 rounded-full text-sm md:text-base transition-colors
              ${
                selected.includes(interest)
                  ? "bg-foreground text-background border border-foreground"
                  : "bg-transparent text-foreground border border-foreground/20"
              }
            `}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  )
}
