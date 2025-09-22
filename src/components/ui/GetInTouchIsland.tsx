import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Heart, DollarSign, MessageSquare, Paperclip } from 'lucide-react';
import FlipText from './FlipText';

interface FormData {
  email: string;
  phone: string;
  interests: string[];
  budget: string;
  message: string;
  attachment: File | null;
}

const GetInTouchIsland: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    interests: [],
    budget: '',
    message: '',
    attachment: null
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const interestOptions = [
    'Website Design',
    'Website Development',
    'Motion & Graphic Design'
  ];

  const budgetOptions = [
    '< $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '> $20,000'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleBudgetSelect = (budget: string) => {
    setFormData(prev => ({
      ...prev,
      budget: prev.budget === budget ? '' : budget
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de envío del formulario
  };

  return (
    <div className="contact-form">
      {/* Header Section */}
      <motion.div 
        className="contact-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="contact-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Contact Me
        </motion.div>
        <motion.div 
          className="contact-title"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FlipText text="Get" isHovered={isHovered} className="text-white font-display" />
          <FlipText text="In" isHovered={isHovered} className="text-white font-display" />
          <FlipText text="Touch" isHovered={isHovered} className="text-white font-display" />
        </motion.div>
      </motion.div>

      {/* Form Section */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="contact-form-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {/* Email and Phone Row */}
        <motion.div 
          className="form-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="form-field">
            <label className="field-label">
              <Mail size={18} className="inline-block" />
              Your Email
            </label>
            <div className="input-container">
              <input
                type="email"
                placeholder="Enter the Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'email' ? 'focused' : ''}`}
              />
              <div className="field-underline"></div>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">
              <Phone size={18} className="inline-block" />
              Your Phone
            </label>
            <div className="input-container">
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'phone' ? 'focused' : ''}`}
              />
              <div className="field-underline"></div>
            </div>
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div 
          className="interests-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <label className="field-label">
            <Heart size={18} className="inline-block" />
            I'm interested in...
          </label>
          <div className="interests-options">
            {interestOptions.map((interest, index) => (
              <motion.button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`interest-pill ${formData.interests.includes(interest) ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Budget Section */}
        <motion.div 
          className="budget-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <label className="field-label">
            <DollarSign size={18} className="inline-block" />
            Your Budget
          </label>
          <div className="budget-options">
            {budgetOptions.map((budget, index) => (
              <motion.button
                key={budget}
                type="button"
                onClick={() => handleBudgetSelect(budget)}
                className={`budget-pill ${formData.budget === budget ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {budget}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Message Section */}
        <motion.div 
          className="message-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <label className="field-label">
            <MessageSquare size={18} className="inline-block" />
            More About The Project
          </label>
          <div className="message-container">
            <textarea
              placeholder="Tell me more about your project..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className={`message-input ${focusedField === 'message' ? 'focused' : ''}`}
            />
          </div>
          <div className="message-underline"></div>
        </motion.div>

        {/* Attachment Section */}
        <motion.div 
          className="attachment-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <motion.label 
            htmlFor="file-upload" 
            className="attachment-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Paperclip size={18} className="inline-block" />
            <span>Add an Attachment</span>
          </motion.label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="file-input"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          {formData.attachment && (
            <motion.div 
              className="attachment-preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{formData.attachment.name}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="submit-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <motion.button 
            type="submit" 
            className="submit-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span>Send Request</span>
            <div className="submit-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </motion.form>

     
    </div>
  );
};

export default GetInTouchIsland;
