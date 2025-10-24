import Image from "next/image"

interface AuthorAvatarProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
}

export function AuthorAvatar({ src, alt, size = "md" }: AuthorAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12 md:w-16 md:h-16",
    lg: "w-16 h-16 md:w-20 md:h-20",
  }

  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden rounded-full`}>
      <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
    </div>
  )
}
