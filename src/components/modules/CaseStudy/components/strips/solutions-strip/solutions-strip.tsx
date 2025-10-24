"use client"

import { useState } from "react"
import { DropdownItem } from "./molecules/dropdown-item"
import { AchievementItem } from "./molecules/achievement-item"
import Image from "next/image"
import type { Achievement } from "@/lib/types/blog"

interface SolutionsStripProps {
  title: string
  dropdowns: Array<{ title: string; description: string }>
  achievements: Achievement[]
  finalThoughts: {
    title: string
    paragraphs: string[]
  }
  tags: string[]
}

export function SolutionsStrip({ title, dropdowns, achievements, finalThoughts, tags }: SolutionsStripProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(1)

  return (
    <section className="w-full bg-[#05000D] text-white py-16 md:py-24 lg:py-32 rounded-b-[50px] md:rounded-b-[80px] lg:rounded-b-[100px]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-16 md:gap-32 lg:gap-48">
          {/* Dropdowns Section */}
          <div className="flex flex-col gap-8 md:gap-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">{title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="flex flex-col gap-8 md:gap-12">
                {dropdowns.map((dropdown, index) => (
                  <DropdownItem
                    key={index}
                    title={dropdown.title}
                    description={dropdown.description}
                    isOpen={openDropdown === index}
                    onToggle={() => setOpenDropdown(openDropdown === index ? null : index)}
                  />
                ))}
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src="/project-showcase.jpg" alt="Project showcase" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="px-4 md:px-12 py-4 md:py-5 bg-neutral-900/20 rounded-2xl border border-neutral-700">
            <div className="flex flex-col">
              <div className="px-4 md:px-12 py-6 md:py-8 border-b border-neutral-700/30">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase text-neutral-300">Logros</h3>
              </div>

              {achievements.map((achievement) => (
                <AchievementItem
                  key={achievement.number}
                  number={achievement.number}
                  description={achievement.description}
                />
              ))}
            </div>
          </div>

          {/* Final Thoughts */}
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold capitalize leading-tight">
                {finalThoughts.title}
              </h3>
              {finalThoughts.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg lg:text-xl text-neutral-200 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm md:text-base font-bold capitalize">Tag:</span>
              {tags.map((tag) => (
                <span key={tag} className="px-4 py-1 bg-neutral-900 rounded border border-neutral-800 text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
