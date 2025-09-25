import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Store compartido para performance de componentes Three.js
 * Siguiendo las mejores prácticas de la guía Zustand.md:
 * - Dividido en slices por funcionalidad
 * - Evita re-renders innecesarios
 * - Batch updates para múltiples cambios
 * - Selectores optimizados
 */

// Tipos para el store
interface ThreePerformanceState {
  // Global performance settings
  globalQuality: 'low' | 'medium' | 'high';
  deviceCapabilities: {
    isLowEnd: boolean;
    supportsWebGL2: boolean;
    maxTextureSize: number;
    pixelRatio: number;
  };
  
  // Component-specific states
  components: {
    [componentId: string]: {
      isVisible: boolean;
      isPaused: boolean;
      isLoading: boolean;
      opacity: number;
      rotationSpeed: number;
      lastUpdate: number;
    };
  };
  
  // Performance monitoring
  performance: {
    frameRate: number;
    memoryUsage: number;
    activeComponents: number;
    renderCalls: number;
  };
}

interface ThreePerformanceActions {
  // Global actions
  setGlobalQuality: (quality: 'low' | 'medium' | 'high') => void;
  initializeDeviceCapabilities: () => void;
  
  // Component management
  registerComponent: (componentId: string) => void;
  unregisterComponent: (componentId: string) => void;
  updateComponent: (componentId: string, updates: Partial<ThreePerformanceState['components'][string]>) => void;
  
  // Batch operations
  batchUpdateComponents: (updates: { [componentId: string]: Partial<ThreePerformanceState['components'][string]> }) => void;
  pauseAllComponents: () => void;
  resumeAllComponents: () => void;
  
  // Performance monitoring
  updatePerformanceMetrics: (metrics: Partial<ThreePerformanceState['performance']>) => void;
  optimizeQualityBasedOnPerformance: () => void;
}

type ThreePerformanceStore = ThreePerformanceState & ThreePerformanceActions;

// Función para detectar capacidades del dispositivo
const detectDeviceCapabilities = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    return {
      isLowEnd: true,
      supportsWebGL2: false,
      maxTextureSize: 1024,
      pixelRatio: 1,
    };
  }
  
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  
  // Heurística simple para detectar dispositivos de baja gama
  const isLowEnd = maxTextureSize < 4096 || 
                   pixelRatio < 2 || 
                   navigator.hardwareConcurrency < 4;
  
  return {
    isLowEnd,
    supportsWebGL2: !!canvas.getContext('webgl2'),
    maxTextureSize,
    pixelRatio,
  };
};

