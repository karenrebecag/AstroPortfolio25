import { ContactField } from "./molecules/contact-field"
import { InterestSelector } from "./molecules/interest-selector"
import { BudgetSelector } from "./molecules/budget-selector"

export function ContactStrip() {
  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-6 md:gap-8">
            <span className="text-xs uppercase text-muted-foreground tracking-wider">Contact Me</span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-tight">Get In Touch</h2>
          </div>

          <form className="flex flex-col gap-8 md:gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <ContactField label="Your Email" placeholder="Enter the Email" type="email" />
              <ContactField label="Your Phone" placeholder="Enter your phone number" type="tel" />
            </div>

            <InterestSelector />
            <BudgetSelector />

            <div className="flex flex-col gap-4 md:gap-6">
              <label className="text-base md:text-lg font-medium">More About The Project</label>
              <div className="border-b border-foreground/15 pb-20" />
            </div>

            <button type="button" className="flex items-center gap-4 text-base font-normal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add an Attachment
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-foreground text-background rounded-full font-medium w-fit flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              Send Request
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4 14L14 4M14 4H6M14 4V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
