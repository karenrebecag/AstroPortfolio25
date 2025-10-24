"use client"

import { useState } from "react"

const budgets = ["< $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "> $20,000"]

export function BudgetSelector() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <label className="text-base md:text-lg font-medium">Your Budget</label>
      <div className="flex flex-wrap gap-4">
        {budgets.map((budget) => (
          <button
            key={budget}
            type="button"
            onClick={() => setSelected(budget)}
            className={`
              px-6 py-2.5 rounded-full text-sm md:text-base transition-colors
              ${
                selected === budget
                  ? "bg-foreground text-background border border-foreground"
                  : "bg-transparent text-foreground border border-foreground/15"
              }
            `}
          >
            {budget}
          </button>
        ))}
      </div>
    </div>
  )
}
