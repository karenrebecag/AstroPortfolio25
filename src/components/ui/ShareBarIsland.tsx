import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Toast from './Toast';
import { translations } from '../../i18n/translations.js';
import { getLangFromUrl } from '../../i18n/utils.js';

interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function ShareBarIsland() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Get current language from URL
  const getCurrentLang = () => {
    if (typeof window !== 'undefined') {
      return getLangFromUrl(new URL(window.location.href));
    }
    return 'en';
  };

  // Get translations for current language
  const getTranslations = () => {
    const lang = getCurrentLang();
    return translations[lang as keyof typeof translations]?.shareBar || translations.en.shareBar;
  };

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const getPageTitle = () => {
    if (typeof document !== 'undefined') {
      return document.title;
    }
    return 'Aurin Task Manager - Karen Rebeca Ortiz';
  };

  const getDescription = () => {
    return "Check out this amazing project by Karen Rebeca Ortiz - Aurin Task Manager: Enterprise-Grade Task Management with AI Integration";
  };

  const copyToClipboard = async () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      await navigator.clipboard.writeText(url);
      addToast('success', t.linkCopied);
    } catch (err) {
      console.error('Failed to copy link:', err);
      addToast('error', t.copyFailed);
    }
  };

  const shareOnTwitter = () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      const text = `${getPageTitle()} - ${getDescription()}`;
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      addToast('success', t.openingTwitter);
    } catch (err) {
      console.error('Failed to share on Twitter:', err);
      addToast('error', t.twitterFailed);
    }
  };

  const shareOnLinkedIn = () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      addToast('success', t.openingLinkedIn);
    } catch (err) {
      console.error('Failed to share on LinkedIn:', err);
      addToast('error', t.linkedInFailed);
    }
  };

  const shareOnReddit = () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      const title = getPageTitle();
      const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      window.open(redditUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      addToast('success', t.openingReddit);
    } catch (err) {
      console.error('Failed to share on Reddit:', err);
      addToast('error', t.redditFailed);
    }
  };

  const shareOnThreads = () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      const text = `${getPageTitle()} - ${getDescription()} ${url}`;
      const threadsUrl = `https://threads.net/intent/post?text=${encodeURIComponent(text)}`;
      window.open(threadsUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      addToast('success', t.openingThreads);
    } catch (err) {
      console.error('Failed to share on Threads:', err);
      addToast('error', t.threadsFailed);
    }
  };

  const shareOnWhatsApp = () => {
    const t = getTranslations();
    try {
      const url = getCurrentUrl();
      const text = `${getPageTitle()} - ${getDescription()} ${url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      addToast('success', t.openingWhatsApp);
    } catch (err) {
      console.error('Failed to share on WhatsApp:', err);
      addToast('error', t.whatsAppFailed);
    }
  };

  return (
    <>
      <motion.div 
        className="share-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="share-content">
          <motion.span 
            className="share-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            {getTranslations().label}
          </motion.span>
          
          <motion.div 
            className="share-buttons"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            <motion.button 
              className="share-btn copy-btn" 
              onClick={copyToClipboard}
              title={getTranslations().copyLink}
              data-cursor-text={getTranslations().copyLink}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </motion.button>

            <motion.button 
              className="share-btn twitter-btn" 
              onClick={shareOnTwitter}
              title={getTranslations().shareOnTwitter}
              data-cursor-text={getTranslations().shareOnTwitter}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </motion.button>

            <motion.button 
              className="share-btn linkedin-btn" 
              onClick={shareOnLinkedIn}
              title={getTranslations().shareOnLinkedIn}
              data-cursor-text={getTranslations().shareOnLinkedIn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </motion.button>

            <motion.button 
              className="share-btn reddit-btn" 
              onClick={shareOnReddit}
              title={getTranslations().shareOnReddit}
              data-cursor-text={getTranslations().shareOnReddit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.45, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </motion.button>

            <motion.button 
              className="share-btn threads-btn" 
              onClick={shareOnThreads}
              title={getTranslations().shareOnThreads}
              data-cursor-text={getTranslations().shareOnThreads}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.18v-.359c0-3.407.85-6.262 2.495-8.313C5.845 1.205 8.598.024 12.179 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.616 12.18v.359c0 3.266.691 5.677 2.057 7.363 1.43 1.781 3.63 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.742-1.756-.34-.394-.8-.609-1.336-.625-1.432-.043-2.482.525-3.15 1.7l-1.818-1.1c1.014-1.68 2.802-2.584 5.17-2.61 1.215.014 2.237.496 2.958 1.393.707.88 1.1 2.058 1.171 3.508 1.636.406 2.911 1.24 3.690 2.41.779 1.17.898 2.569.344 4.049-.665 1.774-2.044 3.178-3.881 3.946-1.784.746-3.863.774-5.836.774z"/>
              </svg>
            </motion.button>

            <motion.button 
              className="share-btn whatsapp-btn" 
              onClick={shareOnWhatsApp}
              title={getTranslations().shareOnWhatsApp}
              data-cursor-text={getTranslations().shareOnWhatsApp}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.55, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Toast Container */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} style={{ pointerEvents: 'auto' }}>
              <Toast
                id={toast.id}
                type={toast.type}
                message={toast.message}
                onClose={removeToast}
                duration={3000}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

    </>
  );
}
