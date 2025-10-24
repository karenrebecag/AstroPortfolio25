import type React from "react"

interface ContentHeadingProps {
  children: React.ReactNode
  level?: 2 | 3 | 4
}

export function ContentHeading({ children, level = 2 }: ContentHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  const sizeClasses = {
    2: "text-2xl md:text-3xl lg:text-4xl",
    3: "text-xl md:text-2xl lg:text-3xl",
    4: "text-lg md:text-xl lg:text-2xl",
  }

  return <Tag className={`${sizeClasses[level]} font-semibold capitalize leading-tight text-balance`}>{children}</Tag>
}
