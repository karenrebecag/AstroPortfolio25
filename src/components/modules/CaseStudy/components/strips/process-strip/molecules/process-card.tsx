import { StepNumber } from "../atoms/step-number"

interface ProcessCardProps {
  number: number
  title: string
  description: string
  variant?: "dark" | "light"
}

export function ProcessCard({ number, title, description, variant = "dark" }: ProcessCardProps) {
  const isDark = variant === "dark"

  return (
    <div
      className={`
        flex-1 px-6 md:px-12 lg:px-24 py-12 md:py-20 lg:py-24
        rounded-t-[50px] md:rounded-t-[80px] lg:rounded-t-[100px]
        ${isDark ? "bg-black text-white shadow-2xl" : "bg-neutral-50 text-foreground"}
      `}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <StepNumber number={number} />
        <p className="text-base md:text-lg lg:text-xl leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
