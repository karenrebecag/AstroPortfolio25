import { shallow } from 'zustand/shallow';

/**
 * Zustand Performance Optimizations
 * Siguiendo las mejores prácticas de la guía Zustand.md
 */

/**
 * Selectores optimizados con shallow comparison para Three.js stores
 * Patrón recomendado: "Siempre memoiza selectores y usa shallow"
 */

// Selector para propiedades de visibilidad - evita re-renders innecesarios
export const selectVisibility = (state: any) => ({
  isVisible: state.isVisible,
  isPaused: state.isPaused,
  isLoading: state.isLoading,
});

// Selector para configuración/calidad - se actualiza solo cuando cambian settings
export const selectSettings = (state: any) => ({
  quality: state.quality,
  opacity: state.opacity,
});

// Selector para propiedades de animación - separado para componentes específicos
export const selectAnimation = (state: any) => ({
  rotationSpeed: state.rotationSpeed,
});

// Selector para acciones - evita recrear funciones
export const selectActions = (state: any) => ({
  setVisible: state.setVisible,
  setPaused: state.setPaused,
  setLoading: state.setLoading,
  setOpacity: state.setOpacity,
  setQuality: state.setQuality,
  setRotationSpeed: state.setRotationSpeed,
  batchUpdate: state.batchUpdate,
});

/**
 * Cleanup helper para recursos Three.js
 * Centraliza la lógica de limpieza siguiendo las mejores prácticas
 */
export const createThreeJSCleanup = () => {
  const cleanupFunctions: (() => void)[] = [];
  
  const addCleanup = (fn: () => void) => {
    cleanupFunctions.push(fn);
  };
  
  const executeCleanup = () => {
    cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    });
    cleanupFunctions.length = 0;
  };
  
  return { addCleanup, executeCleanup };
};

/**
 * Performance monitor para debugging en desarrollo
 */
export const logPerformance = (storeName: string, renderCount: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${storeName}] Render #${renderCount}`);
  }
};
