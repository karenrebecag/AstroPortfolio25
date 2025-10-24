import type React from "react"
interface ContentTextProps {
  children: React.ReactNode
}

export function ContentText({ children }: ContentTextProps) {
  return <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">{children}</p>
}
