"use client"
import { DropdownIcon } from "../atoms/dropdown-icon"

interface DropdownItemProps {
  title: string
  description: string
  isOpen?: boolean
  onToggle?: () => void
}

export function DropdownItem({ title, description, isOpen = false, onToggle }: DropdownItemProps) {
  return (
    <div
      className={`
        px-6 md:px-12 py-6 md:py-11 rounded-2xl cursor-pointer
        transition-all duration-300
        ${isOpen ? "bg-neutral-900/70" : "bg-neutral-900/20 border border-neutral-700"}
      `}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 flex flex-col gap-4 md:gap-5">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-normal leading-tight">{title}</h3>
          {isOpen && (
            <p className="text-base md:text-lg lg:text-xl text-neutral-300 uppercase leading-relaxed">{description}</p>
          )}
        </div>
        <DropdownIcon isOpen={isOpen} />
      </div>
    </div>
  )
}
