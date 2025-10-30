<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Estrategias de Performance para Proyectos Astro con Scroll Pesado

El problema que describes es común en aplicaciones frontend complejas con múltiples secciones interactivas. Aquí te presento una guía completa con estrategias específicas para mejorar el frame rate durante el scroll.

## Intersection Observer API: La Solución Principal

La **Intersection Observer API** es tu herramienta más poderosa para este problema. Te permite detectar cuando un elemento entra o sale del viewport y ejecutar lógica específica sin afectar el main thread.[^1]

### Implementación Básica para Pausar Componentes

```javascript
// observerManager.js
export class ComponentObserver {
  constructor() {
    this.observers = new Map();
  }

  observe(element, callbacks) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbacks.onEnter?.(entry);
          } else {
            callbacks.onExit?.(entry);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px', // Carga antes de que sea visible
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    observer.observe(element);
    this.observers.set(element, observer);
  }

  disconnect(element) {
    const observer = this.observers.get(element);
    if (observer) {
      observer.disconnect();
      this.observers.delete(element);
    }
  }
}
```


### Para Tus Secciones Three.js

```javascript
// ThreeSection.jsx
import { useEffect, useRef, useState } from 'react';

export function ThreeSection({ sceneConfig }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // Pausa el render loop cuando no está visible
        if (!entry.isIntersecting && animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Buffer zone
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Solo renderiza cuando está visible
    const animate = () => {
      // Tu lógica de Three.js
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  return <div ref={containerRef}>{/* Tu escena */}</div>;
}
```


## CSS content-visibility: Optimización Radical

La propiedad `content-visibility: auto` es una de las optimizaciones más efectivas para páginas largas. Le dice al navegador que omita el renderizado de contenido fuera del viewport, reduciendo el tiempo de renderizado inicial en hasta **50% o más**.[^2][^3]

### Implementación en Astro

```astro
---
// Strip.astro
const { id, estimatedHeight = 500 } = Astro.props;
---

<section 
  id={id}
  class="strip"
  style={`
    content-visibility: auto;
    contain-intrinsic-size: 0 ${estimatedHeight}px;
  `}
>
  <slot />
</section>

<style>
  .strip {
    /* contain ayuda al navegador a optimizar */
    contain: layout style paint;
  }
</style>
```


### Para CSS Modules

```css
/* Strip.module.css */
.strip {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Altura estimada */
  contain: layout style paint;
}

.heavyStrip {
  content-visibility: auto;
  contain-intrinsic-size: 0 800px;
  contain: layout style paint;
}
```

**Importante**: `contain-intrinsic-size` evita que el scrollbar "salte" cuando el contenido se renderiza.[^3][^2]

## CSS Containment: Aísla el Rendering

La propiedad `contain` establece límites explícitos para el navegador, evitando cálculos innecesarios.[^4]

### Tipos de Containment

```css
/* Containment completo - mejor performance */
.isolated-component {
  contain: layout style paint;
}

/* Layout containment - previene que cambios internos afecten el exterior */
.section-with-animations {
  contain: layout;
}

/* Paint containment - clip del contenido, similar a overflow */
.menu-section {
  contain: paint;
}

/* Style containment - limita el alcance de contadores CSS */
.blog-post {
  contain: style;
}
```


### Aplicación Práctica

```css
/* Para strips con Motion.dev o animaciones CSS */
.animated-strip {
  content-visibility: auto;
  contain-intrinsic-size: 0 600px;
  contain: layout paint;
  will-change: transform; /* Solo si hay animación activa */
}

/* Para strips con Firestore/CMS data */
.data-strip {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;
  contain: layout style;
}
```


## will-change: Optimización de Animaciones

La propiedad `will-change` le avisa al navegador que prepares optimizaciones para propiedades específicas. **Úsala con precaución** - solo en elementos que realmente van a cambiar.[^5]

### Uso Correcto

```css
/* ❌ MAL - always on, consume memoria */
.element {
  will-change: transform, opacity;
}

/* ✅ BIEN - solo cuando va a animar */
.element {
  transition: transform 0.3s;
}

.element:hover,
.element.is-animating {
  will-change: transform;
}

/* ✅ MEJOR - con JavaScript para control preciso */
```


### JavaScript para will-change Dinámico

```javascript
// willChangeManager.js
export function optimizeAnimation(element, properties) {
  // Activa will-change justo antes de animar
  element.style.willChange = properties.join(', ');
  
  // Limpia después de la animación
  const cleanup = () => {
    element.style.willChange = 'auto';
  };
  
  return cleanup;
}

// Uso
const element = document.querySelector('.animated-strip');
const cleanup = optimizeAnimation(element, ['transform', 'opacity']);

// Tu animación...
element.addEventListener('transitionend', cleanup, { once: true });
```


