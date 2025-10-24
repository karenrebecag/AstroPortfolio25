import type React from "react"
interface TagBadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
}

export function TagBadge({ children, variant = "primary" }: TagBadgeProps) {
  return (
    <div
      className={`
        px-4 py-2 rounded-full backdrop-blur-sm
        ${variant === "primary" ? "bg-black text-white" : "bg-black/10 text-foreground"}
      `}
    >
      <span className="text-sm md:text-base font-bold capitalize leading-6">{children}</span>
    </div>
  )
}
