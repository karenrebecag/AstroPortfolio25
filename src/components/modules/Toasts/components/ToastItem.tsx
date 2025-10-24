import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastItemProps, ToastType, ToastThemes } from '../types/toasts';

/**
 * Componente individual de toast con animaciones y estilos unificados
 */
const ToastItem: React.FC<ToastItemProps> = ({ 
  toast, 
  onClose, 
  isDarkMode = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para trigger de animación
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Delay para permitir que la animación de salida se complete
    setTimeout(() => onClose(toast.id), 200);
  };

  // Esquemas de colores para cada tipo de toast
  const colorSchemes: ToastThemes = {
    success: {
      light: {
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
        color: '#166534',
        iconColor: '#22c55e',
        shadowColor: 'rgba(34, 197, 94, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(20, 25, 22, 0.95) 100%)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        color: '#86efac',
        iconColor: '#4ade80',
        shadowColor: 'rgba(34, 197, 94, 0.2)'
      }
    },
    error: {
      light: {
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
        color: '#991b1b',
        iconColor: '#ef4444',
        shadowColor: 'rgba(239, 68, 68, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(30, 18, 22, 0.95) 100%)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        color: '#fca5a5',
        iconColor: '#f87171',
        shadowColor: 'rgba(239, 68, 68, 0.2)'
      }
    },
    warning: {
      light: {
        background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
        borderColor: 'rgba(234, 179, 8, 0.2)',
        color: '#854d0e',
        iconColor: '#eab308',
        shadowColor: 'rgba(234, 179, 8, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(25, 22, 18, 0.95) 100%)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        color: '#fde047',
        iconColor: '#facc15',
        shadowColor: 'rgba(234, 179, 8, 0.2)'
      }
    },
    info: {
      light: {
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        color: '#1e40af',
        iconColor: '#3b82f6',
        shadowColor: 'rgba(59, 130, 246, 0.15)'
      },
      dark: {
        background: 'linear-gradient(135deg, rgba(10, 8, 22, 0.95) 0%, rgba(18, 20, 30, 0.95) 100%)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        color: '#93c5fd',
        iconColor: '#60a5fa',
        shadowColor: 'rgba(59, 130, 246, 0.2)'
      }
    }
  };

  // Iconos para cada tipo
  const getIcon = (type: ToastType) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const colors = colorSchemes[toast.type][isDarkMode ? 'dark' : 'light'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.9 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      style={{
        background: colors.background,
        border: `1px solid ${colors.borderColor}`,
        color: colors.color,
        borderRadius: '12px',
        boxShadow: `0 10px 25px ${colors.shadowColor || 'rgba(0, 0, 0, 0.1)'}, 0 4px 6px rgba(0, 0, 0, 0.05)`,
        backdropFilter: 'blur(12px)',
        minWidth: '320px',
        maxWidth: '400px',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Barra de progreso para auto-close */}
      {toast.autoClose && toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ 
            duration: toast.duration / 1000, 
            ease: 'linear' 
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            background: colors.iconColor,
            borderRadius: '0 0 12px 12px'
          }}
        />
      )}

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        {/* Icono */}
        <div style={{ 
          color: colors.iconColor,
          flexShrink: 0,
          marginTop: '2px'
        }}>
          {getIcon(toast.type)}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: 'var(--font-primary)',
            wordBreak: 'break-word'
          }}>
            {toast.message}
          </p>
        </div>

        {/* Botón cerrar */}
        {toast.closable && (
          <motion.button
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.iconColor,
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'all 0.2s ease',
              padding: '0.25rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.background = 'transparent';
            }}
            data-cursor-text="Close Toast"
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ToastItem;