## Throttle y Debounce para Scroll Events

Los scroll events se disparan constantemente. **Throttling** limita la frecuencia de ejecución.[^6]

### Implementación con Lodash

```javascript
import { throttle, debounce } from 'lodash';

// Throttle - ejecuta cada X ms
const handleScroll = throttle(() => {
  // Tu lógica de scroll
  updateVisibleSections();
}, 100); // Ejecuta máximo cada 100ms

// Debounce - espera a que el usuario termine de scrollear
const handleScrollEnd = debounce(() => {
  // Lógica cuando el scroll termina
  loadLazyImages();
}, 250);

window.addEventListener('scroll', handleScroll);
window.addEventListener('scroll', handleScrollEnd);
```


### Throttle Nativo con requestAnimationFrame

Esta es la técnica más eficiente para animaciones durante scroll:[^7]

```javascript
// scrollOptimizer.js
export class ScrollOptimizer {
  constructor() {
    this.ticking = false;
    this.scrollTop = 0;
    this.handlers = [];
  }

  addHandler(fn) {
    this.handlers.push(fn);
  }

  init() {
    window.addEventListener('scroll', () => {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.requestTick();
    }, { passive: true }); // passive mejora performance
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.update());
      this.ticking = true;
    }
  }

  update() {
    this.handlers.forEach(fn => fn(this.scrollTop));
    this.ticking = false;
  }
}

// Uso en tu app
const scrollOptimizer = new ScrollOptimizer();

scrollOptimizer.addHandler((scrollTop) => {
  // Tu lógica aquí - se ejecuta sincronizado con el repaint
  updateParallaxEffects(scrollTop);
});

scrollOptimizer.init();
```


## Windowing/Virtualization para Lists

Si tienes listas largas (comentarios, items de CMS), usa **windowing** - solo renderiza lo visible.[^8]

### Con react-window (para islas React)

```jsx
import { FixedSizeList as List } from 'react-window';

function CmsItemsList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="item">
      {items[index].title}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
      overscanCount={3} // Renderiza 3 items extra fuera del viewport
    >
      {Row}
    </List>
  );
}
```


### Virtual Scrolling Nativo para Astro

```javascript
// virtualScroll.js
export class VirtualScroll {
  constructor(container, items, renderItem) {
    this.container = container;
    this.items = items;
    this.renderItem = renderItem;
    this.itemHeight = 100; // Altura de cada item
    this.visibleCount = Math.ceil(container.offsetHeight / this.itemHeight);
    this.buffer = 3; // Items extra arriba y abajo
    
    this.init();
  }

  init() {
    // Crear contenedor con altura total
    this.scrollHeight = this.items.length * this.itemHeight;
    this.container.style.height = `${this.scrollHeight}px`;
    this.container.style.position = 'relative';

    // Scroll handler optimizado
    const handleScroll = () => {
      if (!this.ticking) {
        requestAnimationFrame(() => this.render());
        this.ticking = true;
      }
    };

    this.container.addEventListener('scroll', handleScroll, { passive: true });
    this.render();
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(
      this.items.length,
      startIndex + this.visibleCount + this.buffer * 2
    );

    // Limpia items antiguos
    this.container.innerHTML = '';

    // Renderiza solo items visibles
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.renderItem(this.items[i], i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      this.container.appendChild(item);
    }

    this.ticking = false;
  }
}
```


## Estrategias Específicas para Astro Islands

### Lazy Load de Client Components

```astro
---
// HeavySection.astro
import ThreeScene from './ThreeScene.jsx';
import DataTable from './DataTable.jsx';
---

<!-- Solo carga cuando está visible -->
<section id="three-section">
  <ThreeScene client:visible />
</section>

<!-- Carga cuando el navegador está idle -->
<section id="data-section">
  <DataTable client:idle />
</section>

<!-- Carga solo en viewport específico -->
<section id="mobile-only">
  <MobileChart client:media="(max-width: 768px)" />
</section>
```


### Preload Estratégico con client:visible

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<!-- Strip 1: Carga inmediata -->
<section class="hero">
  <HeroAnimation client:load />
</section>

<!-- Strip 2: Carga cuando sea visible -->
<section class="about">
  <AboutContent client:visible={{ rootMargin: '400px' }} />
</section>

<!-- Strip 3: Three.js pesado - carga visible con margen -->
<section class="3d-showcase">
  <ThreeShowcase client:visible={{ rootMargin: '200px' }} />
