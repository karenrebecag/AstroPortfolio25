import React from 'react';
import { ToastProvider as BaseToastProvider } from '../hooks/useToast';
import ToastContainer from './ToastContainer';
import { useToast } from '../hooks/useToast';
import type { ToastProviderProps, ToastPosition } from '../types/toasts';

/**
 * Renderer interno para los containers de toast
 * Se encarga de renderizar múltiples containers según las posiciones usadas
 */
const ToastRenderer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  // Obtener todas las posiciones únicas usadas por los toasts actuales
  const positions = [...new Set(toasts.map(toast => toast.position || 'top-right'))] as ToastPosition[];

  return (
    <>
      {positions.map(position => (
        <ToastContainer
          key={position}
          toasts={toasts}
          position={position}
          onRemoveToast={removeToast}
        />
      ))}
    </>
  );
};

/**
 * Provider completo del sistema de toasts
 * Incluye el contexto y el renderer de containers
 */
const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  defaultPosition = 'top-right',
  defaultDuration = 5000,
  maxToasts = 5
}) => {
  return (
    <BaseToastProvider 
      defaultPosition={defaultPosition}
      defaultDuration={defaultDuration}
      maxToasts={maxToasts}
    >
      {children}
      <ToastRenderer />
    </BaseToastProvider>
  );
};

export default ToastProvider;
