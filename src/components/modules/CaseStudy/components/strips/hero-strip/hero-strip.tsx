import { PostMetadata } from "./molecules/post-metadata"
import { AuthorInfo } from "./molecules/author-info"
import type { Author } from "@/lib/types/blog"

interface HeroStripProps {
  title: string
  mainTag: string
  publishedDate: string
  author: Author
}

export function HeroStrip({ title, mainTag, publishedDate, author }: HeroStripProps) {
  return (
    <section className="w-full bg-gradient-to-b from-white to-neutral-100 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-4">
            <PostMetadata mainTag={mainTag} publishedDate={publishedDate} />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-tight text-balance capitalize">
              {title}
            </h1>
            <AuthorInfo author={author} />
          </div>
        </div>
      </div>
    </section>
  )
}
