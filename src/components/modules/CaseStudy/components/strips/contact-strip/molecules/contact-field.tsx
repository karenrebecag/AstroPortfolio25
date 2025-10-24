interface ContactFieldProps {
  label: string
  placeholder: string
  type?: "text" | "email" | "tel" | "textarea"
}

export function ContactField({ label, placeholder, type = "text" }: ContactFieldProps) {
  const baseClasses =
    "w-full text-base md:text-lg text-foreground placeholder:text-foreground/30 bg-transparent border-b border-foreground/15 pb-3 focus:border-foreground outline-none transition-colors"

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <label className="text-base md:text-lg font-medium">{label}</label>
      {type === "textarea" ? (
        <textarea placeholder={placeholder} rows={1} className={baseClasses} />
      ) : (
        <input type={type} placeholder={placeholder} className={baseClasses} />
      )}
    </div>
  )
}
