# GemSection - Análisis de Buenas Prácticas y Optimizaciones

## 📊 Resumen Ejecutivo

**Fecha de Revisión:** 2025-10-25
**Herramientas de Análisis:** Context7 MCP, Claude Code
**Estado General:** 🟡 Bueno con Oportunidades de Mejora

### Métricas de Código
- **Archivos Analizados:** 7
- **Líneas de Código:** ~1,400
- **Frameworks:** Astro, React, Three.js, Zustand, Motion
- **Problemas Críticos:** 2
- **Problemas Moderados:** 6
- **Mejoras Recomendadas:** 8

---

## 🎯 Hallazgos Principales

### ✅ FORTALEZAS

#### 1. **Excelente Gestión de Estado con Zustand**
- ✅ Uso correcto de `useShallow` para prevenir re-renders innecesarios
- ✅ Stores divididos en slices por funcionalidad
- ✅ Batch updates implementados correctamente
- ✅ Comparaciones previas antes de actualizar estado

**Referencia:** GemBackground.tsx:136-169, SilkBackground.tsx:149-180

```typescript
// ✅ EXCELENTE: Uso de useShallow
const { isVisible, isPaused, isLoading } = useGemStore(
  useShallow((state) => ({
    isVisible: state.isVisible,
    isPaused: state.isPaused,
    isLoading: state.isLoading,
  }))
);
```

**Documentación Context7:** Esto previene re-renders cuando el objeto de selección cambia de referencia pero mantiene los mismos valores.

#### 2. **Optimizaciones de Performance Three.js**
- ✅ Intersection Observer con `rootMargin` amplio (800px)
- ✅ Page Visibility API para pausar renderizado
- ✅ Quality-based rendering (low/medium/high)
- ✅ Pixel ratio limitado a `Math.min(window.devicePixelRatio, 2)`
- ✅ Antialiasing deshabilitado en modo performance

**Referencia:** GemBackground.tsx:226-229, SilkBackground.tsx:273-280

```typescript
// ✅ EXCELENTE: Configuración optimizada del renderer
const renderer = new THREE.WebGLRenderer({
  antialias: false, // Disable for performance
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

#### 3. **Cleanup Exhaustivo de Recursos**
- ✅ Dispose de materiales y geometrías
- ✅ Cancelación de `requestAnimationFrame`
- ✅ Remoción de event listeners
- ✅ Cleanup de renderer y DOM

**Referencia:** SilkBackground.tsx:417-440, GemBackground.tsx:397-418

```typescript
// ✅ EXCELENTE: Cleanup completo
sceneRef.current.scene.traverse((child: THREE.Object3D) => {
  if (child instanceof THREE.Mesh) {
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(material => material.dispose());
      } else {
        child.material.dispose();
      }
    }
    if (child.geometry) {
      child.geometry.dispose();
    }
  }
});
```

#### 4. **Lazy Loading Implementado Correctamente**
- ✅ Uso de `client:visible` en componentes pesados
- ✅ Carga diferida de Three.js

**Referencia:** GemSection.astro:19, 29, 48

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. **Código Muerto y Redundancia**

#### **Problema:** GemCanvas.tsx y GemModel.tsx NO se están usando

**Archivos afectados:**
- `/three/GemCanvas.tsx` (203 líneas)
- `/three/GemModel.tsx` (182 líneas)

**Evidencia:**
```typescript
// GemSection.astro solo importa GemBackground
import GemBackground from './three/GemBackground.tsx';  // ✅ USADO
// GemCanvas y GemModel no aparecen en ningún import
```

**Impacto:**
- 🔴 **Bundle size innecesario:** ~12KB de código muerto
- 🔴 **Confusión en mantenimiento:** Desarrolladores pueden no saber qué archivo usar
- 🔴 **Stores Zustand duplicados:** `useGemStore` definido en 3 archivos diferentes

**Recomendación:**
```typescript
// OPCIÓN 1: Eliminar archivos no usados
// rm GemCanvas.tsx GemModel.tsx

