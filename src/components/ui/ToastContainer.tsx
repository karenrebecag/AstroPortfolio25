import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import Toast from './Toast.tsx';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Crear o encontrar el elemento portal
    let toastPortal = document.getElementById('toast-portal');
    
    if (!toastPortal) {
      toastPortal = document.createElement('div');
      toastPortal.id = 'toast-portal';
      toastPortal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 20px;
        gap: 12px;
      `;
      document.body.appendChild(toastPortal);
    }

    setPortalElement(toastPortal);

    return () => {
      // Cleanup: remover portal si no hay toasts
      if (toasts.length === 0 && toastPortal && toastPortal.parentNode) {
        toastPortal.parentNode.removeChild(toastPortal);
      }
    };
  }, [toasts.length]);

  if (!portalElement) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 9999,
      pointerEvents: 'auto'
    }}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={onRemoveToast}
          />
        ))}
      </AnimatePresence>
    </div>,
    portalElement
  );
};

// Hook personalizado para manejar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'success', message, duration });
  }, [addToast]);

  const showError = useCallback((message: string, duration?: number) => {
    return addToast({ type: 'error', message, duration });
  }, [addToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    clearAllToasts,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    )
  };
};

export default ToastContainer;
