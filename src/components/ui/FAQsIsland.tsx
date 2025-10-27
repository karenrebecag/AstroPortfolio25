import React, { useState } from 'react';
import type { HomeFAQ } from '../../lib/cms';

interface FAQsIslandProps {
  faqs: HomeFAQ[];
}

const FAQsIsland: React.FC<FAQsIslandProps> = ({ faqs }) => {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const [hoveredFAQ, setHoveredFAQ] = useState<string | null>(null);

  // Fallback FAQs if CMS is unavailable
  const fallbackFaqs: HomeFAQ[] = [
    {
      id: "01",
      question: "What services do you provide as a Design Engineer?",
      answer: "I offer comprehensive digital solutions, including UX/UI design, mobile app prototyping, fullstack development, Web Art with 3D animations, AI integration, and workflow automation, delivering user-focused, scalable, and innovative experiences.",
      order: 1,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: "02",
      question: "How do you integrate design and development seamlessly?",
      answer: "I bridge design and development by creating developer-friendly design systems in Figma, paired with functional React and TypeScript components, ensuring efficient handoff and pixel-perfect implementations.",
      order: 2,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: "03",
      question: "What is your Vibe Coding approach?",
      answer: "Vibe Coding combines creative problem-solving with disciplined JavaScript and Python practices, delivering clean, maintainable code that infuses personality while ensuring scalability and performance.",
      order: 3,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: "04",
      question: "How do you incorporate AI into your solutions?",
      answer: "I enhance applications with AI-driven features like chatbots and automated workflows using APIs such as Gemini and OpenAI, boosting productivity and creating intelligent, user-centric experiences.",
      order: 4,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: "05",
      question: "How do you balance aesthetics and functionality in design?",
      answer: "I merge Web Art techniques, like WebGL and Three.js animations, with user-centric UX principles to create visually stunning, accessible, and high-performing digital interfaces.",
      order: 5,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: "06",
      question: "What is your approach to project delivery and management?",
      answer: "I follow a streamlined process from discovery and UX design to fullstack development and CI/CD deployment, using tools like Vercel and GitHub Actions to ensure reliable, scalable solutions.",
      order: 6,
      status: 'published',
      createdAt: '',
      updatedAt: ''
    }
  ];

  // Use CMS data if available, otherwise use fallback
  const displayFaqs = faqs && faqs.length > 0 ? faqs : fallbackFaqs;


  const handleFAQClick = (faqId: string) => {
    setActiveFAQ(activeFAQ === faqId ? null : faqId);
    setHoveredFAQ(activeFAQ === faqId ? null : faqId);
  };

  return (
    <div className="faqs-list">
      {displayFaqs.map((faq, index) => {
        const isActive = activeFAQ === faq.id;
        const faqNumber = (index + 1).toString().padStart(2, '0');

        return (
          <div
            key={faq.id}
            className={`faq-item clickable ${isActive ? 'active' : ''}`}
            onClick={() => handleFAQClick(faq.id)}
          >
            <div className="faq-number">
              {faqNumber}.
            </div>
            <div className="faq-content">
              <div className="faq-question-container">
                <h3 className="faq-question">
                  {faq.question}
                </h3>
                <div className="faq-icon">
                  <span className={`icon ${isActive ? 'active' : ''}`}>+</span>
                </div>
              </div>
              <div className={`faq-answer ${isActive ? 'active' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQsIsland;
