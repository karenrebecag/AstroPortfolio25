/**
 * Toasts Module - Centralized Toast System
 * 
 * Sistema unificado de notificaciones toast para toda la aplicación.
 * Reemplaza las múltiples implementaciones dispersas por una solución centralizada.
 * 
 * @author Karen Ortiz
 * @version 1.0.0
 */

// ===== COMPONENTES PRINCIPALES =====
export { default as ToastProvider } from './components/ToastProvider';
export { default as ToastItem } from './components/ToastItem';
export { default as ToastContainer } from './components/ToastContainer';
export { default as GlobalToastContainer } from './components/GlobalToastContainer';

// ===== HOOKS =====
export { 
  useToast, 
  useSimpleToast, 
  useLegacyToast,
  ToastProvider as BaseToastProvider 
} from './hooks/useToast';

// ===== TIPOS =====
export type {
  Toast,
  ToastType,
  ToastOptions,
  ToastPosition,
  ToastContextType,
  ToastProviderProps,
  ToastItemProps,
  ToastContainerProps,
  LegacyToastData,
  ToastColorScheme,
  ToastTheme,
  ToastThemes
} from './types/toasts';

// ===== UTILIDADES =====
export {
  TOAST_PRESETS,
  TOAST_MESSAGES,
  createToastConfig,
  sanitizeToastMessage,
  formatErrorMessage,
  ToastProgress,
  ToastDebouncer
} from './utils/toastHelpers';

// ===== EXPORTS DE CONVENIENCIA =====

/**
 * Export por defecto - ToastProvider para uso directo
 * 
 * @example
 * import ToastProvider from '@/components/modules/Toasts';
 * 
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 */
export { default } from './components/ToastProvider';

/**
 * Export nombrado alternativo para claridad
 */
export { default as Toasts } from './components/ToastProvider';
