import type { BlogPost, Comment, ProcessStep } from "@/lib/types/blog"

export const mockBlogPost: BlogPost = {
  id: "1",
  title: "10 Simple Habits to Build a More Joyful and Fulfilling Life.",
  description:
    "In a world that often feels overwhelming, building a joyful and fulfilling life doesn't have to be complicated. Sometimes, it's the small, consistent habits that create the biggest impact. Here are 10 simple yet powerful habits you can start today to cultivate more happiness and purpose in your everyday life.",
  mainTag: "Etiqueta Principal",
  publishedDate: "FEBRUARY 12, 2025",
  author: {
    name: "Karen Ortiz",
    avatar: "/professional-woman-avatar.png",
  },
  content: [
    {
      type: "heading",
      content: "1. Start Your Day with Gratitude.",
    },
    {
      type: "text",
      content:
        "Start your mornings by writing down three things you're grateful for, no matter how small. End your day by reflecting on one positive moment, even if the day felt challenging. Over time, these bookends of gratitude anchor your days in positivity, build resilience, and increase your overall satisfaction with life.",
    },
    {
      type: "heading",
      content: "2. Move Your Body with Joy.",
    },
    {
      type: "text",
      content:
        "Exercise shouldn't feel like a chore; it should feel like a celebration of what your body can do. Instead of forcing yourself into rigid workouts you hate, find movement that sparks joy — dancing, hiking, stretching, yoga, or even a playful walk with your dog.",
    },
    {
      type: "text",
      content: "Physical activity boosts endorphins, reduces stress, and energizes you from the inside out.",
    },
    {
      type: "image",
      content: {
        src: "/placeholder.svg?height=1075&width=1612&query=person+exercising+joyfully",
        alt: "Person exercising with joy",
      },
    },
    {
      type: "quote",
      content: {
        quote: "Joy is not found in grand moments, but in the quiet, simple habits we nurture every day.",
        author: "John Smith",
      },
    },
    {
      type: "heading",
      content: "3. Create Space for Meaningful Connections.",
    },
    {
      type: "text",
      content:
        "Human connection is one of the strongest predictors of happiness. In a busy world, it's easy to let true relationships fade. Make a conscious effort to reach out — send that text, schedule that coffee date, write that heartfelt message.",
    },
    {
      type: "text",
      content:
        "Invest in quality over quantity. A few deep, supportive relationships nourish your heart far more than a hundred surface-level ones.",
    },
    {
      type: "heading",
      content: "4. Design a Nurturing Environment.",
    },
    {
      type: "text",
      content:
        "Your environment dramatically influences your mood and mental clarity. Create spaces around you that inspire peace and creativity. Declutter your room, add plants, hang art you love, or light a candle that makes you feel calm.",
    },
    {
      type: "text",
      content:
        "A beautiful, intentional space isn't about perfection — it's about designing surroundings that reflect and support who you want to become.",
    },
    {
      type: "imageGrid",
      content: {
        images: [
          {
            src: "/placeholder.svg?height=627&width=814&query=peaceful+home+environment",
            alt: "Peaceful home environment",
          },
          {
            src: "/placeholder.svg?height=627&width=814&query=organized+workspace",
            alt: "Organized workspace",
          },
          {
            src: "/placeholder.svg?height=627&width=814&query=plants+in+room",
            alt: "Plants in room",
          },
        ],
      },
    },
  ],
  techStack: [
    {
      title: "Property Protection",
      description: "We advise boards, executives, and stakeholders on governance policies that foster transparency",
    },
    {
      title: "Corporate Governance",
      description: "We advise boards, executives, and stakeholders on governance policies that foster transparency",
    },
    {
      title: "Dispute Resolution",
      description: "We advise boards, executives, and stakeholders on governance policies that foster transparency",
    },
    {
      title: "Intellectual",
      description: "We advise boards, executives, and stakeholders on governance policies that foster transparency",
    },
  ],
  achievements: [
    {
      number: 1,
      description: "Objetivo 1. Texto Largo",
    },
    {
      number: 2,
      description: "Objetivo 2. Texto Largo",
    },
    {
      number: 3,
      description: "Objetivo 3. Texto Largo",
    },
  ],
  faqs: [
    {
      question: "What's the Portz progress like?",
      answer: "I specialize in UX/UI design, web development, and branding for individuals and businesses.",
    },
    {
      question: "Design delivery time estimate?",
      answer: "Project timelines vary based on scope and complexity.",
    },
    {
      question: "What services do you offer?",
      answer: "I offer comprehensive design and development services.",
    },
    {
      question: "What if I don't like design?",
      answer: "We offer unlimited revisions until you are satisfied.",
    },
    {
      question: "Are there any refund?",
      answer: "Refund policies are discussed on a case-by-case basis.",
    },
  ],
  tags: ["Fashion", "Technology", "Travel List"],
  previousPost: {
    title: "How to Stay Productive While Working From Home.",
    slug: "stay-productive-working-from-home",
  },
  nextPost: {
    title: "Simple Habits That Will Transform Your Daily.",
    slug: "simple-habits-transform-daily",
  },
}

export const mockComments: Comment[] = [
  {
    id: "1",
    author: "Guy Hawkins",
    avatar: "/man-avatar.png",
    date: "August 13, 2025",
    content:
      "Lorem ipsum dolor sit amet consectetur. Cursus nunc pharetra arcu quam turpis risus amet turpis. Facilisis elementum tincidunt pellentesque sed rutrum enim.",
    isVerified: true,
    replies: [
      {
        id: "2",
        author: "Eleanor Pena",
        avatar: "/diverse-woman-avatar.png",
        date: "August 13, 2025",
        content: "Great choice of Acronym AF1's",
        isVerified: true,
      },
    ],
  },
  {
    id: "3",
    author: "Jerome Bell",
    avatar: "/man-avatar-2.png",
    date: "August 13, 2025",
    content:
      "Lorem ipsum dolor sit amet consectetur. Cursus nunc pharetra arcu quam turpis risus amet turpis. Facilisis elementum tincidunt pellentesque sed rutrum enim.",
    isVerified: true,
  },
]

export const mockProcessSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Step 1",
    description:
      "We're looking for bold founders who are ready to shape the next wave of Bitcoin and Web3. If you're building something groundbreaking, let's talk.",
  },
  {
    number: 2,
    title: "Step 2",
    description:
      "We're looking for bold founders who are ready to shape the next wave of Bitcoin and Web3. If you're building something groundbreaking, let's talk.",
  },
]
