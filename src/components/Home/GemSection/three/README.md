# Three.js Components - GemSection

Este directorio contiene los componentes Three.js para la sección GemSection.

## 📁 Estructura de Archivos

### 🟢 Componentes en Uso

#### `GemBackground.tsx` ⭐ **USAR ESTE**
- **Estado:** ✅ Activo - Implementación actual en producción
- **Descripción:** Componente Three.js puro que renderiza la gema 3D con efectos físicos
- **Características:**
  - Implementación nativa de Three.js (sin react-three-fiber)
  - Store Zustand optimizado con `useShallow`
  - Scroll-based rotation con Motion.dev
  - Intersection Observer para lazy rendering
  - Quality-based rendering (low/medium/high)
  - Cleanup exhaustivo de recursos WebGL
- **Usado en:** `GemSection.astro:19`
- **Dependencias:** Three.js, Zustand, Motion/React

#### `SilkBackground.tsx` ⭐ **USAR ESTE**
- **Estado:** ✅ Activo - Implementación actual en producción
- **Descripción:** Background con efecto de seda usando shaders personalizados
- **Características:**
  - Shader personalizado para efecto silk/satin
  - Dark mode aware (se oculta en modo oscuro)
  - Optimizaciones de performance similares a GemBackground
  - Intersection Observer + Page Visibility API
- **Usado en:** `GemSection.astro:29` (dentro de skill cards)
- **Dependencias:** Three.js, Zustand

---

### 🟡 Componentes Experimentales

#### `GemCanvas.tsx` ⚠️ **EXPERIMENTAL - NO USAR**
- **Estado:** 🔶 Experimental - Alternativa con react-three-fiber
- **Descripción:** Implementación alternativa usando `@react-three/fiber`
- **Por qué existe:**
  - Experimento con react-three-fiber para comparar performance
  - Usa el approach declarativo de R3F vs imperativo de Three.js puro
  - Prueba de concepto para futuras migraciones
- **Por qué NO se usa:**
  - Bundle size mayor (~40KB adicionales de R3F)
  - Performance similar pero con overhead de React reconciliation
  - Menos control fino sobre el render loop
- **Futuro:** Mantener para referencia o eliminar si no se planea usar R3F
- **Dependencias:** @react-three/fiber, Three.js, Zustand

#### `GemModel.tsx` ⚠️ **EXPERIMENTAL - NO USAR DIRECTAMENTE**
- **Estado:** 🔶 Componente auxiliar de GemCanvas
- **Descripción:** Modelo de gema para usar dentro de `<Canvas>` de R3F
- **Relación:** Este componente es hijo de `GemCanvas.tsx`
- **Por qué NO se usa directamente:**
  - Requiere contexto de react-three-fiber (`<Canvas>`)
  - Solo funciona dentro de GemCanvas
  - No es standalone
- **Futuro:** Si se elimina GemCanvas, eliminar este también

---

## 🔄 Migraciones y Refactorings

### Historia de Implementaciones

1. **v1 - GemCanvas + GemModel** (Experimental)
   - Primera implementación con react-three-fiber
   - Approach declarativo
   - Bundle: ~52KB (R3F + componentes)

2. **v2 - GemBackground** (Actual) ✅
   - Reescrito con Three.js puro
   - Más control sobre rendering
   - Bundle: ~40KB (solo Three.js)
   - **Ganancia:** -12KB, mejor performance

### Por qué Three.js Puro > React Three Fiber (para este caso)

| Aspecto | GemBackground (Three.js) | GemCanvas (R3F) |
|---------|-------------------------|----------------|
| Bundle Size | ~40KB | ~52KB |
| Control de Render | Completo | Mediado por React |
| Performance | Óptimo | Muy bueno |
| Complejidad | Media | Baja |
| Debugging | Directo | A través de R3F |

**Conclusión:** Para un solo objeto 3D con animaciones simples, Three.js puro es más eficiente.

---

## 📋 Stores Zustand

### ⚠️ IMPORTANTE - Stores Duplicados

Actualmente hay **4 stores diferentes** en estos archivos:

1. `useGemStore` en `GemBackground.tsx` ✅ **EN USO**
2. `useSilkStore` en `SilkBackground.tsx` ✅ **EN USO**
3. `useGemCanvasStore` en `GemCanvas.tsx` ⚠️ **NO SE USA**
4. `useGemStore` en `GemModel.tsx` ⚠️ **COLISIÓN DE NOMBRES**

**🚨 Problema:** Hay 2 stores llamados `useGemStore` (colisión)

**✅ Solución Planificada:** Ver `BEST_PRACTICES.md` sección "Stores Zustand Duplicados"
- Crear store unificado en `/utils/stores/threeJSStore.ts`
- Exportar hooks personalizados por namespace
- Migrar componentes activos al nuevo store

---

## 🎯 Decisión Rápida

### "¿Qué archivo debo modificar?"

```
┌─────────────────────────────────────────────┐
│ ¿Qué quieres hacer?                        │
├─────────────────────────────────────────────┤
│                                             │
│ Modificar la gema 3D                       │
│ → GemBackground.tsx ✅                      │
│                                             │
│ Modificar el efecto silk/satin             │
│ → SilkBackground.tsx ✅                     │
│                                             │
│ Experimentar con React Three Fiber         │
│ → GemCanvas.tsx + GemModel.tsx ⚠️          │
│   (pero considera crear en /experimental)  │
│                                             │
│ Cambiar stores Zustand                     │
│ → ¡ESPERA! Ver BEST_PRACTICES.md primero   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🧹 Cleanup Pendiente

### Acciones Recomendadas

**Opción A - Eliminar código experimental** (si no se planea usar R3F)
```bash
# Guardar backup primero
mkdir -p ../experimental
mv GemCanvas.tsx ../experimental/
mv GemModel.tsx ../experimental/
```

**Opción B - Mantener como referencia** (actual)
- ✅ Mantener este README.md
- ✅ Documentar claramente que NO están en uso
- ⚠️ Considerar mover a `/experimental` en el futuro

**Opción C - Migrar completamente a R3F** (proyecto grande)
- Requiere migrar SilkBackground también
- Ventaja: Approach más "React-like"
- Desventaja: Bundle size mayor
- Tiempo estimado: 1-2 sprints

---

## 📚 Referencias

- **BEST_PRACTICES.md:** Análisis completo de código
- **Three.js Docs:** https://threejs.org/docs/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber
- **Zustand:** https://docs.pmnd.rs/zustand

---

**Última actualización:** 2025-10-25
**Autor:** Claude Code Review