// OPCIÓN 2: Documentar claramente el propósito
// README.md en /three/ explicando:
// - GemBackground.tsx: Implementación actual (USAR ESTE)
// - GemCanvas.tsx: Alternativa con @react-three/fiber (EXPERIMENTAL)
// - GemModel.tsx: Componente auxiliar para GemCanvas (NO USAR DIRECTAMENTE)
```

**Documentación Context7 - React Three Fiber:**
> "Cache and Re-use Assets with useLoader: React Three Fiber's useLoader automatically caches loaded assets. Accessing the same resource URL multiple times will re-use the same asset."

Si GemCanvas.tsx es una alternativa experimental, debería usar `useLoader` para compartir assets con GemBackground.

---

### 2. **Stores Zustand Duplicados**

#### **Problema:** Múltiples definiciones de stores similares

**Stores encontrados:**
1. `useGemStore` en GemBackground.tsx (líneas 10-121)
2. `useGemCanvasStore` en GemCanvas.tsx (líneas 7-26)
3. `useGemStore` en GemModel.tsx (líneas 7-30) ⚠️ **MISMO NOMBRE que #1**
4. `useSilkStore` en SilkBackground.tsx (líneas 9-135)

**Problemas:**
- 🔴 **Colisión de nombres:** Dos `useGemStore` diferentes
- 🟡 **Código duplicado:** Lógica similar repetida 4 veces
- 🟡 **Mantenimiento difícil:** Cambios deben aplicarse en múltiples lugares

**Recomendación:**

```typescript
// /stores/threeJSStore.ts - Store unificado
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface ThreeJSState {
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  opacity: number;
  quality: 'low' | 'medium' | 'high';
  // ... resto del estado
}

interface ThreeJSActions {
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  // ... resto de actions
}

export const useThreeJSStore = create<ThreeJSState & ThreeJSActions>((set, get) => ({
  // Estado inicial compartido
  isVisible: false,
  isPaused: false,
  isLoading: true,
  opacity: 0,
  quality: 'medium',

  // Actions optimizadas
  setVisible: (visible) => {
    const currentState = get();
    if (currentState.isVisible === visible) return;
    set({ isVisible: visible });
  },
  // ... resto
}));

// Hook personalizado con namespace
export const useGemStore = () => useThreeJSStore();
export const useSilkStore = () => useThreeJSStore();
```

**Documentación Context7 - Zustand:**
> "Optimize Renders with Zustand Selectors: Zustand requires manual optimization via selectors, while other libraries handle it through their atom-based systems."

---

## 🟡 PROBLEMAS MODERADOS

### 3. **Lógica de Dark Mode Duplicada**

#### **Problema:** Detección de dark mode implementada en 2 lugares

**Ubicaciones:**
1. `GemSection.astro` - Script inline (líneas 82-147)
2. `SilkBackground.tsx` - useEffect (líneas 184-252)

**Código duplicado:**
```javascript
// GemSection.astro:115-120
const detectDarkMode = (): boolean => {
  const hasClass = document.documentElement.classList.contains('dark-mode');
  const savedTheme = localStorage.getItem('aurin-theme');
  const isStoredDark = savedTheme === 'dark';
  return hasClass || isStoredDark;
};

// SilkBackground.tsx:186-193 (EXACTAMENTE EL MISMO CÓDIGO)
const detectDarkMode = (): boolean => {
  const hasClass = document.documentElement.classList.contains('dark-mode');
  const savedTheme = localStorage.getItem('aurin-theme');
  const isStoredDark = savedTheme === 'dark';
  return hasClass || isStoredDark;
};
```

**Recomendación:**

```typescript
// /utils/darkMode.ts
export const detectDarkMode = (): boolean => {
  const hasClass = document.documentElement.classList.contains('dark-mode');
  const savedTheme = localStorage.getItem('aurin-theme');
  return hasClass || savedTheme === 'dark';
};

export const observeDarkMode = (callback: (isDark: boolean) => void) => {
  // Detección inicial
  callback(detectDarkMode());

  // MutationObserver para cambios en clase
  const observer = new MutationObserver(() => {
    callback(detectDarkMode());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Storage listener para sincronización entre tabs
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'aurin-theme') callback(detectDarkMode());
  };
  window.addEventListener('storage', handleStorage);

  // Cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', handleStorage);
  };
};
```

**Uso:**
```typescript
// En componentes React
useEffect(() => {
  return observeDarkMode((isDark) => {
    setVisible(!isDark && isIntersecting);
  });
}, []);

