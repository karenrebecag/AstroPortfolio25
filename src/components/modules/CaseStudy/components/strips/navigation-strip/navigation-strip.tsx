import Link from "next/link"
import type { RelatedPost } from "@/lib/types/blog"

interface NavigationStripProps {
  previousPost?: RelatedPost
  nextPost?: RelatedPost
}

export function NavigationStrip({ previousPost, nextPost }: NavigationStripProps) {
  return (
    <div className="w-full bg-neutral-900 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-2">
      {previousPost && (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="p-6 md:p-7 flex flex-col gap-3 hover:bg-neutral-800/50 transition-colors rounded-l-xl"
        >
          <span className="text-sm md:text-base font-bold capitalize border-b border-white pb-1 w-fit">Previous</span>
          <h4 className="text-base md:text-lg font-bold leading-6">{previousPost.title}</h4>
        </Link>
      )}

      {previousPost && nextPost && <div className="w-px bg-neutral-800" />}

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="p-6 md:p-7 flex flex-col items-end gap-3 hover:bg-neutral-800/50 transition-colors rounded-r-xl"
        >
          <span className="text-sm md:text-base font-bold capitalize border-b border-white pb-1">Next</span>
          <h4 className="text-base md:text-lg font-bold leading-6 text-right">{nextPost.title}</h4>
        </Link>
      )}
    </div>
  )
}
