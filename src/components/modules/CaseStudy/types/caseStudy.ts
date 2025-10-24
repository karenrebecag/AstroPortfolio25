// ============================================
// CASE STUDY TYPES - Mapped from Payload CMS
// ============================================

export interface Author {
  name: string
  avatar: string
  role?: string
  email?: string
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  description: string
  mainTag: string
  publishedDate: string
  author: Author

  // Hero Section
  featuredImage?: string

  // Content Blocks
  content: ContentBlock[]

  // Process Section
  processSteps?: ProcessStep[]

  // Solutions Section
  solutions?: Solution[]
  achievements?: Achievement[]
  finalThoughts?: FinalThoughts

  // Tech Stack (optional)
  techStack?: TechStackItem[]
  technologies?: string[]

  // FAQs (per case study)
  faqs?: FAQ[]

  // Navigation
  previousPost?: RelatedPost
  nextPost?: RelatedPost
  relatedProjects?: RelatedPost[]

  // Metadata
  tags: string[]
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean

  // Links
  demoUrl?: string
  githubUrl?: string

  // Comments metadata
  commentsEnabled?: boolean
}

// ============================================
// CONTENT BLOCKS
// ============================================

export interface ContentBlock {
  id?: string
  type: "text" | "heading" | "image" | "quote" | "imageGrid" | "video"
  content: string | ImageContent | QuoteContent | ImageGridContent | VideoContent
}

export interface ImageContent {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface QuoteContent {
  quote: string
  author: string
  role?: string
}

export interface ImageGridContent {
  images: ImageContent[]
  columns?: number
}

export interface VideoContent {
  src: string
  thumbnail?: string
  caption?: string
}

// ============================================
// PROCESS SECTION
// ============================================

export interface ProcessStep {
  id?: string
  number: number
  title: string
  description: string
  icon?: string
}

// ============================================
// SOLUTIONS SECTION
// ============================================

export interface Solution {
  id?: string
  title: string
  description: string
  icon?: string
}

export interface Achievement {
  id?: string
  number: number | string
  description: string
  label?: string
}

export interface FinalThoughts {
  title: string
  paragraphs: string[]
}

// ============================================
// TECH STACK
// ============================================

export interface TechStackItem {
  id?: string
  name: string
  description?: string
  icon?: string
  url?: string
}

// ============================================
// FAQs
// ============================================

export interface FAQ {
  id?: string
  question: string
  answer: string
}

// ============================================
// NAVIGATION & RELATED
// ============================================

export interface RelatedPost {
  title: string
  slug: string
  description?: string
  image?: string
  tag?: string
}

// ============================================
// COMMENTS (Integration with existing module)
// ============================================

export interface Comment {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  isVerified?: boolean
  replies?: Comment[]
}

// ============================================
// PAYLOAD CMS RESPONSE TYPES
// ============================================

export interface PayloadCaseStudy {
  id: string
  slug: string
  title: string
  description: string
  content: any // Rich text from Payload
  featuredImage: PayloadMedia
  gallery?: { image: PayloadMedia }[]
  technologies?: { name: string; icon?: string }[]
  processSteps?: ProcessStep[]
  solutions?: Solution[]
  achievements?: Achievement[]
  faqs?: FAQ[]
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  publishedDate?: string
  demoUrl?: string
  githubUrl?: string
  createdAt: string
  updatedAt: string
}

export interface PayloadMedia {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
  filename: string
}

export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// ============================================
// MOCK DATA TYPE (for development)
// ============================================

export interface MockCaseStudyData extends CaseStudy {
  _isMock: true
}
