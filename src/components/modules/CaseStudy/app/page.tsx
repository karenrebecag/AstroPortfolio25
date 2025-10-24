import { HeroStrip } from "@/components/strips/hero-strip/hero-strip"
import { ContentStrip } from "@/components/strips/content-strip/content-strip"
import { ProcessStrip } from "@/components/strips/process-strip/process-strip"
import { SolutionsStrip } from "@/components/strips/solutions-strip/solutions-strip"
import { NavigationStrip } from "@/components/strips/navigation-strip/navigation-strip"
import { FAQStrip } from "@/components/strips/faq-strip/faq-strip"
import { CommentsStrip } from "@/components/strips/comments-strip/comments-strip"
import { ContactStrip } from "@/components/strips/contact-strip/contact-strip"
import { mockBlogPost, mockComments, mockProcessSteps } from "@/lib/data/mock-blog-post"

export default function BlogPostPage() {
  return (
    <main className="min-h-screen">
      <HeroStrip
        title={mockBlogPost.title}
        mainTag={mockBlogPost.mainTag}
        publishedDate={mockBlogPost.publishedDate}
        author={mockBlogPost.author}
      />

      <ContentStrip description={mockBlogPost.description} content={mockBlogPost.content} />

      <ProcessStrip
        title="Process Workflow"
        subtitle="Business challenges are tough, but we have a proven record of elevating our partners to their next and best selves."
        steps={mockProcessSteps}
      />

      <SolutionsStrip
        title="Lo que resolví"
        dropdowns={[
          {
            title: "Dropdown1 (Contraido)",
            description: "Texto colapsado. Solo puede haber un dropdown colapsado a la vez",
          },
          {
            title: "Dropdown2 (Collapsed)",
            description: "Texto colapsado. Solo puede haber un dropdown colapsado a la vez",
          },
          {
            title: "Dropdown3 (Contraido)",
            description: "Texto colapsado. Solo puede haber un dropdown colapsado a la vez",
          },
          {
            title: "Dropdown4 (Contraido)",
            description: "Texto colapsado. Solo puede haber un dropdown colapsado a la vez",
          },
        ]}
        achievements={mockBlogPost.achievements || []}
        finalThoughts={{
          title: "Final Thoughts.",
          paragraphs: [
            "Happiness doesn't have to be complicated. By cultivating small, consistent habits that honor your mind, body, and spirit, you naturally create a foundation for a more joyful and fulfilling life.",
            "Start with just one habit today — your future self will thank you.",
          ],
        }}
        tags={mockBlogPost.tags}
      />

      <div className="bg-[#05000D] px-4 md:px-8 pb-16">
        <div className="container mx-auto max-w-6xl">
          <NavigationStrip previousPost={mockBlogPost.previousPost} nextPost={mockBlogPost.nextPost} />
        </div>
      </div>

      <FAQStrip faqs={mockBlogPost.faqs || []} />

      <CommentsStrip comments={mockComments} />

      <ContactStrip />
    </main>
  )
}