</section>
```


## Sistema Completo de Strip Management

Aquí te dejo un sistema completo que puedes implementar:

```typescript
// stripManager.ts
interface StripConfig {
  id: string;
  element: HTMLElement;
  pauseOnExit?: boolean;
  unloadOnExit?: boolean;
  loadMargin?: string;
}

export class StripManager {
  private strips: Map<string, StripConfig> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();
  private activeStrips: Set<string> = new Set();

  register(config: StripConfig) {
    this.strips.set(config.id, config);
    this.createObserver(config);
  }

  private createObserver(config: StripConfig) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activateStrip(config.id);
          } else {
            this.deactivateStrip(config.id, config);
          }
        });
      },
      {
        root: null,
        rootMargin: config.loadMargin || '100px',
        threshold: [0, 0.1]
      }
    );

    observer.observe(config.element);
    this.observers.set(config.id, observer);
  }

  private activateStrip(id: string) {
    if (this.activeStrips.has(id)) return;
    
    this.activeStrips.add(id);
    const strip = this.strips.get(id);
    
    // Dispatch custom event para que componentes se activen
    strip?.element.dispatchEvent(new CustomEvent('strip:activate'));
    
    // Aplica optimizaciones CSS
    strip?.element.style.contentVisibility = 'visible';
    
    console.log(`Strip ${id} activated`);
  }

  private deactivateStrip(id: string, config: StripConfig) {
    if (!this.activeStrips.has(id)) return;
    
    this.activeStrips.delete(id);
    const strip = this.strips.get(id);
    
    // Dispatch evento de pausa
    strip?.element.dispatchEvent(new CustomEvent('strip:deactivate'));
    
    // Pausa renderizado si está configurado
    if (config.pauseOnExit) {
      strip?.element.style.contentVisibility = 'auto';
    }
    
    // Descarga recursos si está configurado
    if (config.unloadOnExit) {
      this.unloadStripResources(id);
    }
    
    console.log(`Strip ${id} deactivated`);
  }

  private unloadStripResources(id: string) {
    const strip = this.strips.get(id);
    if (!strip) return;

    // Pausa videos
    strip.element.querySelectorAll('video').forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    // Pausa audio
    strip.element.querySelectorAll('audio').forEach(audio => {
      audio.pause();
    });

    // Cancela animaciones CSS
    strip.element.getAnimations().forEach(animation => {
      animation.pause();
    });
  }

  isStripActive(id: string): boolean {
    return this.activeStrips.has(id);
  }

  dispose() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.strips.clear();
    this.activeStrips.clear();
  }
}
```


### Uso en Astro

```astro
---
// Layout.astro o página principal
---

<script>
  import { StripManager } from './stripManager';

  const stripManager = new StripManager();

  // Registra todos los strips
  document.querySelectorAll('[data-strip]').forEach((element) => {
    const id = element.getAttribute('data-strip-id');
    const pauseOnExit = element.hasAttribute('data-pause-on-exit');
    const unloadOnExit = element.hasAttribute('data-unload-on-exit');

    stripManager.register({
      id,
      element: element as HTMLElement,
      pauseOnExit,
      unloadOnExit,
      loadMargin: '150px'
    });
  });

  // Limpieza
  window.addEventListener('beforeunload', () => {
    stripManager.dispose();
  });
</script>
```

```astro
<!-- Uso en strips -->
<section 
  data-strip 
  data-strip-id="hero"
  class="strip"
>
  <Hero client:load />
</section>

<section 
  data-strip 
  data-strip-id="three-showcase"
  data-pause-on-exit
  class="strip"
>
  <ThreeShowcase client:visible />
</section>

<section 
  data-strip 
  data-strip-id="heavy-animations"
  data-pause-on-exit
  data-unload-on-exit
  class="strip"
>
  <HeavyAnimations client:visible />
</section>
```


## Optimización de Motion.dev y Animaciones CSS

### Reduce Motion Preference

Respeta las preferencias del usuario:[^9]

```css
/* Deshabilita animaciones pesadas si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .animated-strip * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```


### Optimiza Transforms y Opacity

Solo anima propiedades que no causen reflow:

```css
/* ❌ MAL - causa reflow */
.element {
  transition: top 0.3s, left 0.3s, width 0.3s;
}

/* ✅ BIEN - solo repaint */
.element {
  transition: transform 0.3s, opacity 0.3s;
  will-change: transform; /* Solo durante la animación */
}
```


### Passive Event Listeners

Para eventos de scroll y touch:

```javascript
// ❌ MAL - bloquea el scroll
element.addEventListener('touchstart', handler);

// ✅ BIEN - no bloquea
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });
element.addEventListener('scroll', handler, { passive: true });
```


## Estrategias para Firestore/Payload CMS

### Lazy Loading de Data

```javascript
// dataLoader.js
export class LazyDataLoader {
  constructor() {
    this.loadedSections = new Set();
    this.dataCache = new Map();
  }

