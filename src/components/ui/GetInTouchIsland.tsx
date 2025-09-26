import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Heart, DollarSign, MessageSquare, Paperclip, Send, Loader2, User, Globe, X, FileText } from 'lucide-react';
import FlipText from './FlipText.tsx';
import { useToast } from './ToastContainer.tsx';
import { TextDisperse } from './TextDisperse.tsx';
import TypeSound from './TypeSound.tsx';
import { useContactFormStore } from '../../stores/contactFormStore.ts';
import { shallow } from 'zustand/shallow';

// FormData interface ahora está en el store

const GetInTouchIsland: React.FC = React.memo(() => {
  // Zustand store hooks optimizados - acceso directo
  const formData = useContactFormStore((state) => state.formData);
  const { focusedField, isHovered, isSubmitting } = useContactFormStore((state) => state.uiState);
  const setField = useContactFormStore((state) => state.setField);
  const toggleInterest = useContactFormStore((state) => state.toggleInterest);
  const selectBudget = useContactFormStore((state) => state.selectBudget);
  const setAttachment = useContactFormStore((state) => state.setAttachment);
  const resetForm = useContactFormStore((state) => state.resetForm);
  const setFocusedField = useContactFormStore((state) => state.setFocusedField);
  const setIsHovered = useContactFormStore((state) => state.setIsHovered);
  const setIsSubmitting = useContactFormStore((state) => state.setIsSubmitting);
  
  // Hook de toasts
  const { showSuccess, showError, ToastContainer } = useToast();

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

  const handleInterestToggle = useCallback((interest: string) => {
    toggleInterest(interest);
  }, [toggleInterest]);

  const handleBudgetSelect = useCallback((budget: string) => {
    selectBudget(budget);
  }, [selectBudget]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File is too large. Maximum size is 10MB.');
        // Limpiar el input
        event.target.value = '';
        return;
      }
    }
    
    setAttachment(file);
  };

  const handleRemoveFile = useCallback(() => {
    setAttachment(null);
    // Limpiar el input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [setAttachment]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validación básica
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please complete name, email and message fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear FormData para enviar al API
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('country', formData.country);
      submitData.append('message', formData.message);
      submitData.append('budget', formData.budget);
      
      // Agregar intereses como array
      formData.interests.forEach(interest => {
        submitData.append('interests', interest);
      });

      // Agregar archivo si existe
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment);
      }

      // Enviar al API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Message sent successfully! I will contact you soon.');
        // Limpiar formulario
        resetForm();
      } else {
        showError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      showError('Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      <TypeSound />
      {/* Header Section */}
      <motion.div 
        className="contact-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        <motion.div 
          className="contact-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextDisperse 
            text="Get In Touch"
            className="text-white font-display"
            style={{
              fontSize: 'clamp(80px, 15vw, 200px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              lineHeight: '0.8',
              color: 'white',
              width: '100%',
              textAlign: 'center'
            }}
          />
        </motion.div>
        
        <motion.p 
          className="contact-description"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.4,
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: '600px',
            width: '100%'
          }}
        >
          Ready to bring your ideas to life? Let's discuss your project
        </motion.p>
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
        {/* Name and Email Row */}
        <motion.div 
          className="form-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="form-field">
            <label className="field-label">
              <User size={18} className="inline-block" />
              Your Name
            </label>
            <div className="input-container">
              <input
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => setField('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'name' ? 'focused' : ''}`}
              />
              <div className="field-underline"></div>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">
              <Mail size={18} className="inline-block" />
              Your Email
            </label>
            <div className="input-container">
              <input
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setField('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'email' ? 'focused' : ''}`}
              />
              <div className="field-underline"></div>
            </div>
          </div>
        </motion.div>

        {/* Phone and Country Row */}
        <motion.div 
          className="form-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="form-field">
            <label className="field-label">
              <Phone size={18} className="inline-block" />
              Your Phone
            </label>
            <div className="input-container">
              <input
                type="tel"
                placeholder="+52 123 4444 4444"
                value={formData.phone}
                onChange={(e) => setField('phone', e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'phone' ? 'focused' : ''}`}
              />
              <div className="field-underline"></div>
            </div>
          </div>
          <div className="form-field">
            <label className="field-label">
              <Globe size={18} className="inline-block" />
              Country
            </label>
            <div className="input-container">
              <input
                type="text"
                placeholder="Mexico, United States, Canada"
                value={formData.country}
                onChange={(e) => setField('country', e.target.value)}
                onFocus={() => setFocusedField('country')}
                onBlur={() => setFocusedField(null)}
                className={`field-input ${focusedField === 'country' ? 'focused' : ''}`}
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
          transition={{ duration: 0.6, delay: 0.6 }}
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
                className={`interest-pill clickable ${formData.interests.includes(interest) ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
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
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <label className="field-label">
            <DollarSign size={18} className="inline-block" />
            Your Budget (USD)
          </label>
          <div className="budget-options">
            {budgetOptions.map((budget, index) => (
              <motion.button
                key={budget}
                type="button"
                onClick={() => handleBudgetSelect(budget)}
                className={`budget-pill clickable ${formData.budget === budget ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.9 + (index * 0.1) }}
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
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <label className="field-label">
            <MessageSquare size={18} className="inline-block" />
            More About The Project
          </label>
          <div className="message-container">
            <textarea
              placeholder="Tell me more about your project..."
              value={formData.message}
              onChange={(e) => setField('message', e.target.value)}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className={`message-input ${focusedField === 'message' ? 'focused' : ''}`}
            />
          </div>
          <div className="message-underline"></div>
        </motion.div>

        {/* Actions Row - Attachment and Submit */}
        <div className="actions-row">
          {/* Attachment Section */}
          <div className="attachment-section">
            <motion.label 
              htmlFor="file-upload" 
              className="attachment-button clickable"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="attachment-button-content">
                <Paperclip size={18} className="inline-block" />
                <span>Add an Attachment</span>
              </div>
              <div className="file-specs">
                <span>Max 10MB • PDF, DOC, DOCX, TXT, JPG, PNG</span>
              </div>
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
                className="attachment-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="attachment-tag-content">
                  <FileText size={16} className="attachment-icon" />
                  <div className="attachment-info">
                    <span className="attachment-name">{formData.attachment.name}</span>
                    <span className="attachment-size">{(formData.attachment.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleRemoveFile}
                    className="remove-attachment-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <div className="submit-section">
          <motion.button 
            type="submit" 
            disabled={isSubmitting}
            className={`submit-button clickable ${isSubmitting ? 'submitting' : ''}`}
            whileHover={!isSubmitting ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isSubmitting ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            <div className="submit-icon">
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" color="white" />
              ) : (
                <Send size={18} color="white" />
              )}
            </div>
          </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
});

GetInTouchIsland.displayName = 'GetInTouchIsland';

export default GetInTouchIsland;
