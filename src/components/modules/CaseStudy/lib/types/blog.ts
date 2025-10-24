export interface Author {
  name: string
  avatar: string
}

export interface BlogPost {
  id: string
  title: string
  description: string
  mainTag: string
  publishedDate: string
  author: Author
  content: ContentBlock[]
  techStack?: TechStackItem[]
  achievements?: Achievement[]
  faqs?: FAQ[]
  tags: string[]
  previousPost?: RelatedPost
  nextPost?: RelatedPost
}

export interface ContentBlock {
  type: "text" | "heading" | "image" | "quote" | "imageGrid" | "dropdown"
  content: string | ImageContent | QuoteContent | ImageGridContent | DropdownContent
}

export interface ImageContent {
  src: string
  alt: string
  caption?: string
}

export interface QuoteContent {
  quote: string
  author: string
}

export interface ImageGridContent {
  images: ImageContent[]
}

export interface DropdownContent {
  title: string
  description: string
}

export interface TechStackItem {
  title: string
  description: string
}

export interface Achievement {
  number: number
  description: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface RelatedPost {
  title: string
  slug: string
}

export interface Comment {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  isVerified?: boolean
  replies?: Comment[]
}

export interface ProcessStep {
  number: number
  title: string
  description: string
}
