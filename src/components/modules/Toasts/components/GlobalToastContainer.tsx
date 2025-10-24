import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import ToastItem from './ToastItem';
import type { Toast, ToastType, ToastOptions } from '../types/toasts';

/**
 * Contenedor global de toasts que escucha eventos del window
 * Permite mostrar toasts desde cualquier componente sin necesidad de ToastProvider
 */
const GlobalToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar cambios en el modo oscuro
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

  // Función para generar ID único
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Remover toast por ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Escuchar eventos de toast globales
  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { type, message, options } = event.detail;
      const id = generateId();
      
      const toast: Toast = {
        id,
        type,
        message,
        duration: options.duration ?? 5000,
        position: options.position ?? 'top-right',
        closable: options.closable ?? true,
        autoClose: options.autoClose ?? true,
      };

      setToasts(prev => {
        const newToasts = [...prev, toast];
        // Limitar a 5 toasts máximo
        return newToasts.slice(-5);
      });

      // Auto-remover si está configurado
      if (toast.autoClose && toast.duration && toast.duration > 0) {
        setTimeout(() => removeToast(id), toast.duration);
      }
    };

    window.addEventListener('showToast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, [generateId, removeToast]);

  // Agrupar toasts por posición
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, Toast[]>);

  // Posiciones disponibles
  const positions = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  // Estilos de posicionamiento
  const getPositionStyles = (position: string) => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none',
      maxHeight: '100vh',
      overflow: 'hidden',
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      case 'top-center':
        return { ...base, top: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px', flexDirection: 'column-reverse' as const };
      case 'bottom-center':
        return { ...base, bottom: '20px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' as const };
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px', flexDirection: 'column-reverse' as const };
      default:
        return { ...base, top: '20px', right: '20px' };
    }
  };

  return (
    <>
      {positions.map(position => {
        const positionToasts = toastsByPosition[position];
        if (!positionToasts || positionToasts.length === 0) return null;

        return (
          <div key={position} style={getPositionStyles(position)}>
            <AnimatePresence>
              {positionToasts.map((toast) => (
                <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                  <ToastItem
                    toast={toast}
                    onClose={removeToast}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
};

export default GlobalToastContainer;
