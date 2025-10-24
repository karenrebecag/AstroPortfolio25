import { FAQItem } from "./molecules/faq-item"
import type { FAQ } from "@/lib/types/blog"

interface FAQStripProps {
  faqs: FAQ[]
}

export function FAQStrip({ faqs }: FAQStripProps) {
  return (
    <section className="w-full bg-[#05000D] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-32">
          <div className="flex flex-col gap-8">
            <h2 className="text-6xl md:text-8xl lg:text-[200px] font-normal leading-none">FAQs</h2>
          </div>

          <div className="flex flex-col gap-12 md:gap-20">
            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm md:text-base text-white/50 leading-6">Do you have any other questions?</p>
              <button className="text-sm md:text-base font-medium text-center w-fit">Ask me directly</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
