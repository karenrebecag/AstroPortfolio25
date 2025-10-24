import { AuthorAvatar } from "../atoms/author-avatar"
import type { Author } from "@/lib/types/blog"

interface AuthorInfoProps {
  author: Author
}

export function AuthorInfo({ author }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <AuthorAvatar src={author.avatar} alt={author.name} size="md" />
      <div className="flex items-center gap-2">
        <span className="text-base md:text-lg text-muted-foreground">Post by</span>
        <span className="text-base md:text-lg font-bold">{author.name}</span>
      </div>
    </div>
  )
}
