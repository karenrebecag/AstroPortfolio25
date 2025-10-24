# Speedlify Stats Components - Usage Guide

## Overview

Los componentes `SpeedlifyStats.tsx` y `SpeedlifyStatsLight.tsx` ahora detectan automáticamente la URL de la página actual y muestran las métricas de performance correspondientes desde Speedlify.

## Detección Automática de URL

Por defecto, los componentes detectan automáticamente la URL actual de la página:

```astro
---
import { SpeedlifyStats } from '@/components/ui/SpeedlifyStats';
// o
import { SpeedlifyStatsLight } from '@/components/ui/SpeedlifyStatsLight';
---

<!-- Detección automática de URL -->
<SpeedlifyStats client:load />
```

### Cómo Funciona la Detección

1. El componente obtiene `window.location.pathname`
2. Construye la URL completa: `https://www.karenortiz.space` + pathname
3. Normaliza la URL (elimina trailing slashes excepto para root)
4. Busca esa URL en el API de Speedlify
5. Muestra las métricas correspondientes

### Ejemplos de URLs Detectadas

| Página Actual | URL Detectada |
|--------------|---------------|
| `/` | `https://www.karenortiz.space/` |
| `/resume` | `https://www.karenortiz.space/resume` |
| `/privacy` | `https://www.karenortiz.space/privacy` |
| `/greetings` | `https://www.karenortiz.space/greetings` |
| `/p_AurinTaskManager` | `https://www.karenortiz.space/p_AurinTaskManager` |
| `/p_ThisPortfolio` | `https://www.karenortiz.space/p_ThisPortfolio` |

## Override Manual de URL

Si necesitas especificar una URL diferente manualmente:

```astro
<SpeedlifyStats 
  currentUrl="https://www.karenortiz.space/resume"
  client:load 
/>
```

## Props Disponibles

### SpeedlifyStats (Dark Mode)

```typescript
interface SpeedlifyStatsProps {
  className?: string;           // Clases CSS adicionales
  hidePerformance?: boolean;    // Ocultar métrica de Performance
  hideAccessibility?: boolean;  // Ocultar métrica de Accessibility
  showOnlyTopScores?: boolean;  // Mostrar solo scores altos (no implementado aún)
  currentUrl?: string;          // Override manual de URL
}
```

### SpeedlifyStatsLight (Light Mode)

Mismas props que `SpeedlifyStats`, pero con colores adaptados para fondos claros.

## Ejemplos de Uso

### Uso Básico en Footer Dark

```astro
---
import { SpeedlifyStats } from '@/components/ui/SpeedlifyStats';
---

<footer>
  <div class="performance-section">
    <h3>Site Performance</h3>
    <SpeedlifyStats client:load />
  </div>
</footer>
```

### Uso Básico en Footer Light

```astro
---
import { SpeedlifyStatsLight } from '@/components/ui/SpeedlifyStatsLight';
---

<footer class="bg-white">
  <div class="performance-section">
    <h3>Site Performance</h3>
    <SpeedlifyStatsLight client:load />
  </div>
</footer>
```

### Ocultar Métricas Específicas

```astro
<!-- Ocultar Performance y Accessibility -->
<SpeedlifyStats 
  hidePerformance={true}
  hideAccessibility={true}
  client:load 
/>
```

### Con URL Manual

```astro
<!-- Mostrar stats de una página específica -->
<SpeedlifyStats 
  currentUrl="https://www.karenortiz.space/p_AurinTaskManager"
  client:load 
/>
```

### Con Clases Personalizadas

```astro
<SpeedlifyStats 
  className="my-custom-class flex-wrap"
  client:load 
/>
```

## Configuración de Speedlify

Las URLs que se pueden monitorear están definidas en:

```
src/components/modules/Speedify/_data/sites/karen-portfolio.js
```

Actualmente configuradas:

```javascript
urls: [
  // Páginas Principales
  "https://www.karenortiz.space/",
  "https://www.karenortiz.space/resume",
  "https://www.karenortiz.space/privacy",
  "https://www.karenortiz.space/greetings",

  // Páginas de Proyectos
  "https://www.karenortiz.space/p_AurinTaskManager",
  "https://www.karenortiz.space/p_ThisPortfolio",
]
```

## Métricas Mostradas

### Lighthouse Scores (0-100)
- **Performance**: Velocidad general del sitio
- **Accessibility**: Accesibilidad para usuarios con discapacidades
- **Best Practices**: Cumplimiento de estándares web
- **SEO**: Optimización para motores de búsqueda

### Core Web Vitals
- **LCP** (Largest Contentful Paint): Tiempo de carga del contenido principal
- **FCP** (First Contentful Paint): Tiempo hasta el primer contenido visible
- **CLS** (Cumulative Layout Shift): Estabilidad visual durante la carga

## Estados del Componente

### Loading State
Muestra un spinner mientras carga los datos:
```
🔄 Loading performance stats...
```

### Live Data
Indica que los datos son reales de Speedlify:
```
🟢 Live Data
```

### Demo Data (Fallback)
Si falla la conexión, usa datos de demostración:
```
🟡 Demo Data
```

### Filtered
Indica que algunas métricas están ocultas:
```
🔵 Filtered
```

## Troubleshooting

### La URL no se encuentra en Speedlify

Si una URL no está configurada en Speedlify, el componente mostrará datos de fallback. Para agregar una nueva URL:

1. Edita `src/components/modules/Speedify/_data/sites/karen-portfolio.js`
2. Agrega la URL al array `urls`
3. Commit y push a GitHub
4. Netlify ejecutará las pruebas automáticamente

### Los datos no se actualizan

Speedlify tiene una restricción de 23 horas entre pruebas. Para forzar nuevas pruebas:

```bash
cd src/components/modules/Speedify
npm run clean
git add .
git commit -m "Force new Speedlify tests"
git push origin main
```

### Timeout en la carga

El componente tiene un timeout de 10 segundos. Si la API de Speedlify no responde, automáticamente usa datos de fallback.

## API de Speedlify

### Base URL
```
https://guileless-douhua-b2ff53.netlify.app
```

### Endpoints Utilizados

1. **Lista de URLs**
   ```
   GET /api/urls.json
   ```
   Retorna un objeto con todas las URLs monitoreadas y sus hashes.

2. **Datos de Performance**
   ```
   GET /api/{hash}.json
   ```
   Retorna las métricas de performance para una URL específica.

## Notas Importantes

1. **Client-side Only**: Estos componentes requieren `client:load` o `client:visible` porque usan `window.location`

2. **Normalización de URLs**: Las URLs se normalizan automáticamente para coincidir con el formato de Speedlify

3. **Fallback Graceful**: Si no hay datos disponibles, el componente muestra datos de demostración en lugar de un error

4. **Cache Control**: Las peticiones incluyen headers para evitar cache y obtener datos frescos

5. **Performance**: Los componentes solo cargan cuando son visibles (con `client:visible`) para optimizar performance