// Store principal con middleware de subscripción para debugging
export const useThreePerformanceStore = create<ThreePerformanceStore>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    globalQuality: 'medium',
    deviceCapabilities: {
      isLowEnd: false,
      supportsWebGL2: false,
      maxTextureSize: 2048,
      pixelRatio: 1,
    },
    components: {},
    performance: {
      frameRate: 60,
      memoryUsage: 0,
      activeComponents: 0,
      renderCalls: 0,
    },
    
    // Acciones globales
    setGlobalQuality: (quality) => {
      const currentState = get();
      if (currentState.globalQuality === quality) return;
      
      set({ globalQuality: quality });
      
      // Actualizar todos los componentes con la nueva calidad
      const componentUpdates: { [key: string]: Partial<ThreePerformanceState['components'][string]> } = {};
      Object.keys(currentState.components).forEach(componentId => {
        componentUpdates[componentId] = { lastUpdate: Date.now() };
      });
      
      if (Object.keys(componentUpdates).length > 0) {
        get().batchUpdateComponents(componentUpdates);
      }
    },
    
    initializeDeviceCapabilities: () => {
      const capabilities = detectDeviceCapabilities();
      set({ deviceCapabilities: capabilities });
      
      // Ajustar calidad automáticamente basada en capacidades
      if (capabilities.isLowEnd) {
        get().setGlobalQuality('low');
      } else if (capabilities.maxTextureSize >= 8192 && capabilities.supportsWebGL2) {
        get().setGlobalQuality('high');
      }
    },
    
    // Gestión de componentes
    registerComponent: (componentId) => {
      const currentState = get();
      if (currentState.components[componentId]) return;
      
      set({
        components: {
          ...currentState.components,
          [componentId]: {
            isVisible: false,
            isPaused: false,
            isLoading: true,
            opacity: 0,
            rotationSpeed: 1.0,
            lastUpdate: Date.now(),
          },
        },
        performance: {
          ...currentState.performance,
          activeComponents: Object.keys(currentState.components).length + 1,
        },
      });
    },
    
    unregisterComponent: (componentId) => {
      const currentState = get();
      if (!currentState.components[componentId]) return;
      
      const { [componentId]: removed, ...remainingComponents } = currentState.components;
      
      set({
        components: remainingComponents,
        performance: {
          ...currentState.performance,
          activeComponents: Object.keys(remainingComponents).length,
        },
      });
    },
    
    updateComponent: (componentId, updates) => {
      const currentState = get();
      const component = currentState.components[componentId];
      if (!component) return;
      
      // Verificar si realmente hay cambios para evitar updates innecesarios
      const hasChanges = Object.entries(updates).some(([key, value]) => 
        component[key as keyof typeof component] !== value
      );
      
      if (!hasChanges) return;
      
      set({
        components: {
          ...currentState.components,
          [componentId]: {
            ...component,
            ...updates,
            lastUpdate: Date.now(),
          },
        },
      });
    },
    
    // Operaciones batch
    batchUpdateComponents: (updates) => {
      const currentState = get();
      const newComponents = { ...currentState.components };
      let hasChanges = false;
      
      Object.entries(updates).forEach(([componentId, componentUpdates]) => {
        const component = newComponents[componentId];
        if (!component) return;
        
        const componentHasChanges = Object.entries(componentUpdates).some(([key, value]) => 
          component[key as keyof typeof component] !== value
        );
        
        if (componentHasChanges) {
          newComponents[componentId] = {
            ...component,
            ...componentUpdates,
            lastUpdate: Date.now(),
          };
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        set({ components: newComponents });
      }
    },
    
    pauseAllComponents: () => {
      const currentState = get();
      const updates: { [key: string]: Partial<ThreePerformanceState['components'][string]> } = {};
      
      Object.keys(currentState.components).forEach(componentId => {
        if (!currentState.components[componentId].isPaused) {
          updates[componentId] = { isPaused: true };
        }
      });
      
      if (Object.keys(updates).length > 0) {
        get().batchUpdateComponents(updates);
      }
    },
    
    resumeAllComponents: () => {
      const currentState = get();
      const updates: { [key: string]: Partial<ThreePerformanceState['components'][string]> } = {};
      
      Object.keys(currentState.components).forEach(componentId => {
        if (currentState.components[componentId].isPaused) {
          updates[componentId] = { isPaused: false };
        }
      });
      
      if (Object.keys(updates).length > 0) {
        get().batchUpdateComponents(updates);
      }
    },
    
    // Monitoreo de performance
    updatePerformanceMetrics: (metrics) => {
      const currentState = get();
      set({
        performance: {
          ...currentState.performance,
          ...metrics,
        },
      });
    },
    
    optimizeQualityBasedOnPerformance: () => {
      const currentState = get();
      const { frameRate, activeComponents } = currentState.performance;
      
      // Lógica de optimización automática
      if (frameRate < 30 && activeComponents > 2) {
        get().setGlobalQuality('low');
      } else if (frameRate < 45 && activeComponents > 1) {
        get().setGlobalQuality('medium');
      } else if (frameRate > 55 && !currentState.deviceCapabilities.isLowEnd) {
        get().setGlobalQuality('high');
      }
    },
  }))
);

// Selectores optimizados para componentes específicos
export const createComponentSelector = (componentId: string) => {
  return (state: ThreePerformanceStore) => ({
    component: state.components[componentId],
    globalQuality: state.globalQuality,
    deviceCapabilities: state.deviceCapabilities,
  });
};

export const createPerformanceSelector = () => {
  return (state: ThreePerformanceStore) => ({
    performance: state.performance,
    activeComponents: state.performance.activeComponents,
    globalQuality: state.globalQuality,
  });
};

export const createActionsSelector = () => {
  return (state: ThreePerformanceStore) => ({
    registerComponent: state.registerComponent,
    unregisterComponent: state.unregisterComponent,
    updateComponent: state.updateComponent,
    batchUpdateComponents: state.batchUpdateComponents,
    setGlobalQuality: state.setGlobalQuality,
    updatePerformanceMetrics: state.updatePerformanceMetrics,
  });
};

// Hook personalizado para componentes Three.js
export const useThreeComponent = (componentId: string) => {
  const component = useThreePerformanceStore(createComponentSelector(componentId));
  const actions = useThreePerformanceStore(createActionsSelector());
  
  // Auto-register/unregister component
  React.useEffect(() => {
    actions.registerComponent(componentId);
    return () => actions.unregisterComponent(componentId);
  }, [componentId, actions]);
  
  return {
    ...component,
    actions,
  };
};

// Performance monitor hook para debugging
export const usePerformanceMonitor = () => {
  const performance = useThreePerformanceStore(createPerformanceSelector());
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Three.js Performance]', performance);
    }
  }, [performance]);
  
  return performance;
};
