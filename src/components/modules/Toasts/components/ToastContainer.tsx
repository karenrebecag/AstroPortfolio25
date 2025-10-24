import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import ToastItem from './ToastItem';
import type { ToastContainerProps, ToastPosition } from '../types/toasts';

/**
 * Container que renderiza todos los toasts con posicionamiento y animaciones
 */
const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  position, 
  onRemoveToast 
}) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Crear o encontrar elemento portal
  useEffect(() => {
    let toastPortal = document.getElementById('unified-toast-portal');
    
    if (!toastPortal) {
      toastPortal = document.createElement('div');
      toastPortal.id = 'unified-toast-portal';
      document.body.appendChild(toastPortal);
    }

    setPortalElement(toastPortal);

    return () => {
      // Cleanup: remover portal si no hay toasts y no hay otros containers usándolo
      if (toasts.length === 0 && toastPortal && toastPortal.childNodes.length === 0) {
        toastPortal.remove();
      }
    };
  }, [toasts.length]);

  // Detectar modo oscuro
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Calcular estilos de posición
  const getPositionStyles = (pos: ToastPosition) => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      pointerEvents: 'auto'
    };

    switch (pos) {
      case 'top-right':
        return { ...baseStyles, top: 0, right: 0 };
      case 'top-left':
        return { ...baseStyles, top: 0, left: 0 };
      case 'top-center':
        return { 
          ...baseStyles, 
          top: 0, 
          left: '50%', 
          transform: 'translateX(-50%)',
          alignItems: 'center'
        };
      case 'bottom-right':
        return { ...baseStyles, bottom: 0, right: 0 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 0, left: 0 };
      case 'bottom-center':
        return { 
          ...baseStyles, 
          bottom: 0, 
          left: '50%', 
          transform: 'translateX(-50%)',
          alignItems: 'center'
        };
      default:
        return { ...baseStyles, top: 0, right: 0 };
    }
  };

  // Filtrar toasts por posición
  const positionedToasts = toasts.filter(toast => 
    (toast.position || 'top-right') === position
  );

  if (!portalElement || positionedToasts.length === 0) {
    return null;
  }

  return createPortal(
    <div style={getPositionStyles(position)}>
      <AnimatePresence mode="popLayout">
        {positionedToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={onRemoveToast}
            isDarkMode={isDarkMode}
          />
        ))}
      </AnimatePresence>
    </div>,
    portalElement
  );
};

export default ToastContainer;
