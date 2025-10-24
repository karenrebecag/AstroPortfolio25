import Image from "next/image"

interface ContentImageProps {
  src: string
  alt: string
  caption?: string
}

export function ContentImage({ src, alt, caption }: ContentImageProps) {
  return (
    <figure className="w-full py-12 md:py-20">
      <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden shadow-lg">
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      </div>
      {caption && <figcaption className="mt-4 text-sm text-center text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
