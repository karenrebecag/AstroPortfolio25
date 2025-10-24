import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import type { 
  Toast, 
  ToastType, 
  ToastOptions, 
  ToastContextType, 
  ToastProviderProps, 
  ToastPosition 
} from '../types/toasts';

/**
 * Context para el sistema de toasts centralizado
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provider principal del sistema de toasts
 * Maneja el estado global de todas las notificaciones
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  defaultPosition = 'top-right',
  defaultDuration = 5000,
  maxToasts = 5
}) => {
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

  // Limpiar todos los toasts
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Función base para agregar toast
  const addToast = useCallback((
    type: ToastType, 
    message: string, 
    options: ToastOptions = {}
  ): string => {
    const id = generateId();
    
    const toast: Toast = {
      id,
      type,
      message,
      duration: options.duration ?? defaultDuration,
      position: options.position ?? defaultPosition,
      closable: options.closable ?? true,
      autoClose: options.autoClose ?? true,
    };

    setToasts(prev => {
      const newToasts = [...prev, toast];
      // Limitar el número máximo de toasts
      return newToasts.slice(-maxToasts);
    });

    // Auto-remover si está configurado
    if (toast.autoClose && toast.duration && toast.duration > 0) {
      setTimeout(() => removeToast(id), toast.duration);
    }

    return id;
  }, [generateId, defaultDuration, defaultPosition, maxToasts, removeToast]);

  // Funciones de conveniencia para cada tipo
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    return addToast('success', message, options);
  }, [addToast]);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    return addToast('error', message, options);
  }, [addToast]);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    return addToast('warning', message, options);
  }, [addToast]);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    return addToast('info', message, options);
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Hook principal para usar el sistema de toasts
 * 
 * @example
 * const { showSuccess, showError, toasts } = useToast();
 * 
 * // Mostrar notificación de éxito
 * showSuccess('¡Comentario enviado!');
 * 
 * // Mostrar error con duración personalizada
 * showError('Error al enviar', { duration: 3000 });
 * 
 * // Mostrar warning sin auto-close
 * showWarning('Revisa los datos', { autoClose: false });
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  
  return context;
};

/**
 * Hook para casos simples donde solo necesitas mostrar toasts
 * sin acceso al estado completo. Usa el ToastContainer global.
 */
export const useSimpleToast = () => {
  const showToast = useCallback((
    type: ToastType,
    message: string,
    options: ToastOptions = {}
  ) => {
    // Disparar evento personalizado para el ToastContainer global
    const event = new CustomEvent('showToast', {
      detail: {
        type,
        message,
        options: {
          duration: options.duration ?? 5000,
          position: options.position ?? 'top-right',
          closable: options.closable ?? true,
          autoClose: options.autoClose ?? true,
        }
      }
    });
    
    window.dispatchEvent(event);
  }, []);

  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    showToast('success', message, options);
  }, [showToast]);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    showToast('error', message, options);
  }, [showToast]);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    showToast('warning', message, options);
  }, [showToast]);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    showToast('info', message, options);
  }, [showToast]);
  
  return {
    showSuccess,
    showError, 
    showWarning,
    showInfo
  };
};

/**
 * Hook de compatibilidad con la implementación anterior
 * Mantiene la API legacy para migración gradual
 */
export const useLegacyToast = () => {
  const { showSuccess, showError, removeToast, toasts } = useToast();

  // Convertir toasts al formato legacy
  const legacyToasts = toasts
    .filter(toast => toast.type === 'success' || toast.type === 'error')
    .map(toast => ({
      id: toast.id,
      type: toast.type as 'success' | 'error',
      message: toast.message,
      duration: toast.duration
    }));

  // Componente ToastContainer dummy - los toasts se renderizan automáticamente por el provider
  const ToastContainer = () => null;

  return {
    toasts: legacyToasts,
    showSuccess,
    showError,
    removeToast,
    ToastContainer,
    // Mantener nombres de función legacy
    addToast: (toast: { type: 'success' | 'error'; message: string; duration?: number }) => {
      return toast.type === 'success' 
        ? showSuccess(toast.message, { duration: toast.duration })
        : showError(toast.message, { duration: toast.duration });
    },
    clearAllToasts: () => toasts.forEach(toast => removeToast(toast.id))
  };
};

export default useToast;
