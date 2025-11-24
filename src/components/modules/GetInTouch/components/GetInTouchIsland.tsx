import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Heart, DollarSign, MessageSquare, Paperclip, Send, Loader2, User, Globe, X, FileText } from 'lucide-react';
import FlipText from '../../../ui/FlipText.tsx';
import { useLegacyToast as useToast } from '../../Toasts';
import { TextDisperse } from '../../../ui/TextDisperse.tsx';
import TypeSound from '../../../ui/TypeSound.tsx';
import { useContactFormStore } from '../stores/contactFormStore.ts';
import { shallow } from 'zustand/shallow';
import { translations } from '../../../../i18n/translations.js';

// FormData interface ahora está en el store

interface GetInTouchIslandProps {
  lang?: string;
}

const GetInTouchIsland: React.FC<GetInTouchIslandProps> = React.memo(({ lang = 'en' }) => {
  // Hook para detectar el ancho de la ventana
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Obtener traducciones para el idioma actual
  const t = translations[lang as keyof typeof translations] || translations.en;
  const contactT = t.contact;

  const interestOptions = contactT.form.interests.options;
  const budgetOptions = contactT.form.budget.options;

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
        showError(contactT.messages.fileTooBig);
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
      showError(contactT.messages.validation);
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
        showSuccess(contactT.messages.success);
        // Limpiar formulario
        resetForm();
      } else {
        showError(result.message || contactT.messages.error);
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      showError(contactT.messages.connectionError);
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
        transition={{ duration: 0.3, ease: "easeOut" }}
      >

        <motion.div
          className="contact-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <TextDisperse
            text={contactT.title}
            className="text-white font-display contact-title-text"
            style={{
              fontSize: isMobile ? 'clamp(56px, 10.5vw, 140px)' : 'clamp(80px, 15vw, 200px)',
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
          transition={{ duration: 0.3, delay: 0.1 }}
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
          {contactT.subtitle}
        </motion.p>
      </motion.div>

      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        className="contact-form-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {/* Name and Email Row */}
        <motion.div
          className="form-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <div className="form-field">
            <label className="field-label">
              <User size={18} className="inline-block" />
              {contactT.form.name.label}
            </label>
            <div className="input-container">
              <input
                type="text"
                placeholder={contactT.form.name.placeholder}
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
              {contactT.form.email.label}
            </label>
            <div className="input-container">
              <input
                type="email"
                placeholder={contactT.form.email.placeholder}
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
          transition={{ duration: 0.25, delay: 0.08 }}
        >
          <div className="form-field">
            <label className="field-label">
              <Phone size={18} className="inline-block" />
              {contactT.form.phone.label}
            </label>
            <div className="input-container">
              <input
                type="tel"
                placeholder={contactT.form.phone.placeholder}
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
              {contactT.form.country.label}
            </label>
            <div className="input-container">
              <input
                type="text"
                placeholder={contactT.form.country.placeholder}
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
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <label className="field-label">
            <Heart size={18} className="inline-block" />
            {contactT.form.interests.label}
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
                transition={{ duration: 0.2, delay: 0.15 + (index * 0.03) }}
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
          transition={{ duration: 0.25, delay: 0.12 }}
        >
          <label className="field-label">
            <DollarSign size={18} className="inline-block" />
            {contactT.form.budget.label}
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
                transition={{ duration: 0.2, delay: 0.17 + (index * 0.03) }}
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
          transition={{ duration: 0.25, delay: 0.14 }}
        >
          <label className="field-label">
            <MessageSquare size={18} className="inline-block" />
            {contactT.form.message.label}
          </label>
          <div className="message-container">
            <textarea
              placeholder={contactT.form.message.placeholder}
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
                <span>{contactT.form.attachment.label}</span>
              </div>
              <div className="file-specs">
                <span>{contactT.form.attachment.specs}</span>
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
            <span>{isSubmitting ? contactT.form.submit.sending : contactT.form.submit.label}</span>
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

      {/* Email Badge */}
      <motion.div
        className="email-badge"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Mail size={16} />
        <span>{contactT.emailBadge}</span>
      </motion.div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
});

GetInTouchIsland.displayName = 'GetInTouchIsland';

export default GetInTouchIsland;
