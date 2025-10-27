export interface Author {
  name: string
  avatar?: string
  bio?: string
  email?: string
}

export interface BlogPost {
  title: string
  slug: string
  mainTag: string
  tags?: string[]
  publishedDate: string
  author: Author
  excerpt?: string
  content?: string
  coverImage?: string
}