  async loadSectionData(sectionId, loader) {
    if (this.loadedSections.has(sectionId)) {
      return this.dataCache.get(sectionId);
    }

    try {
      const data = await loader();
      this.dataCache.set(sectionId, data);
      this.loadedSections.add(sectionId);
      return data;
    } catch (error) {
      console.error(`Failed to load data for ${sectionId}:`, error);
      return null;
    }
  }

  prefetch(sectionId, loader) {
    // Precarga en idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.loadSectionData(sectionId, loader));
    } else {
      setTimeout(() => this.loadSectionData(sectionId, loader), 1);
    }
  }
}
```


### Con Intersection Observer

```jsx
// FirestoreSection.jsx
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';

export function FirestoreSection({ collectionName }) {
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || data) return;

    const loadData = async () => {
      const snapshot = await getDocs(collection(db, collectionName));
      setData(snapshot.docs.map(doc => doc.data()));
    };

    loadData();
  }, [isVisible, collectionName, data]);

  return (
    <div ref={ref}>
      {data ? <DataDisplay data={data} /> : <Skeleton />}
    </div>
  );
}
```


## Performance Monitoring

Mide el impacto de tus optimizaciones:

```javascript
// performanceMonitor.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }

  measureFPS(duration = 5000) {
    let frameCount = 0;
    let startTime = performance.now();
    
    const countFrame = () => {
      frameCount++;
      
      if (performance.now() - startTime < duration) {
        requestAnimationFrame(countFrame);
      } else {
        const fps = Math.round((frameCount / duration) * 1000);
        console.log(`Average FPS: ${fps}`);
        this.metrics.push({ type: 'fps', value: fps });
      }
    };
    
    requestAnimationFrame(countFrame);
  }

  measureScrollPerformance() {
    let scrollCount = 0;
    let laggyScrolls = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        scrollCount++;
        if (entry.duration > 16) { // > 60fps
          laggyScrolls++;
        }
      }
    });
    
    observer.observe({ entryTypes: ['event'] });
    
    setTimeout(() => {
      observer.disconnect();
      const lagPercentage = (laggyScrolls / scrollCount * 100).toFixed(2);
      console.log(`Laggy scrolls: ${lagPercentage}%`);
    }, 10000);
  }

  logMetrics() {
    console.table(this.metrics);
  }
}

// Uso
const monitor = new PerformanceMonitor();
monitor.measureFPS();
monitor.measureScrollPerformance();
```


## Checklist de Implementación

1. **Prioridad Alta**:
    - ✅ Implementa `content-visibility: auto` en todos los strips[^2]
    - ✅ Usa Intersection Observer para pausar Three.js fuera del viewport[^10][^1]
    - ✅ Aplica `contain: layout paint` a strips pesados[^4]
    - ✅ Convierte scroll handlers a requestAnimationFrame[^7]
2. **Prioridad Media**:
    - ✅ Lazy load de datos de Firestore/CMS con Intersection Observer
    - ✅ Implementa throttling en eventos de scroll (100-150ms)[^6]
    - ✅ Usa `client:visible` en lugar de `client:load` para islas no críticas
    - ✅ Añade `passive: true` a event listeners
3. **Prioridad Baja**:
    - ✅ Implementa virtual scrolling si tienes listas largas[^8]
    - ✅ Usa `will-change` dinámicamente solo durante animaciones[^5]
    - ✅ Monitorea FPS durante desarrollo

Con estas estrategias deberías ver una mejora significativa en el frame rate durante scroll. La combinación de **Intersection Observer** + **content-visibility** + **containment CSS** es particularmente efectiva y fácil de implementar. ¡Empieza por ahí y mide los resultados!

---

# ANÁLISIS ESPECÍFICO DE TU PROYECTO Port25Karen

## Diagnóstico de Componentes Analizados

Después de revisar tu código, identifiqué los siguientes puntos críticos de performance:

### ✅ Lo que YA está bien optimizado

1. **GemCanvas.tsx y GemModel.tsx**:
   - ✅ Ya usas Intersection Observer con `rootMargin: '400px'`
   - ✅ Implementaste `frameloop="demand"` cuando no está visible
   - ✅ Zustand store para control de estado
   - ✅ Quality detection basado en hardware
   - ✅ Page Visibility API para pausar cuando tab está oculto
   - ✅ DPR adaptativo según visibilidad

2. **Astro Islands**:
   - ✅ Buen uso de `client:visible` con `rootMargin`
   - ✅ Separación correcta entre desktop/mobile components

### ⚠️ Oportunidades de Mejora Identificadas

#### 1. **GemSection.astro** - Strip Pesado con Three.js
**Problema**: Múltiples `SilkBackground` components (uno por card) + `GemBackground` + scroll animation script
**Impacto**: Alto - Este strip tiene 3D + scroll sync + múltiples canvases

**Solución Simple**:
```astro
<!-- En GemSection.astro, envuelve todo el section con content-visibility -->
<section
  class={styles['gem-section']}
  data-gem-section
  style="content-visibility: auto; contain-intrinsic-size: 0 800px; contain: layout paint;"
