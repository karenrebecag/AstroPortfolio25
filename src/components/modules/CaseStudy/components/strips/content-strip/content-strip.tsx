import { ContentHeading } from "./atoms/content-heading"
import { ContentText } from "./atoms/content-text"
import { ContentImage } from "./molecules/content-image"
import { QuoteBlock } from "./molecules/quote-block"
import { ImageGrid } from "./molecules/image-grid"
import type { ContentBlock } from "@/lib/types/blog"

interface ContentStripProps {
  description: string
  content: ContentBlock[]
}

export function ContentStrip({ description, content }: ContentStripProps) {
  return (
    <section className="w-full bg-neutral-50 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col gap-8 md:gap-16">
          <ContentText>{description}</ContentText>

          {content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return <ContentHeading key={index}>{block.content as string}</ContentHeading>
              case "text":
                return <ContentText key={index}>{block.content as string}</ContentText>
              case "image":
                const imageContent = block.content as { src: string; alt: string; caption?: string }
                return (
                  <ContentImage
                    key={index}
                    src={imageContent.src}
                    alt={imageContent.alt}
                    caption={imageContent.caption}
                  />
                )
              case "quote":
                const quoteContent = block.content as { quote: string; author: string }
                return <QuoteBlock key={index} quote={quoteContent.quote} author={quoteContent.author} />
              case "imageGrid":
                const gridContent = block.content as { images: { src: string; alt: string }[] }
                return <ImageGrid key={index} images={gridContent.images} />
              default:
                return null
            }
          })}
        </div>
      </div>
    </section>
  )
}
