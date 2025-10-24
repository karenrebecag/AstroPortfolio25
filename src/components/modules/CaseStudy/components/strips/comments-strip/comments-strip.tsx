import { CommentCard } from "./molecules/comment-card"
import { CommentForm } from "./molecules/comment-form"
import type { Comment } from "@/lib/types/blog"

interface CommentsStripProps {
  comments: Comment[]
}

export function CommentsStrip({ comments }: CommentsStripProps) {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex flex-col gap-10 md:gap-16">
          {/* Comments List */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold capitalize">
              {comments.length.toString().padStart(2, "0")} Comments
            </h2>

            <div className="flex flex-col gap-5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-5">
                  <CommentCard comment={comment} />
                  {comment.replies?.map((reply) => (
                    <CommentCard key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Comment Form */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold capitalize">Leave A comment</h2>
            <CommentForm />
          </div>
        </div>
      </div>
    </section>
  )
}