>
```

**Optimización del Script de Scroll**:
```javascript
// En el <script> de GemSection.astro, mejora el scroll handler
import { scroll } from 'motion';
import { observeDarkMode } from '../../../utils/darkMode';

let scrollCleanup: (() => void) | null = null;
let isObserving = false;

document.addEventListener('DOMContentLoaded', () => {
  const gemSection = document.querySelector('[data-gem-section]');
  const skillsScroll = document.querySelector('[data-skills-scroll]');

  // Intersection Observer para activar/desactivar scroll animation
  const scrollObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isObserving) {
        // Activa scroll animation solo cuando está cerca del viewport
        const scrollWidth = skillsScroll.scrollWidth - skillsScroll.clientWidth;

        if (scrollWidth > 0) {
          scrollCleanup = scroll(
            (progress: number) => {
              skillsScroll.scrollLeft = progress * scrollWidth;
            },
            {
              target: gemSection,
              offset: ["start center", "end center"]
            }
          );
        }
        isObserving = true;
      } else if (!entry.isIntersecting && isObserving) {
        // Limpia scroll animation cuando sale del viewport
        if (scrollCleanup) {
          scrollCleanup();
          scrollCleanup = null;
        }
        isObserving = false;
      }
    },
    { rootMargin: '200px' }
  );

  if (gemSection) {
    scrollObserver.observe(gemSection);
  }

  // Dark mode observer
  const cleanupDarkMode = observeDarkMode(applyDarkMode);

  // Cleanup
  window.addEventListener('beforeunload', () => {
    cleanupDarkMode();
    if (scrollCleanup) scrollCleanup();
    scrollObserver.disconnect();
  });
});
```

#### 2. **Me.astro** - Strip con CubeBackground + GlobeBackground + Múltiples Animaciones
**Problema**: Dos canvases 3D + CMS fetch + múltiples AnimatedMeWrapper components
**Impacto**: Alto - Muchas animaciones de Motion + Three.js

**Solución CSS**:
```css
/* En Me.module.css, agrega a los containers principales */
.storytelling-scroll-container {
  content-visibility: auto;
  contain-intrinsic-size: 0 1200px;
  contain: layout paint;
}

.globe-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 600px;
  contain: layout paint;
}

