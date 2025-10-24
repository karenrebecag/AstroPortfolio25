import type { ToastType, ToastOptions } from '../types/toasts';

/**
 * Utilidades helper para el sistema de toasts
 */

/**
 * Configuraciones predefinidas para diferentes tipos de notificaciones
 */
export const TOAST_PRESETS = {
  // Notificaciones rápidas (3 segundos)
  quick: { duration: 3000 },
  
  // Notificaciones estándar (5 segundos)  
  standard: { duration: 5000 },
  
  // Notificaciones largas (8 segundos)
  long: { duration: 8000 },
  
  // Notificaciones persistentes (no se cierran automáticamente)
  persistent: { duration: 0, autoClose: false },
  
  // Éxito rápido
  successQuick: { duration: 2000, position: 'top-right' as const },
  
  // Error que requiere atención
  errorPersistent: { 
    duration: 0, 
    autoClose: false, 
    position: 'top-center' as const 
  },
  
  // Warning temporal
  warningTemp: { duration: 4000 },
  
  // Info discreta
  infoSubtle: { 
    duration: 3000, 
    position: 'bottom-right' as const 
  }
};

/**
 * Mensajes predefinidos comunes
 */
export const TOAST_MESSAGES = {
  // Éxito
  SUCCESS: {
    SAVE: '¡Guardado exitosamente!',
    UPDATE: '¡Actualizado correctamente!',
    DELETE: '¡Eliminado exitosamente!',
    SEND: '¡Enviado correctamente!',
    UPLOAD: '¡Archivo subido exitosamente!',
    COPY: '¡Copiado al portapapeles!',
    LOGIN: '¡Bienvenido de vuelta!',
    LOGOUT: '¡Sesión cerrada correctamente!'
  },
  
  // Errores
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Revisa tu internet',
    VALIDATION: 'Por favor, revisa los datos ingresados',
    UNAUTHORIZED: 'No tienes permisos para esta acción',
    NOT_FOUND: 'El recurso no fue encontrado',
    SERVER: 'Error del servidor. Intenta más tarde',
    UPLOAD: 'Error al subir el archivo',
    TIMEOUT: 'La operación tardó demasiado tiempo'
  },
  
  // Advertencias
  WARNING: {
    UNSAVED: 'Tienes cambios sin guardar',
    REQUIRED: 'Todos los campos son obligatorios',
    LIMIT: 'Has alcanzado el límite permitido',
    DUPLICATE: 'Ya existe un elemento similar',
    OUTDATED: 'La información puede estar desactualizada'
  },
  
  // Información
  INFO: {
    LOADING: 'Cargando información...',
    PROCESSING: 'Procesando solicitud...',
    UPDATING: 'Actualizando datos...',
    MAINTENANCE: 'Mantenimiento programado a las 2:00 AM',
    TIP: 'Tip: Usa Ctrl+S para guardar rápidamente'
  }
};

/**
 * Helper para crear configuraciones de toast personalizadas
 */
export const createToastConfig = (
  type: ToastType,
  overrides: Partial<ToastOptions> = {}
): ToastOptions => {
  const baseConfigs: Record<ToastType, ToastOptions> = {
    success: TOAST_PRESETS.successQuick,
    error: TOAST_PRESETS.errorPersistent,
    warning: TOAST_PRESETS.warningTemp,
    info: TOAST_PRESETS.infoSubtle
  };

  return {
    ...baseConfigs[type],
    ...overrides
  };
};

/**
 * Helper para validar y sanitizar mensajes de toast
 */
export const sanitizeToastMessage = (message: string): string => {
  // Remover HTML tags por seguridad
  const withoutTags = message.replace(/<[^>]*>/g, '');
  
  // Limitar longitud (máximo 200 caracteres)
  const maxLength = 200;
  if (withoutTags.length > maxLength) {
    return withoutTags.substring(0, maxLength - 3) + '...';
  }
  
  return withoutTags.trim();
};

/**
 * Helper para generar mensajes de error amigables
 */
export const formatErrorMessage = (error: any): string => {
  // Si es un string, úsalo directamente
  if (typeof error === 'string') {
    return sanitizeToastMessage(error);
  }
  
  // Si tiene mensaje, extráelo
  if (error?.message) {
    return sanitizeToastMessage(error.message);
  }
  
  // Si es un error de red
  if (error?.code === 'NETWORK_ERROR' || error?.name === 'NetworkError') {
    return TOAST_MESSAGES.ERROR.NETWORK;
  }
  
  // Si es timeout
  if (error?.code === 'TIMEOUT' || error?.name === 'TimeoutError') {
    return TOAST_MESSAGES.ERROR.TIMEOUT;
  }
  
  // Error genérico
  return TOAST_MESSAGES.ERROR.GENERIC;
};

/**
 * Helper para crear notificaciones de progreso
 * Útil para operaciones largas como uploads
 */
export class ToastProgress {
  private toastId: string;
  private showToast: (message: string, options?: ToastOptions) => string;
  private removeToast: (id: string) => void;

  constructor(
    showToast: (message: string, options?: ToastOptions) => string,
    removeToast: (id: string) => void,
    initialMessage: string = 'Procesando...'
  ) {
    this.showToast = showToast;
    this.removeToast = removeToast;
    this.toastId = showToast(initialMessage, TOAST_PRESETS.persistent);
  }

  update(message: string) {
    // Remover el toast anterior y crear uno nuevo
    // (En una implementación más avanzada, se podría update in-place)
    this.removeToast(this.toastId);
    this.toastId = this.showToast(message, TOAST_PRESETS.persistent);
  }

  complete(successMessage: string) {
    this.removeToast(this.toastId);
    this.showToast(successMessage, TOAST_PRESETS.successQuick);
  }

  error(errorMessage: string) {
    this.removeToast(this.toastId);
    this.showToast(errorMessage, TOAST_PRESETS.errorPersistent);
  }

  cancel() {
    this.removeToast(this.toastId);
  }
}

/**
 * Debouncer para evitar spam de toasts idénticos
 */
export class ToastDebouncer {
  private static lastMessages: Map<string, number> = new Map();
  private static readonly DEBOUNCE_TIME = 2000; // 2 segundos

  static shouldShow(message: string): boolean {
    const now = Date.now();
    const lastTime = this.lastMessages.get(message);
    
    if (!lastTime || now - lastTime > this.DEBOUNCE_TIME) {
      this.lastMessages.set(message, now);
      return true;
    }
    
    return false;
  }

  static clear() {
    this.lastMessages.clear();
  }
}
