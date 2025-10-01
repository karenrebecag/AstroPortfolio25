import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  onClose,
  duration = 5000
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    };
    checkDarkMode();

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const handleClose = () => {
    onClose(id);
  };

  const toastStyles = {
    success: {
      light: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        color: '#166534',
        iconColor: '#22c55e',
        shadowColor: 'rgba(34, 197, 94, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(20, 18, 32, 0.95) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        color: '#86efac',
        iconColor: '#4ade80',
        shadowColor: 'rgba(34, 197, 94, 0.2)'
      }
    },
    error: {
      light: {
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#991b1b',
        iconColor: '#ef4444',
        shadowColor: 'rgba(239, 68, 68, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(30, 18, 22, 0.95) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#fca5a5',
        iconColor: '#f87171',
        shadowColor: 'rgba(239, 68, 68, 0.2)'
      }
    }
  };

  const currentStyle = toastStyles[type][isDarkMode ? 'dark' : 'light'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.4
      }}
      style={{
        background: currentStyle.background,
        border: currentStyle.border,
        color: currentStyle.color,
        boxShadow: `0 8px 32px ${currentStyle.shadowColor}, 0 4px 16px rgba(0, 0, 0, 0.1)`,
        backdropFilter: 'blur(12px)',
        borderRadius: '12px',
        padding: '16px 20px',
        minWidth: '320px',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
      className="toast-container"
    >
      {/* Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: currentStyle.iconColor,
          borderRadius: '0 0 12px 12px'
        }}
      />

      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        {type === 'success' ? (
          <CheckCircle 
            size={24} 
            style={{ color: currentStyle.iconColor }}
          />
        ) : (
          <XCircle 
            size={24} 
            style={{ color: currentStyle.iconColor }}
          />
        )}
      </div>

      {/* Message */}
      <div style={{ 
        flex: 1, 
        fontFamily: 'var(--font-primary)', 
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.4
      }}>
        {message}
      </div>

      {/* Close Button */}
      <motion.button
        onClick={handleClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentStyle.color,
          opacity: 0.7,
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
};

export default Toast;
