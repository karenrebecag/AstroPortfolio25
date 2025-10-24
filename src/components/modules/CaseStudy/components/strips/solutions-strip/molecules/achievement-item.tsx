interface AchievementItemProps {
  number: number
  description: string
}

export function AchievementItem({ number, description }: AchievementItemProps) {
  return (
    <div className="flex items-center gap-6 md:gap-8 border-b border-neutral-700/30 py-6 md:py-8">
      <div className="flex-shrink-0 min-w-[100px] flex items-center justify-center border-r border-neutral-700/30 pr-6 md:pr-12">
        <span className="text-6xl md:text-7xl lg:text-8xl font-normal text-neutral-300">{number}</span>
      </div>
      <p className="flex-1 text-xl md:text-2xl lg:text-3xl leading-relaxed">{description}</p>
    </div>
  )
}
