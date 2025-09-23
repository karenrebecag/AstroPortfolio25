// Hook para detección automática de calidad de dispositivo - siguiendo la guía de optimizaciones
import { useState, useEffect } from 'react';

export type DeviceQuality = 'low' | 'medium' | 'high';

export const useDeviceQuality = (): DeviceQuality => {
  const [quality, setQuality] = useState<DeviceQuality>('medium');

  useEffect(() => {
    // ✅ Solo ejecutar en el cliente para evitar errores SSR
    if (typeof window === 'undefined') return;
    
    const detectQuality = (): DeviceQuality => {
      try {
        // ✅ Detección de capacidad del dispositivo sin loader - siguiendo la guía
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!gl) return 'low';
        
        // GPU detection
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? 
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // ✅ GPU detection siguiendo recomendaciones de la comunidad
        if (renderer.includes('Mali') || renderer.includes('Adreno') || renderer.includes('PowerVR')) {
          return 'low'; // Mobile GPUs
        }
        
        if (renderer.includes('Intel') || renderer.includes('UHD')) {
          return 'medium'; // Integrated GPUs
        }
        
        // ✅ Detección adicional basada en performance
        const memoryInfo = (performance as any).memory;
        if (memoryInfo) {
          const totalMemory = memoryInfo.totalJSHeapSize / 1024 / 1024; // MB
          if (totalMemory < 100) return 'low';
          if (totalMemory < 500) return 'medium';
        }
        
        // ✅ Detección por devicePixelRatio y cores
        const pixelRatio = window.devicePixelRatio || 1;
        const cores = navigator.hardwareConcurrency || 2;
        
        if (pixelRatio < 2 && cores < 4) return 'low';
        if (pixelRatio >= 2 && cores >= 4) return 'high';
        
        return 'medium'; // Default fallback
      } catch (error) {
        console.warn('Error detecting device quality:', error);
        return 'medium'; // Safe fallback
      }
    };
    
    setQuality(detectQuality());
  }, []);

  return quality;
};
