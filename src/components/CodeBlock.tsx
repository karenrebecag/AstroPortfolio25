"use client"

import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  code: string
  lang?: string
  theme?: string
}

export default function CodeBlock({ code, lang = 'typescript', theme = 'github-light' }: CodeBlockProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    async function highlight() {
      const highlighted = await codeToHtml(code, {
        lang,
        theme
      })
      setHtml(highlighted)
    }
    highlight()
  }, [code, lang, theme])

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="shiki-wrapper"
    />
  )
}
