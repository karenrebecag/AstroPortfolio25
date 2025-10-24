import { ProcessCard } from "./molecules/process-card"
import type { ProcessStep } from "@/lib/types/blog"

interface ProcessStripProps {
  title: string
  subtitle: string
  steps: ProcessStep[]
}

export function ProcessStrip({ title, subtitle, steps }: ProcessStripProps) {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center gap-12 md:gap-20 lg:gap-24">
          <div className="flex flex-col items-center gap-4 md:gap-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal italic text-center">{title}</h2>
            <p className="text-base md:text-lg lg:text-xl text-center text-muted-foreground">{subtitle}</p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
            {steps.map((step, index) => (
              <ProcessCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                variant={index === 0 ? "dark" : "light"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
