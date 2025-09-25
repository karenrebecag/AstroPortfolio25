import { SafariIframe } from "@/components/safari-iframe"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Safari-Style Iframe Component</h1>
          <p className="text-muted-foreground text-lg">
            A functional iframe component with authentic Safari browser aesthetics
          </p>
        </div>

        <div className="grid gap-8">
          {/* Full Featured Safari Iframe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Full Safari Experience</h2>
            <SafariIframe
              src="https://nextjs.org"
              title="Next.js Documentation"
              height={600}
              showControls={true}
              className="mx-auto"
            />
          </div>

          {/* Minimal Safari Iframe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Minimal Safari Window</h2>
            <SafariIframe
              src="https://vercel.com"
              title="Vercel"
              height={400}
              showControls={false}
              className="mx-auto max-w-4xl"
            />
          </div>

          {/* Responsive Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Multiple Windows</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <SafariIframe src="https://sdk.vercel.ai" title="AI SDK" height={350} showControls={true} />
              <SafariIframe src="https://ui.shadcn.com" title="shadcn/ui" height={350} showControls={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