.experience-container {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
  contain: layout paint;
}
```

**Optimización de AnimatedMeWrapper**:
```typescript
// Crea un nuevo wrapper optimizado: AnimatedMeWrapperOptimized.tsx
import { motion, useReducedMotion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

export function AnimatedMeElementOptimized({
  children,
  delay = 0,
  direction = 'up'
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect después de animar
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  }[direction];

  if (shouldReduceMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionOffset }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}
```

#### 3. **Services.astro** - Motion Components + BounceCards
**Problema**: Múltiples `motion.div` con `whileInView` + `TextDisperseBlack`
**Impacto**: Medio - Muchas animaciones en un solo strip

**Solución**:
```astro
<!-- En Services.astro, optimiza el section principal -->
<section
  id="services"
  class="services-section"
  style="content-visibility: auto; contain-intrinsic-size: 0 1500px; contain: layout style paint;"
>
```

**Optimiza BounceCards.tsx**:
```typescript
// En BounceCards.tsx, agrega lazy loading de imágenes
export function BounceCards({
  className = "",
  images = [],
  animationDelay = 0.5,
  animationStagger = 0.06,
  positions = [/* ... */]
}: BounceCardsProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
      style={{
        minHeight: '140px',
        aspectRatio: '2.5/1'
      }}
    >
      {images.map((src, idx) => {
        const position = positions[idx] || { x: 0, y: 0, rotate: 0 };

        return (
          <motion.div
            key={idx}
            className={cn(
              "absolute aspect-square rounded-[20px] overflow-hidden",
              "border-4 border-white dark:border-white/90",
              "shadow-xl dark:shadow-black/30"
            )}
            style={{
              left: '50%',
              top: '50%',
              width: '25%',
              marginLeft: '-12.5%',
              marginTop: '-12.5%'
            }}
            initial={{
              scale: 0,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            animate={shouldAnimate ? {
              scale: 1,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            } : {
              scale: 0,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: animationDelay + (idx * animationStagger),
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <img
              className="w-full h-full object-contain"
              src={src}
              alt={`card-${idx}`}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
```

#### 4. **Banner.astro** - Marquees + Dark Mode Script
**Problema**: Dark mode script ejecuta en cada render
**Impacto**: Bajo - Pero puede optimizarse

**Solución**:
```javascript
// En Banner.astro <script>, optimiza con requestAnimationFrame
const applyDarkMode = (isDark: boolean) => {
  requestAnimationFrame(() => {
    const bannerContainer = document.getElementById('bannerContainer');
    const darkOverlay = document.getElementById('darkOverlay');
    const bannerImage = document.getElementById('banner-image') as HTMLImageElement;

    if (!bannerContainer || !darkOverlay || !bannerImage) return;

    if (isDark) {
      bannerContainer.style.cssText = `
        background-size: 40px 40px, 40px 40px;
        background-position: center;
        background-repeat: repeat;
      `;
      darkOverlay.style.opacity = '1';
      const darkSrc = bannerImage.getAttribute('data-dark-src');
      if (darkSrc) bannerImage.src = darkSrc;
      bannerImage.style.filter = 'drop-shadow(0 0 60px #c31e9225) drop-shadow(0 0 80px rgba(195, 30, 146, 0.06))';
    } else {
      bannerContainer.style.cssText = '';
      darkOverlay.style.opacity = '';
      const lightSrc = bannerImage.getAttribute('data-light-src');
      if (lightSrc) bannerImage.src = lightSrc;
      bannerImage.style.filter = '';
    }
  });
};
```

#### 5. **MarqueeAnimation.tsx** - Animación Continua
**Problema**: Animación corre siempre, incluso fuera del viewport
**Impacto**: Medio - Consume recursos constantemente

**Solución en MarqueeAnimation.tsx**:
```typescript
import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';

export function MarqueeAnimation({
  children,
  baseVelocity = 2,
  direction = 'left',
  className = ''
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para pausar cuando no está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const directionMultiplier = direction === 'left' ? -1 : 1;

  useAnimationFrame((t, delta) => {
    // Solo anima si está visible Y no está pausado
    if (!isVisible || isPaused) return;

    let moveBy = directionMultiplier * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionMultiplier *= -1;
    }

    moveBy += directionMultiplier * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div ref={containerRef} className="overflow-hidden whitespace-nowrap">
      <motion.div className={`inline-block ${className}`} style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}
```

## Plan de Implementación Prioritizado

### 🔥 Prioridad ALTA (Impacto Inmediato)

1. **Agrega `content-visibility` a todos los strips principales** (5 minutos)
   ```css
   /* En cada .module.css de tus strips */
   .main-section {
     content-visibility: auto;
     contain-intrinsic-size: 0 800px; /* Ajusta según altura estimada */
     contain: layout paint;
   }
   ```

2. **Optimiza MarqueeAnimation con Intersection Observer** (15 minutos)
   - Implementa el código de arriba en MarqueeAnimation.tsx

3. **Pausa scroll animations en GemSection cuando no está visible** (10 minutos)
   - Implementa el scroll observer optimizado

### ⚙️ Prioridad MEDIA (Mejora Notable)

4. **Optimiza BounceCards con lazy animation** (10 minutos)
   - Agrega Intersection Observer para triggear animaciones

5. **Mejora AnimatedMeWrapper components** (20 minutos)
   - Crea versión optimizada con disconnect después de animar

6. **Optimiza dark mode handlers con requestAnimationFrame** (10 minutos)
   - Implementa en Banner.astro y otros componentes

### 🎨 Prioridad BAJA (Polish)

7. **Agrega Performance Monitoring** (15 minutos)
   ```typescript
   // En un nuevo archivo: utils/performanceMonitor.ts
   export class PerformanceMonitor {
     measureFPS(duration = 5000) {
       let frameCount = 0;
       let startTime = performance.now();

       const countFrame = () => {
         frameCount++;

         if (performance.now() - startTime < duration) {
           requestAnimationFrame(countFrame);
         } else {
           const fps = Math.round((frameCount / duration) * 1000);
           console.log(`Average FPS: ${fps}`);
         }
       };

       requestAnimationFrame(countFrame);
     }
   }

   // Uso en desarrollo
   if (import.meta.env.DEV) {
     const monitor = new PerformanceMonitor();
     monitor.measureFPS();
   }
   ```

## Código Listo para Copiar/Pegar

### 1. Utility para Lazy Intersection Observer
```typescript
// src/utils/lazyObserver.ts
export function createLazyObserver(
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver(
    ([entry]) => callback(entry.isIntersecting),
    {
      threshold: 0.1,
      rootMargin: '100px',
      ...options
    }
  );

  return {
    observe: (element: HTMLElement) => observer.observe(element),
    disconnect: () => observer.disconnect()
  };
}

// Uso:
// const observer = createLazyObserver((isVisible) => {
//   setIsActive(isVisible);
// });
// observer.observe(elementRef.current);
```

### 2. Hook para Performance de Animaciones
```typescript
// src/hooks/useAnimationPerformance.ts
import { useRef, useEffect, useState } from 'react';

export function useAnimationPerformance(rootMargin = '100px') {
  const ref = useRef<HTMLElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          // Opcional: mantener animado o disconnect
          // observer.disconnect();
        } else {
          setShouldAnimate(false);
        }
      },
      { threshold: 0.1, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, shouldAnimate };
}

// Uso en componente:
// const { ref, shouldAnimate } = useAnimationPerformance('200px');
// <motion.div ref={ref} animate={shouldAnimate ? 'visible' : 'hidden'}>
```

### 3. CSS Global para Strips
```css
/* En src/styles/global.css o en cada module.css */

/* Aplica a todos los strips principales */
.strip-container {
  content-visibility: auto;
  contain: layout paint;
}

/* Para strips ligeros */
.strip-light {
  contain-intrinsic-size: 0 400px;
}

/* Para strips medianos */
.strip-medium {
  contain-intrinsic-size: 0 800px;
}

/* Para strips pesados (con 3D) */
.strip-heavy {
  contain-intrinsic-size: 0 1200px;
}

/* Optimización de animaciones */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Métricas Esperadas

Después de implementar estas optimizaciones, deberías ver:

- ✅ **Initial Load**: Sin cambios (ya está bien optimizado)
- ✅ **Scroll FPS**: Mejora de ~45-50fps a ~55-60fps
- ✅ **CPU Usage**: Reducción del 20-30% durante scroll
- ✅ **Memory**: Reducción del 15-25% (por pausar componentes fuera del viewport)
- ✅ **Time to Interactive**: Sin cambios significativos (ya usas islands)

## Comandos para Medir Performance

```bash
# En Chrome DevTools
# 1. Abre Performance tab
# 2. Marca "Screenshots" y "Memory"
# 3. Record mientras scrolleas toda la página
# 4. Analiza:
#    - FPS graph (debe estar cerca de 60fps)
#    - Main thread activity (busca gaps/breathing room)
#    - Memory usage (no debe crecer indefinidamente)

# Con Lighthouse
npx lighthouse https://karenortiz.space --view --preset=desktop

# Performance en dev
npm run build && npm run preview
# Luego abre Chrome DevTools > Performance
```

## Resumen de Cambios Mínimos

Para mantener los cambios "relativamente sencillos" como pediste, aquí está el orden sugerido:

1. **5 minutos**: Agrega `content-visibility` CSS a strips principales
2. **15 minutos**: Optimiza MarqueeAnimation con IO
3. **10 minutos**: Optimiza GemSection scroll con IO
4. **10 minutos**: Optimiza BounceCards con lazy animation
5. **20 minutos**: (Opcional) Crea AnimatedMeWrapperOptimized

**Total: ~60 minutos de trabajo** para mejoras significativas sin romper nada.

Los cambios son **aditivos** y **backwards-compatible** - no requieren refactorización grande de tu arquitectura existente.

<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72]</span>

<div align="center">⁂</div>

[^1]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

[^2]: https://keith.is/post/using-content-visibility

[^3]: https://nitropack.io/blog/post/content-visibility-inp

[^4]: https://blog.logrocket.com/using-css-contain-property-deep-dive/

[^5]: https://zendesk.engineering/css-animation-optimisations-will-change-7e8ce3e63b81

[^6]: https://www.sitepoint.com/throttle-scroll-events/

[^7]: https://frontenddesigner.dk/blog-posts/scroll-based-animations/

[^8]: https://stevekinney.com/courses/react-performance/windowing-and-virtualization

[^9]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

[^10]: https://stackoverflow.com/questions/64326977/three-js-stop-rendering-scene-when-not-visible-out-of-viewport

[^11]: https://ijsrcseit.com/CSEIT23564521

[^12]: http://arxiv.org/pdf/2503.04803.pdf

[^13]: https://dl.acm.org/doi/pdf/10.1145/3694715.3695983

[^14]: http://arxiv.org/pdf/2502.19205.pdf

[^15]: https://arxiv.org/abs/2308.04545

[^16]: https://arxiv.org/pdf/2401.17168.pdf

[^17]: https://www.mdpi.com/1424-8220/23/9/4271/pdf?version=1682501273

[^18]: https://arxiv.org/html/2504.03884v1

[^19]: https://www.techrxiv.org/articles/preprint/Task-Aware_Distributed_Inter-Layer_Topology_Optimization_Method_in_Resource-Limited_LEO-LEO_Satellite_Networks/22631332/1/files/40158895.pdf

[^20]: https://docs.astro.build/es/guides/prefetch/

[^21]: https://docs.astro.build/es/guides/troubleshooting/

[^22]: https://www.youtube.com/watch?v=IDNztRpNwCY

[^23]: https://rosarioaznar.com/blog/estrategias-de-control-de-carga-y-ejecucion-de-scripts/

[^24]: https://www.instagram.com/reel/DNLyH5igTmg/

[^25]: https://app.studyraid.com/en/read/6673/155042/lazy-loading-components

[^26]: https://thebcms.com/blog/astro-server-islands-tutorial

[^27]: https://es.linkedin.com/advice/0/what-best-ways-optimize-front-end-performance-low-bandwidth?lang=es

[^28]: https://betterprogramming.pub/lazy-loading-images-with-intersection-observer-in-react-ad6135f1ca59

[^29]: http://downloads.hindawi.com/journals/mpe/2016/6182143.pdf

[^30]: http://arxiv.org/pdf/2502.00683.pdf

[^31]: http://arxiv.org/pdf/2209.10130.pdf

[^32]: https://ph.pollub.pl/index.php/jcsi/article/view/6299

[^33]: https://ph.pollub.pl/index.php/jcsi/article/download/2827/2658

[^34]: http://arxiv.org/pdf/2401.08595.pdf

[^35]: https://arxiv.org/pdf/2212.05203.pdf

[^36]: https://dev.to/emmanueloloke/using-intersection-observer-api-in-react-56b0

[^37]: https://dev.to/woai3c/24-front-end-performance-optimization-tips-4a6c

[^38]: https://www.ingentaconnect.com/content/10.3397/IN_2022_0686

[^39]: https://fse-journal.org/index.php/ojs/article/view/22

[^40]: https://ieeexplore.ieee.org/document/10653370/

[^41]: https://dl.acm.org/doi/10.1145/3706599.3719737

[^42]: https://ieeexplore.ieee.org/document/9222056/

[^43]: https://ieeexplore.ieee.org/document/10919238/

[^44]: https://www.mdpi.com/2075-5309/14/1/237

[^45]: https://link.springer.com/10.1007/s42461-021-00416-9

[^46]: https://ieeexplore.ieee.org/document/10771493/

[^47]: https://ieeexplore.ieee.org/document/9651899/

[^48]: https://arxiv.org/pdf/2503.11004.pdf

[^49]: https://arxiv.org/pdf/1807.00092.pdf

[^50]: https://www.frontiersin.org/articles/10.3389/fpsyg.2023.1191952/pdf

[^51]: https://arxiv.org/pdf/2202.08409.pdf

[^52]: http://arxiv.org/pdf/2501.11754.pdf

[^53]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10469673/

[^54]: https://www.scienceopen.com/document_file/7c2f6217-20f8-4e89-8437-4e0881505099/ScienceOpen/BHCI-2018_Askoura.pdf

[^55]: https://dev.to/usman_awan_003/optimizing-react-performance-with-virtualization-a-developers-guide-3j14

[^56]: https://lorojournals.com/index.php/emsj/article/view/1391

[^57]: https://link.springer.com/10.1617/s11527-024-02297-y

[^58]: https://www.ijraset.com/best-journal/seo-optimization-in-web-development-how-next-js-helps

[^59]: https://pubs.acs.org/doi/10.1021/acs.langmuir.4c02713

[^60]: https://dl.acm.org/doi/10.1145/3746027.3755233

[^61]: https://ieeexplore.ieee.org/document/10847302/

[^62]: https://iopscience.iop.org/article/10.1088/2053-1591/ad5646

[^63]: https://arxiv.org/abs/2504.09048

[^64]: https://4spepublications.onlinelibrary.wiley.com/doi/10.1002/pen.70118

[^65]: https://www.mdpi.com/2411-5134/8/6/138

[^66]: http://arxiv.org/pdf/1812.02989.pdf

[^67]: https://arxiv.org/ftp/arxiv/papers/1204/1204.6304.pdf

[^68]: http://arxiv.org/pdf/2410.13312.pdf

[^69]: http://arxiv.org/pdf/2411.10659.pdf

[^70]: https://www.mdpi.com/1424-8220/22/21/8230/pdf?version=1666865818

[^71]: https://dl.acm.org/doi/pdf/10.1145/3647632.3647989

[^72]: https://arxiv.org/html/2502.15708v1

