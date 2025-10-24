import Image from "next/image"
import type { ImageContent } from "@/lib/types/blog"

interface ImageGridProps {
  images: ImageContent[]
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 w-full">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  )
}
