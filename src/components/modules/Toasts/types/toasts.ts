/**
 * Toasts Module - TypeScript Types
 * Unified type definitions for the centralized toast system
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  position?: ToastPosition;
  closable?: boolean;
  autoClose?: boolean;
}

export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  closable?: boolean;
  autoClose?: boolean;
}

export interface ToastContextType {
  toasts: Toast[];
  showSuccess: (message: string, options?: ToastOptions) => string;
  showError: (message: string, options?: ToastOptions) => string;
  showWarning: (message: string, options?: ToastOptions) => string;
  showInfo: (message: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
  maxToasts?: number;
}

export interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
  isDarkMode?: boolean;
}

export interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onRemoveToast: (id: string) => void;
}

// Legacy support - mantener compatibilidad con implementaciones existentes
export interface LegacyToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

// Color schemes for different toast types and themes
export interface ToastColorScheme {
  background: string;
  borderColor: string;
  color: string;
  iconColor: string;
  shadowColor?: string;
}

export interface ToastTheme {
  light: ToastColorScheme;
  dark: ToastColorScheme;
}

export type ToastThemes = Record<ToastType, ToastTheme>;
