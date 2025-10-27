import React from 'react'
import type { Author } from "@/lib/types/blog"

interface HeroStripProps {
  title: string
  mainTag: string
  publishedDate: string
  author: Author
}

export function HeroStrip({ title, mainTag, publishedDate, author }: HeroStripProps) {
  return (
    <section className="hero-strip">
      <div className="container">
        <div className="root">
          <div className="inner">
            <div className="stack">
              <div className="row">
                <span className="tag">{mainTag}</span>
                <div className="date">{publishedDate}</div>
                <div className="divider">/</div>
              </div>

              <h1 className="title">{title}</h1>

              <div className="meta">
                <div className="avatarWrap">
                  <img src={author?.avatar ?? 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/A5A05E33-1DDD-4041-BCF4-4522767BFCEE.jpeg'} alt={author?.name} className="avatar" />
                </div>
                <div className="authorText">
                  <div className="authorLabel">Post by</div>
                  <div className="authorName">{author?.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
