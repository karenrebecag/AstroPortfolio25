import { TagBadge } from "../atoms/tag-badge"

interface PostMetadataProps {
  mainTag: string
  publishedDate: string
}

export function PostMetadata({ mainTag, publishedDate }: PostMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-center">
      <TagBadge variant="primary">{mainTag}</TagBadge>
      <span className="text-sm md:text-base text-muted-foreground font-bold uppercase leading-relaxed">
        {publishedDate}
      </span>
      <span className="text-muted-foreground/50 text-sm">/</span>
    </div>
  )
}