// En scripts Astro
observeDarkMode((isDark) => applyDarkMode(isDark));
```

---

### 4. **Estilos Dinámicos Inyectados en Runtime**

#### **Problema:** SoftSkillsSlider inyecta estilos con JavaScript

**Referencia:** SoftSkillsSlider.tsx:136-310

```typescript
// ❌ PROBLEMA: FOUC potencial
useEffect(() => {
  const styleId = 'soft-skills-slider-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `/* 175 líneas de CSS */`;
    document.head.appendChild(style);
  }
}, []);
```

**Problemas:**
- 🟡 **FOUC (Flash of Unstyled Content):** Estilos se aplican después de que React monta
- 🟡 **SSR incompatible:** No funciona con Server-Side Rendering
- 🟡 **Bundle size:** CSS duplicado en JS bundle
- 🟡 **CSP (Content Security Policy):** Puede ser bloqueado por políticas de seguridad

**Recomendación:**

```typescript
// SoftSkillsSlider.module.css
.sliderCard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/SilkCardFallback.jpeg');
  background-size: cover;
  background-position: center;
  border-radius: inherit;
  z-index: -2;
}

:global(.dark-mode) .sliderCard::before {
  display: none !important;
}

/* ... resto de estilos ... */
```

```typescript
// SoftSkillsSlider.tsx
import styles from './SoftSkillsSlider.module.css';

// ✅ MEJOR: Usar CSS Modules
<motion.div className={styles.sliderCard}>
```

---

### 5. **Estilos Inline No Memoizados**

#### **Problema:** Objetos de estilo se recrean en cada render

**Referencia:** SoftSkillsSlider.tsx:7-89

```typescript
// ❌ PROBLEMA: Se crea nuevo objeto en cada render
const cardStyles: React.CSSProperties = {
  width: '100%',
  minHeight: '268px',
  // ... 20 propiedades más
};

