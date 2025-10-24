interface QuoteBlockProps {
  quote: string
  author: string
}

export function QuoteBlock({ quote, author }: QuoteBlockProps) {
  return (
    <blockquote className="w-full px-6 md:px-20 py-8 md:py-12 bg-neutral-100 rounded-2xl shadow-md">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl md:text-2xl lg:text-3xl text-center font-normal capitalize leading-relaxed text-balance">
          "{quote}"
        </p>
        <cite className="text-sm md:text-base text-muted-foreground font-bold capitalize not-italic">{author}</cite>
      </div>
    </blockquote>
  )
}
