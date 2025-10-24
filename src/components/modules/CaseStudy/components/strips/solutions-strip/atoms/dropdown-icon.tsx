interface DropdownIconProps {
  isOpen: boolean
}

export function DropdownIcon({ isOpen }: DropdownIconProps) {
  return (
    <div className="w-6 h-6 flex items-center justify-center">
      <svg
        width="12"
        height="6"
        viewBox="0 0 12 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      >
        <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