function SoftSkillsSlider({ softSkillsData }) {
  return (
    <motion.div style={cardStyles}> {/* ❌ Nueva referencia cada render */}
```

**Impacto:**
- 🟡 **Re-renders innecesarios:** React detecta cambio de referencia
- 🟡 **Memory allocation:** GC trabaja más

**Recomendación:**

```typescript
// ✅ MEJOR: Definir fuera del componente
const CARD_STYLES: React.CSSProperties = {
  width: '100%',
  minHeight: '268px',
  padding: '20px',
  // ... resto
};

// O usar useMemo si depende de props
function SoftSkillsSlider({ softSkillsData }) {
  const cardStyles = useMemo(() => ({
    width: '100%',
    minHeight: '268px',
    // ...
  }), []); // Sin dependencias = solo se crea una vez
```

**Documentación Context7 - React Three Fiber:**
> "Re-use Geometries and Materials Globally in Three.js: Create these resources globally once and then apply them to multiple mesh components."

El mismo principio aplica para estilos React.

---

### 6. **Motion Scroll Listeners Múltiples**

#### **Problema:** 3 listeners separados para ejes de rotación

**Referencia:** GemBackground.tsx:382-395

```typescript
// ❌ PROBLEMA: 3 subscripciones separadas
const unsubscribeRotationX = rotationX.on('change', (value) => {
  const currentState = useGemStore.getState();
  setScrollRotation(value, currentState.scrollRotationY, currentState.scrollRotationZ);
});

const unsubscribeRotationY = rotationY.on('change', (value) => {
  const currentState = useGemStore.getState();
  setScrollRotation(currentState.scrollRotationX, value, currentState.scrollRotationZ);
});

const unsubscribeRotationZ = rotationZ.on('change', (value) => {
  const currentState = useGemStore.getState();
  setScrollRotation(currentState.scrollRotationX, currentState.scrollRotationY, value);
});
```

**Problemas:**
- 🟡 **Llamadas innecesarias:** Cada eje llama `getState()` 3 veces
- 🟡 **Race conditions potenciales:** Actualizaciones concurrentes

**Recomendación:**

```typescript
// ✅ MEJOR: Batch updates con requestAnimationFrame
useEffect(() => {
  let rafId: number | null = null;
  const pendingUpdates = { x: 0, y: 0, z: 0 };
  let hasUpdates = false;

  const scheduleUpdate = () => {
    if (rafId === null && hasUpdates) {
      rafId = requestAnimationFrame(() => {
        setScrollRotation(pendingUpdates.x, pendingUpdates.y, pendingUpdates.z);
        hasUpdates = false;
        rafId = null;
      });
    }
  };

  const unsubX = rotationX.on('change', (value) => {
    pendingUpdates.x = value;
    hasUpdates = true;
    scheduleUpdate();
  });

  const unsubY = rotationY.on('change', (value) => {
    pendingUpdates.y = value;
    hasUpdates = true;
    scheduleUpdate();
  });

  const unsubZ = rotationZ.on('change', (value) => {
    pendingUpdates.z = value;
    hasUpdates = true;
    scheduleUpdate();
  });

  return () => {
    unsubX();
    unsubY();
    unsubZ();
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}, [rotationX, rotationY, rotationZ]);
```

**Documentación Context7 - React Three Fiber:**
> "Sync Animations with On-Demand Rendering and Invalidate: Pre-emptively schedule a render using invalidate() and then start the animation in the subsequent frame using requestAnimationFrame."

---

### 7. **Assets Externos Sin Fallbacks Robustos**

#### **Problema:** URLs hardcodeadas sin estrategia de recuperación

**Referencias:**
- GemBackground.tsx:252: HDR environment
- GemBackground.tsx:314: Gem model
- GemModel.tsx:56: Gem model
- GemModel.tsx:59: HDR environment
- SoftSkillsSlider.tsx:151: Imagen de fondo

```typescript
// ❌ PROBLEMA: Sin fallback adecuado
hdrLoader.load('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/large_corridor_1k-1.hdr', (hdr) => {
  // Success
}, undefined, (error) => {
  console.error('Failed to create envMap:', error); // Solo log
});
```

**Recomendación:**

```typescript
// /utils/assetLoader.ts
interface AssetConfig {
  primary: string;
  fallback?: string;
  defaultValue?: any;
}

export class RobustAssetLoader {
  static async loadWithRetry<T>(
    loader: (url: string) => Promise<T>,
    config: AssetConfig,
    retries = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    // Intentar URL primaria
    for (let i = 0; i < retries; i++) {
      try {
        return await loader(config.primary);
      } catch (error) {
        lastError = error as Error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    // Intentar fallback
    if (config.fallback) {
      try {
        console.warn(`Primary asset failed, using fallback: ${config.fallback}`);
        return await loader(config.fallback);
      } catch (error) {
        console.error('Fallback also failed:', error);
      }
    }

    // Retornar valor por defecto o lanzar error
    if (config.defaultValue) {
      console.warn('Using default value for asset');
      return config.defaultValue;
    }

    throw lastError || new Error('Asset loading failed');
  }
}

// Uso:
const hdr = await RobustAssetLoader.loadWithRetry(
  (url) => new Promise((resolve, reject) => {
    new RGBELoader().load(url, resolve, undefined, reject);
  }),
  {
    primary: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/large_corridor_1k-1.hdr',
    fallback: '/assets/fallback-env.hdr', // Asset local
    defaultValue: null // Renderizar sin environment map
  }
);
```

---

### 8. **Detección de Calidad con Heurística Simple**

#### **Problema:** Detección de GPU basada solo en vendor string

**Referencia:** GemCanvas.tsx:80-101

```typescript
// ❌ PROBLEMA: Demasiado simple
const renderer = gl.getParameter(gl.RENDERER);
if (renderer.includes('Intel')) {
  useGemCanvasStore.getState().setQuality('low');
} else if (renderer.includes('NVIDIA') || renderer.includes('AMD')) {
  useGemCanvasStore.getState().setQuality('high');
}
```

**Problemas:**
- 🟡 **Intel modernas:** Muchas GPUs Intel actuales son capaces (Xe, Arc)
- 🟡 **Mobile:** No detecta GPUs mobile (Adreno, Mali, Apple GPU)
- 🟡 **No considera otros factores:** RAM, resolución, batería

**Recomendación:**

```typescript
// /utils/qualityDetection.ts
interface DeviceCapabilities {
  gpu: string;
  isMobile: boolean;
  memoryGB: number;
  maxTextureSize: number;
  cores: number;
}

export class QualityDetector {
  static detect(): 'low' | 'medium' | 'high' {
    const caps = this.getCapabilities();

    // Score system
    let score = 0;

    // GPU check (0-40 points)
    if (caps.gpu.includes('NVIDIA RTX') || caps.gpu.includes('AMD RX')) {
      score += 40;
    } else if (caps.gpu.includes('NVIDIA GTX') || caps.gpu.includes('AMD')) {
      score += 30;
    } else if (caps.gpu.includes('Intel Xe') || caps.gpu.includes('Intel Arc')) {
      score += 25;
    } else if (caps.gpu.includes('Apple')) {
      score += 35; // Apple Silicon es potente
    } else {
      score += 10;
    }

    // Memory check (0-20 points)
    if (caps.memoryGB >= 8) score += 20;
    else if (caps.memoryGB >= 4) score += 10;
    else score += 0;

    // Mobile penalty (0-20 points)
    score += caps.isMobile ? 0 : 20;

    // CPU cores (0-20 points)
    if (caps.cores >= 8) score += 20;
    else if (caps.cores >= 4) score += 10;
    else score += 5;

    // Decide quality
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private static getCapabilities(): DeviceCapabilities {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    return {
      gpu: gl ? gl.getParameter(gl.RENDERER) : 'Unknown',
      isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
      memoryGB: (navigator as any).deviceMemory || 4,
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
      cores: navigator.hardwareConcurrency || 2
    };
  }
}
```

---

## 💡 MEJORAS RECOMENDADAS

### 9. **CSS con !important Excesivo**

**Referencia:** SoftSkillsSlider.tsx - Múltiples usos de `!important`

```css
/* ❌ PROBLEMA: 68 instancias de !important */
background: rgba(255, 255, 255, 0.9) !important;
border: 1px solid rgba(74, 36, 181, 0.2) !important;
/* ... */
```

**Recomendación:**
- Aumentar especificidad de selectores en lugar de `!important`
- Usar CSS Modules con estilos locales
- Solo usar `!important` para overrides de terceros (Splide)

---

### 10. **Optimización de Bundle Size de Splide**

**Problema:** Splide completo cargado solo para mobile

**Recomendación:**

```typescript
// ✅ MEJOR: Lazy load condicional
const SplideAsync = lazy(() => {
  if (window.innerWidth < 768) {
    return import('@splidejs/react-splide');
  }
  return Promise.resolve({ default: () => null });
});
```

---

## 📋 PLAN DE ACCIÓN RECOMENDADO

### Prioridad Alta (Implementar en Sprint Actual)

1. **Eliminar código muerto** (GemCanvas, GemModel) o documentar claramente
   - Ahorro estimado: ~12KB bundle
   - Tiempo: 1 hora

2. **Unificar stores Zustand**
   - Mejora mantenibilidad
   - Tiempo: 2-3 horas

3. **Extraer lógica de dark mode a utility**
   - Elimina duplicación
   - Tiempo: 1 hora

### Prioridad Media (Próximo Sprint)

4. **Mover estilos dinámicos a CSS Modules**
   - Mejora SSR y previene FOUC
   - Tiempo: 2 horas

5. **Optimizar motion scroll listeners**
   - Batch updates con RAF
   - Tiempo: 1 hora

6. **Implementar fallbacks para assets**
   - Mejora resiliencia
   - Tiempo: 2-3 horas

### Prioridad Baja (Backlog)

7. **Mejorar detección de calidad GPU**
   - Mejor experiencia en más dispositivos
   - Tiempo: 2-3 horas

8. **Reducir uso de !important**
   - Refactorizar estilos
   - Tiempo: 1-2 horas

9. **Lazy load condicional de Splide**
   - Optimización bundle
   - Tiempo: 1 hora

---

## 📚 Referencias y Documentación

### Context7 - React Three Fiber
- [Performance Optimization](https://context7.com/pmndrs/react-three-fiber)
- [On-Demand Rendering](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- [Memory Management](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/pitfalls.mdx)

### Context7 - Zustand
- [Selector Optimization](https://context7.com/pmndrs/zustand)
- [useShallow Hook](https://github.com/pmndrs/zustand/blob/main/docs/hooks/use-shallow.md)
- [Best Practices](https://github.com/pmndrs/zustand/blob/main/docs/getting-started/comparison.md)

### Context7 - Three.js
- [WebGL Renderer](https://context7.com/context7/threejs)
- [Memory Disposal](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)

---

## 🎓 Conclusión

La sección **GemSection** está bien implementada con muchas optimizaciones correctas, especialmente en:
- Gestión de estado con Zustand
- Cleanup de recursos Three.js
- Lazy loading de componentes

Sin embargo, hay oportunidades significativas de mejora en:
- Eliminar código duplicado/muerto
- Consolidar stores
- Mejorar estrategia de carga de assets
- Optimizar bundle size

**Calificación General: 7.5/10** 🟡

Con las mejoras recomendadas, esta sección puede alcanzar un **9/10** en calidad de código y performance.

---

**Documento generado por:** Claude Code + Context7 MCP
**Última actualización:** 2025-10-25
