"use client"

import type React from "react"

import { useState } from "react"

export function CommentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name*"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-3 bg-white rounded-lg border-2 border-neutral-200 focus:border-neutral-400 outline-none transition-colors"
          required
        />
        <input
          type="email"
          placeholder="Your Email*"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-3 bg-white rounded-lg border-2 border-neutral-200 focus:border-neutral-400 outline-none transition-colors"
          required
        />
      </div>

      <textarea
        placeholder="Your Message*"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={6}
        className="px-4 py-3 bg-white rounded-lg border-2 border-neutral-200 focus:border-neutral-400 outline-none transition-colors resize-none"
        required
      />

      <button
        type="submit"
        className="px-8 py-3 bg-foreground text-background rounded-full font-bold capitalize w-fit hover:opacity-90 transition-opacity"
      >
        Submit Review
      </button>
    </form>
  )
}
