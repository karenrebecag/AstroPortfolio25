import { AuthorAvatar } from "../../hero-strip/atoms/author-avatar"
import { VerifiedBadge } from "../atoms/verified-badge"
import type { Comment } from "@/lib/types/blog"

interface CommentCardProps {
  comment: Comment
  isReply?: boolean
}

export function CommentCard({ comment, isReply = false }: CommentCardProps) {
  return (
    <div className={`flex gap-4 md:gap-5 ${isReply ? "pl-12 md:pl-20" : ""}`}>
      <AuthorAvatar src={comment.avatar} alt={comment.author} size="md" />

      <div className="flex-1 flex flex-col gap-2 pb-5 border-b border-neutral-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h4 className="text-base md:text-lg font-bold">{comment.author}</h4>
            {comment.isVerified && <VerifiedBadge />}
          </div>
          <time className="text-sm text-muted-foreground">{comment.date}</time>
        </div>

        <p className="text-sm md:text-base leading-relaxed">{comment.content}</p>

        <button className="text-sm md:text-base font-bold capitalize w-fit hover:underline">Reply</button>
      </div>
    </div>
  )
}
