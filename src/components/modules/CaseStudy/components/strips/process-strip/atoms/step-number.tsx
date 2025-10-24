interface StepNumberProps {
  number: number
}

export function StepNumber({ number }: StepNumberProps) {
  return <div className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight">Step {number}</div>
}
