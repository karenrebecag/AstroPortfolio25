import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
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

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((type: Toast['type'], message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    addToast('success', message, duration);
  }, [addToast]);

  const showError = useCallback((message: string, duration?: number) => {
    addToast('error', message, duration);
  }, [addToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    addToast('warning', message, duration);
  }, [addToast]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
    }
  };

  const getColors = (type: Toast['type']) => {
    const colorSchemes = {
      success: {
        light: {
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderColor: 'rgba(34, 197, 94, 0.2)',
          color: '#166534',
          iconColor: '#22c55e'
        },
        dark: {
          background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(20, 25, 22, 0.95) 100%)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          color: '#86efac',
          iconColor: '#4ade80'
        }
      },
      error: {
        light: {
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          color: '#991b1b',
          iconColor: '#ef4444'
        },
        dark: {
          background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(30, 18, 22, 0.95) 100%)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          iconColor: '#f87171'
        }
      },
      warning: {
        light: {
          background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
          borderColor: 'rgba(234, 179, 8, 0.2)',
          color: '#854d0e',
          iconColor: '#eab308'
        },
        dark: {
          background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(25, 22, 18, 0.95) 100%)',
          borderColor: 'rgba(234, 179, 8, 0.3)',
          color: '#fde047',
          iconColor: '#facc15'
        }
      }
    };

    return colorSchemes[type][isDarkMode ? 'dark' : 'light'];
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <AnimatePresence>
          {toasts.map((toast) => {
            const colors = getColors(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  background: colors.background,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.color,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(12px)',
                  minWidth: '320px',
                  maxWidth: '400px',
                  padding: '1rem 0.5rem',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{ color: colors.iconColor }}>
                    {getIcon(toast.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      lineHeight: 1.6,
                      margin: 0,
                      fontFamily: 'var(--font-primary)'
                    }}>
                      {toast.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: colors.iconColor,
                      cursor: 'pointer',
                      opacity: 0.7,
                      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      padding: '0.25rem',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                      e.currentTarget.style.background = 'transparent';
                    }}
                    data-cursor-text="Close Toast"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
