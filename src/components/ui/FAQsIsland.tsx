import React, { useState } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQsIsland: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [hoveredFAQ, setHoveredFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern web technologies including React, Next.js, Astro, TypeScript, Node.js, and Three.js. I also have extensive experience with UI/UX design, motion design, and full-stack development."
    },
    {
      id: 2,
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity and scope. A simple website typically takes 2-4 weeks, while complex web applications can take 2-6 months. I always provide detailed timelines during the initial consultation."
    },
    {
      id: 3,
      question: "Do you work with international clients?",
      answer: "Yes, I work with clients globally. I have experience collaborating with teams in Spain, USA, and Mexico. I'm comfortable working across different time zones and communication preferences."
    },
    {
      id: 4,
      question: "What's included in your design process?",
      answer: "My design process includes user research, wireframing, prototyping, visual design, and usability testing. I focus on creating intuitive experiences that align with business goals and user needs."
    },
    {
      id: 5,
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, I offer ongoing support and maintenance packages. This includes regular updates, security monitoring, performance optimization, and feature enhancements based on your evolving needs."
    },
    {
      id: 6,
      question: "Can you help with existing projects?",
      answer: "Absolutely! I can help improve existing projects through code reviews, performance optimization, UI/UX redesigns, or adding new features. I'm experienced in working with legacy codebases."
    }
  ];


  const handleFAQClick = (faqId: number) => {
    setActiveFAQ(activeFAQ === faqId ? null : faqId);
    setHoveredFAQ(activeFAQ === faqId ? null : faqId);
  };

  return (
    <div className="faqs-list">
      {faqs.map((faq) => {
        const isActive = activeFAQ === faq.id;

        return (
          <div
            key={faq.id}
            className={`faq-item clickable ${isActive ? 'active' : ''}`}
            onClick={() => handleFAQClick(faq.id)}
          >
            <div className="faq-number">
              {faq.id.toString().padStart(2, '0')}.
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
