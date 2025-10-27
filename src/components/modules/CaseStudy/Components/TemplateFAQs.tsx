import React, { useState } from 'react';
import './TemplateFAQs.css';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

const TemplateFAQs: React.FC<Props> = ({ faqs }) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const handleFAQClick = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Don't render if no FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="template-faqs-container">
      <h2 className="template-faqs-title">Frequently Asked Questions</h2>
      <div className="template-faqs-list">
        {faqs.map((faq, index) => {
          const isActive = activeFAQ === index;
          const faqNumber = String(index + 1).padStart(2, '0');

          return (
            <div
              key={index}
              className={`template-faq-item clickable ${isActive ? 'active' : ''}`}
              onClick={() => handleFAQClick(index)}
            >
              <div className="template-faq-number">
                {faqNumber}.
              </div>
              <div className="template-faq-content">
                <div className="template-faq-question-container">
                  <h3 className="template-faq-question">
                    {faq.question}
                  </h3>
                  <div className="template-faq-icon">
                    <span className={`icon ${isActive ? 'active' : ''}`}>+</span>
                  </div>
                </div>
                <div className={`template-faq-answer ${isActive ? 'active' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateFAQs;
