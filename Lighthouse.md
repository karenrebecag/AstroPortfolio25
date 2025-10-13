<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Guía Completa de Optimización de Lighthouse en Astro: Técnicas Frontend Modernas 2025

Esta guía técnica exhaustiva te ayudará a alcanzar scores perfectos de Lighthouse en tu proyecto Astro, con enfoque especial en Performance y Best Practices.

## Introducción: Arquitectura de Rendimiento de Astro

Astro está diseñado desde su núcleo para generar sitios web ultra-rápidos mediante su filosofía "Zero JavaScript by Default". A diferencia de otros frameworks, Astro envía HTML estático al navegador y solo hidrata componentes cuando es absolutamente necesario.[^1][^2]

**Ventajas fundamentales de Astro:**

- Renderizado estático por defecto que elimina JavaScript innecesario
- Hidratación parcial (partial hydration) para cargar solo componentes interactivos
- Optimización automática de assets durante el build
- Code splitting automático basado en rutas[^3][^4]

**Documentación oficial:** https://docs.astro.build/en/guides/images/

## Performance: Optimización de Imágenes

### 1. Componente `<Image />` Nativo de Astro

El componente `<Image />` es fundamental para lograr scores perfectos de Lighthouse. Proporciona optimización automática, prevención de Cumulative Layout Shift (CLS) y conversión de formatos.[^5]

**Implementación básica:**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<Image 
  src={heroImage} 
  alt="Hero image description"
  width={800}
  height={600}
  format="webp"
  quality={80}
  loading="lazy"
/>
```

**Características clave:**

- Infiere automáticamente width y height para prevenir layout shift
- Genera atributos `alt`, `loading` y `decoding` optimizados
- Transforma imágenes en build time para páginas prerenderizadas[^6]


### 2. Formatos Modernos: WebP y AVIF

AVIF ofrece compresión superior a WebP (aproximadamente 30% más eficiente en tamaño de archivo). Sin embargo, requiere configuración de calidad específica por formato.[^7][^8]

**Componente `<Picture />` para múltiples formatos:**

```astro
---
import { Picture } from 'astro:assets';
import landscape from '../assets/landscape.jpg';
---

<Picture 
  src={landscape}
  formats={['avif', 'webp']}
  alt="Landscape with fallback formats"
  widths={[400, 800, 1200]}
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  quality={85}
/>
```

Este código genera automáticamente:

- Múltiples versiones en AVIF y WebP
- Fallback a formato original
- Responsive srcset para diferentes tamaños de pantalla[^7]

**Documentación:** https://docs.astro.build/en/guides/images/

### 3. Imágenes Responsive con Configuración Global

Desde Astro 5.10.0, puedes configurar comportamiento responsive global:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    experimentalResponsiveImages: true,
    responsiveStyles: true
  }
});
```

Astro aplica estilos CSS automáticos usando `:where()` con especificidad 0, permitiendo fácil override.[^6]

### 4. Optimización de Imágenes en Markdown

Para archivos `.md`, las imágenes locales en `src/` se optimizan automáticamente con la sintaxis estándar:

```markdown
![Descripción optimizada](../assets/image.png)
```

Para MDX, importa el componente:

```mdx
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
---

<Image src={photo} alt="Descripción accesible" />
```


### 5. Lazy Loading y Priorización

**Estrategia recomendada por desarrolladores expertos:**

- Above-the-fold images: `loading="eager"` y `fetchpriority="high"`
- Below-the-fold images: `loading="lazy"`
- Background images: usar intersection observer[^9]

```astro
<!-- Hero image (LCP) - prioridad máxima -->
<Image 
  src={heroImage} 
  alt="Hero"
  loading="eager"
  fetchpriority="high"
/>

<!-- Imágenes secundarias - lazy loading -->
<Image 
  src={gallery} 
  alt="Gallery"
  loading="lazy"
/>
```

**Documentación sobre lazy loading:** https://uploadcare.com/blog/how-to-optimize-images-in-astro/

## Performance: Optimización de CSS

### 6. CSS Purging con PurgeCSS

PurgeCSS elimina CSS no utilizado, reduciendo drásticamente el tamaño de bundles (hasta 90% según casos reales).[^10][^11]

**Instalación y configuración:**

```bash
npm install -D @fullhuman/postcss-purgecss
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import purgecss from '@fullhuman/postcss-purgecss';

export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [
          purgecss({
            content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'],
            safelist: ['html', 'body'],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
          })
        ]
      }
    }
  }
});
```

**Alternativa con astro-purgecss:**

```bash
npx astro add astro-purgecss
```

Esta integración automatiza el proceso.[^12]

**Documentación:** https://www.npmjs.com/package/astro-purgecss

### 7. Critical CSS Inlining

Critical CSS mejora el First Contentful Paint (FCP) al incluir estilos esenciales inline.[^11]

```astro
---
// Layout.astro
---
<!DOCTYPE html>
<html>
<head>
  <style is:inline>
    /* Critical CSS aquí - estilos above-the-fold */
    body { margin: 0; font-family: system-ui; }
    .hero { min-height: 100vh; display: flex; }
    .nav { position: fixed; top: 0; width: 100%; }
  </style>
  
  <!-- CSS no crítico - preload y swap -->
  <link 
    rel="preload" 
    href="/styles/main.css" 
    as="style" 
    onload="this.onload=null;this.rel='stylesheet'"
  >
  <noscript>
    <link rel="stylesheet" href="/styles/main.css">
  </noscript>
</head>
```


### 8. Minificación Automática

Astro minifica CSS automáticamente durante `astro build`, pero puedes optimizar manualmente con cssnano:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cssnano from 'cssnano';

export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [
          cssnano({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true
            }]
          })
        ]
      }
    }
  }
});
```

**Documentación:** https://docs.astro.build/en/guides/styling/

## Performance: Optimización de Fuentes

### 9. Font Loading Strategy con font-display

`font-display: swap` es crucial para evitar FOIT (Flash of Invisible Text) y mejorar FCP.[^13]

```astro
---
// Layout.astro
---
<head>
  <!-- Preload critical fonts -->
  <link 
    rel="preload" 
    href="/fonts/inter-variable.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
  
  <style>
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/inter-variable.woff2') format('woff2');
      font-display: swap;
      font-weight: 100 900;
      font-style: normal;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  </style>
</head>
```


### 10. Subsetting de Fuentes

Reduce el tamaño de fuentes incluyendo solo caracteres necesarios:

```bash
# Usando pyftsubset (fonttools)
pip install fonttools brotli

pyftsubset font.ttf \
  --output-file=font-subset.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga' \
  --unicodes="U+0020-007E,U+00A0-00FF"
```


### 11. Variable Fonts para Reducir Requests

Variable fonts combinan múltiples weights en un solo archivo:[^13]

```css
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
```


### 12. Astro Font Integration

```bash
npm install astro-font
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import astroFont from 'astro-font';

export default defineConfig({
  integrations: [
    astroFont({
      config: [{
        name: "Inter",
        src: [
          {
            style: 'normal',
            weight: '400',
            path: './public/fonts/inter-regular.woff2'
          }
        ],
        preload: true,
        display: 'swap',
        selector: 'body',
        fallback: 'sans-serif'
      }]
    })
  ]
});
```

**Documentación:** https://www.npmjs.com/package/astro-font y https://docs.astro.build/en/guides/fonts/

## Performance: Code Splitting y Lazy Loading

### 13. Code Splitting Automático por Ruta

Astro divide automáticamente el código por página, asegurando que solo se descargue JavaScript necesario.[^14][^3]

**Estructura recomendada:**

```
src/
├── pages/
│   ├── index.astro        # Bundle independiente
│   ├── blog/
│   │   └── [slug].astro   # Bundle independiente
│   └── about.astro        # Bundle independiente
└── components/
    ├── Header.astro       # Compartido, code-split inteligente
    └── HeavyComponent.tsx # Lazy loading manual
```


### 14. Dynamic Imports para Componentes Pesados

```astro
---
// Page.astro
const LazyComponent = () => import('../components/HeavyComponent.jsx');
---

<div id="heavy-container"></div>

<script>
  const container = document.getElementById('heavy-container');
  
  // Cargar solo cuando sea visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const { default: Component } = await import('../components/HeavyComponent.jsx');
        // Renderizar componente
        observer.disconnect();
      }
    });
  });
  
  observer.observe(container);
</script>
```


### 15. Client Directives para Hidratación Selectiva

Astro ofrece directivas `client:*` para controlar cuándo se hidrata JavaScript:[^1]

```astro
---
import InteractiveMap from '../components/InteractiveMap.jsx';
import ChatWidget from '../components/ChatWidget.jsx';
import Analytics from '../components/Analytics.jsx';
---

<!-- Solo hidrata cuando es visible -->
<InteractiveMap client:visible />

<!-- Solo hidrata cuando idle (requestIdleCallback) -->
<ChatWidget client:idle />

<!-- Solo hidrata inmediatamente -->
<Analytics client:load />

<!-- Solo hidrata en media query -->
<MobileMenu client:media="(max-width: 768px)" />

<!-- Solo hidrata client-side, no en server -->
<ClientOnlyWidget client:only="react" />
```

**Best practice de expertos:** Usa `client:visible` e `client:idle` siempre que sea posible para mejorar Time to Interactive (TTI).[^1]

**Documentación:** https://docs.astro.build/en/reference/configuration-reference/

## Performance: Third-Party Scripts

### 16. Estrategia async vs defer

**Diferencias clave según performance testing:**[^15][^16]

- `defer`: Ejecuta después del parsing HTML, respeta orden, no bloquea DOMContentLoaded
- `async`: Ejecuta inmediatamente al descargar, puede bloquear parsing

**Implementación recomendada:**

```astro
<head>
  <!-- Analytics - async (independiente) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
  
  <!-- Scripts que dependen del DOM - defer -->
  <script defer src="/js/interactive.js"></script>
  
  <!-- Scripts críticos - inline sin atributo -->
  <script is:inline>
    // Código crítico aquí
  </script>
</head>
```


### 17. Partytown para Web Workers

Partytown ejecuta third-party scripts en web workers, liberando el main thread:

```bash
npx astro add partytown
```

```astro
---
import { Partytown } from '@astrojs/partytown';
---

<head>
  <Partytown />
  <script type="text/partytown" src="https://analytics.example.com/script.js"></script>
</head>
```

**Mejora promedio:** 20-30% en Total Blocking Time (TBT).[^1]

## Performance: Prefetching y Prerendering

### 18. Configuración de Prefetch

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
```

**Estrategias disponibles:**[^17]

- `hover`: Prefetch al hover (default)
- `tap`: Prefetch justo antes del click
- `viewport`: Prefetch al entrar en viewport
- `load`: Prefetch todos los links después de page load

**Uso en componentes:**

```astro
<!-- Prefetch con hover -->
<a href="/blog/post-1" data-astro-prefetch>Post 1</a>

<!-- Prefetch con viewport -->
<a href="/blog/post-2" data-astro-prefetch="viewport">Post 2</a>

<!-- Opt-out de prefetch -->
<a href="/external" data-astro-prefetch="false">External</a>
```


### 19. Client Prerendering (Experimental)

Habilita prerendering con Speculation Rules API para Chrome:

```javascript
// astro.config.mjs
export default defineConfig({
  prefetch: true,
  experimental: {
    clientPrerender: true
  }
});
```

Esto genera `<script type="speculationrules">` para prerender agresivo.[^18]

**Documentación:** https://docs.astro.build/en/guides/prefetch/ y https://docs.astro.build/en/reference/experimental-flags/client-prerender/

## Performance: Core Web Vitals

### 20. Largest Contentful Paint (LCP)

**Objetivo:** < 2.5 segundos

**Técnicas de optimización:**[^19][^20]

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- LCP element optimizado -->
<Image 
  src={heroImage}
  alt="Hero"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading="eager"
  fetchpriority="high"
  decoding="sync"
/>

<style>
  /* Asegurar que LCP element no se mueva */
  img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

**Consejos de expertos:**

- El recurso LCP debe ser discoverable desde HTML source
- Evita lazy loading en imágenes above-the-fold
- Usa CDN para reducir TTFB (Time To First Byte)[^19]


### 21. Cumulative Layout Shift (CLS)

**Objetivo:** < 0.1

**Prevención de layout shift:**[^5]

```astro
---
import { Image } from 'astro:assets';
import thumbnail from '../assets/thumb.jpg';
---

<!-- Astro infiere width/height automáticamente -->
<Image src={thumbnail} alt="Thumbnail" />

<!-- Para imágenes responsive con aspect ratio -->
<div style="aspect-ratio: 16/9; overflow: hidden;">
  <Image 
    src={thumbnail} 
    alt="Responsive"
    style="width: 100%; height: 100%; object-fit: cover;"
  />
</div>

<!-- Reservar espacio para ads/embeds -->
<div style="min-height: 250px;">
  <!-- Ad slot -->
</div>
```


### 22. First Input Delay (FID) / Interaction to Next Paint (INP)

**Objetivo FID:** < 100ms | **Objetivo INP:** < 200ms

**Optimizaciones:**

```astro
---
// Usar client:idle para componentes interactivos no críticos
import InteractiveForm from '../components/Form.jsx';
---

<InteractiveForm client:idle />

<script>
  // Dividir long tasks
  async function heavyTask() {
    const chunks = Array.from({ length: 10 }, (_, i) => i);
    
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 0));
      // Procesar chunk
      processChunk(chunk);
    }
  }
  
  // Usar requestIdleCallback
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => heavyTask());
  } else {
    setTimeout(() => heavyTask(), 1);
  }
</script>
```


## Best Practices: SEO y Accesibilidad

### 23. Meta Tags y Structured Data

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}

const { title, description, image, type = 'website' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const socialImage = new URL(image || '/og-default.jpg', Astro.site);
---

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={canonicalURL}>
  
  <!-- Open Graph -->
  <meta property="og:type" content={type}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={socialImage}>
  <meta property="og:url" content={canonicalURL}>
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={socialImage}>
  
  <!-- JSON-LD Schema -->
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "headline": title,
    "description": description,
    "image": socialImage.toString(),
    "url": canonicalURL.toString()
  })} />
</head>
```

**Documentación:** https://demo.hub.opsfolio.com/blog/astro-seo

### 24. Sitemap XML Automático

```bash
npx astro add sitemap
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tudominio.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin/'),
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date()
  })]
});
```


### 25. Semantic HTML y ARIA

```astro
<!-- Estructura semántica correcta -->
<header>
  <nav aria-label="Main navigation">
    <ul role="list">
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Título del Artículo</h1>
    <p>Contenido...</p>
  </article>
  
  <aside aria-label="Related content">
    <h2>Contenido Relacionado</h2>
  </aside>
</main>

<footer>
  <p>&copy; 2025 Company Name</p>
</footer>
```

**Jerarquía de headings:**[^21]

- Solo un `<h1>` por página
- No saltar niveles (h1 → h2 → h3)
- Usar headings para estructura, no para estilo


### 26. Skip Links para Accesibilidad

```astro
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background: black;
    color: white;
    text-decoration: none;
  }
  
  .skip-link:focus {
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<main id="main-content" tabindex="-1">
  <!-- Contenido principal -->
</main>
```


## Best Practices: Configuración Avanzada

### 27. Output Configuration para Performance

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static', // Prerender todo por defecto
  
  build: {
    inlineStylesheets: 'auto', // Inline CSS pequeños
    assets: '_assets', // Directorio de assets
    assetsPrefix: 'https://cdn.tudominio.com' // CDN prefix
  },
  
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS por ruta
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-charts': ['chart.js']
          }
        }
      }
    }
  }
});
```

**Documentación:** https://docs.astro.build/en/reference/configuration-reference/

### 28. Tree Shaking Optimization

Astro usa Rollup que realiza tree shaking automático, pero puedes optimizarlo:[^22]

```javascript
// Importaciones específicas (tree-shakeable)
import { specificFunction } from 'library';

// Evitar importaciones globales
// ❌ import * as Library from 'library';
```

**Para bibliotecas grandes:**

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false
        }
      }
    }
  }
});
```


### 29. Compression y Minification

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

export default defineConfig({
  integrations: [
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
      Image: false, // Astro ya optimiza imágenes
      JavaScript: true,
      SVG: true
    })
  ]
});
```


### 30. Caching Strategy

```javascript
// vercel.json (para Vercel deployment)
{
  "headers": [
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Para Apache (.htaccess):**

```apache
# Caching de assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```


## Monitoreo y Testing

### 31. Lighthouse CI para Continuous Integration

```bash
npm install -g @lhci/cli

# Configuración
lhci autorun --config=lighthouserc.json
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/",
        "http://localhost/blog/"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.95}]
      }
    }
  }
}
```


### 32. Web Vitals Monitoring

```astro
---
// src/components/WebVitals.astro
---

<script>
  import { onCLS, onFID, onLCP, onINP, onFCP, onTTFB } from 'web-vitals';

  function sendToAnalytics(metric) {
    const body = JSON.stringify(metric);
    
    // Usar sendBeacon si está disponible
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    } else {
      fetch('/api/analytics', { 
        body, 
        method: 'POST', 
        keepalive: true 
      });
    }
  }

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
</script>
```


## Casos de Éxito y Benchmarks Reales

### Casos Documentados de 100% Lighthouse Score

**Cox Code - Perfect 100 Score:**[^1]

- Estrategia: Astro.js + partial hydration
- LCP: < 1.5s
- FID: < 50ms
- CLS: 0
- Técnicas clave: Minimal JavaScript, optimized images, efficient CSS

**Samur.ai - 100% en todas las categorías:**[^23]

- Stack: Astro.js + Storyblok CMS + Vercel
- GTMetrix: 100% performance
- LCP: 0.184s
- TBT: 0ms
- Fully loaded: 0.246s

**WordPress a Astro Migration - Mejoras medibles:**[^10]

- Performance: 99.1 → 99.5
- LCP: 0.81s → 0.44s (46% mejora)
- HTML size: 38.9KB → 10.9KB (72% reducción)
- JavaScript: 13.4KB → 5.3KB (60% reducción)
- CSS: 67.2KB → 6.6KB (90% reducción)


## Checklist Final para Lighthouse 100%

### Performance (Peso: 25%)

- ✅ Imágenes optimizadas con `<Image />` en formatos WebP/AVIF
- ✅ LCP < 2.5s con `fetchpriority="high"` en imagen hero
- ✅ CSS minificado y purgado (< 50KB)
- ✅ Fonts con `font-display: swap` y preload
- ✅ Code splitting automático por ruta
- ✅ JavaScript diferido con `async`/`defer`
- ✅ Prefetching habilitado
- ✅ CDN configurado para assets estáticos
- ✅ Compression (Gzip/Brotli) habilitada


### Accessibility (Peso: 15%)

- ✅ Alt text en todas las imágenes
- ✅ Contraste de color adecuado (mínimo 4.5:1)

```
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
```

- ✅ Jerarquía de headings correcta
- ✅ ARIA labels donde sea necesario
- ✅ Skip links implementados
- ✅ Focus visible en elementos interactivos
- ✅ Formularios con labels asociados


### Best Practices (Peso: 30%)

- ✅ HTTPS habilitado
- ✅ Sin errores en consola
- ✅ Imágenes con aspect ratio definido
- ✅ Evitar `document.write()`
- ✅ Passive event listeners
- ✅ Links con `rel="noopener"` para targets externos
- ✅ Content Security Policy configurado
- ✅ Sin bibliotecas vulnerables


### SEO (Peso: 30%)

- ✅ Meta tags (title, description) en todas las páginas
- ✅ Meta viewport configurado
- ✅ Sitemap XML generado
- ✅ Robots.txt configurado
- ✅ Links con texto descriptivo
- ✅ Structured data (JSON-LD)
- ✅ Open Graph y Twitter Cards
- ✅ URLs canónicas definidas


## Recursos y Documentación Oficial

**Documentación Core de Astro:**

- Guía de Imágenes: https://docs.astro.build/en/guides/images/
- Guía de Estilos: https://docs.astro.build/en/guides/styling/
- Guía de Prefetch: https://docs.astro.build/en/guides/prefetch/
- Guía de Fuentes: https://docs.astro.build/en/guides/fonts/
- Client-side Scripts: https://docs.astro.build/en/guides/client-side-scripts/
- Configuration Reference: https://docs.astro.build/en/reference/configuration-reference/

**Herramientas de Testing:**

- Google Lighthouse: https://developer.chrome.com/docs/lighthouse/overview
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Core Web Vitals: https://web.dev/articles/vitals

**Performance Resources:**

- Web.dev Performance: https://web.dev/articles/optimize-vitals-lighthouse
- Core Web Vitals Guide: https://web.dev/articles/top-cwv

**Integraciones Útiles:**

- astro-font: https://www.npmjs.com/package/astro-font
- astro-purgecss: https://www.npmjs.com/package/astro-purgecss
- @astrojs/sitemap: Incluido en Astro
- astro-compress: Para compression avanzada


## Conclusión

Lograr scores perfectos de Lighthouse en Astro es completamente alcanzable siguiendo esta guía sistemática. La arquitectura de Astro está diseñada desde el principio para generar sitios ultra-rápidos, pero requiere configuración consciente y aplicación de best practices.[^2][^23]

**Prioridades según expertos:**

1. **Optimización de imágenes** (mayor impacto en LCP y peso total)
2. **Eliminación de JavaScript innecesario** (mejora TTI y TBT)
3. **CSS optimizado** (reduce render-blocking resources)
4. **Fuentes eficientes** (previene layout shifts)
5. **Prefetching estratégico** (mejora perceived performance)

Los casos de éxito documentados demuestran que es posible alcanzar 100/100/100/100 en todas las categorías de Lighthouse con Astro, incluso superando significativamente a alternativas como WordPress optimizado.[^23][^10]

Recuerda: La optimización es un proceso iterativo. Usa Lighthouse CI en tu pipeline de desarrollo, monitorea Core Web Vitals reales con usuarios, y continúa refinando basándote en datos medibles.
<span style="display:none">[^100][^101][^102][^103][^104][^105][^106][^107][^108][^109][^110][^111][^112][^113][^114][^115][^116][^117][^118][^119][^120][^121][^122][^123][^124][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84][^85][^86][^87][^88][^89][^90][^91][^92][^93][^94][^95][^96][^97][^98][^99]</span>

<div align="center">⁂</div>

[^1]: https://dev.to/benajaero/how-we-achieved-a-perfect-100-google-pagespeed-score-with-astrojs-and-partial-hydration-ek1

[^2]: https://astro-shadcn.one.ie/blog/Blogs/one-hundred-percent-lighthouse-score/

[^3]: https://app.studyraid.com/en/read/6673/155036/javascript-bundling-and-code-splitting

[^4]: https://astconsulting.in/general/astro-builder-performance-optimization

[^5]: https://astro.build/blog/images/

[^6]: https://docs.astro.build/en/guides/images/

[^7]: https://github.com/withastro/roadmap/discussions/597

[^8]: https://www.reddit.com/r/astrojs/comments/1dz3ql6/ive_wasted_so_much_time_manually_converting/

[^9]: https://dev.to/benajaero/boosting-web-performance-how-we-supercharged-our-agencys-site-with-astro-js-image-speed-optimization-techniques-18mf

[^10]: https://mfyz.com/wordpress-to-astro-migration-performance-comparison/

[^11]: https://app.studyraid.com/en/read/6673/155037/css-optimization-techniques

[^12]: https://www.npmjs.com/package/astro-purgecss/v/3.2.1

[^13]: https://app.studyraid.com/en/read/6673/155039/font-loading-optimization

[^14]: https://www.contentful.com/blog/astro-next-js-compared/

[^15]: https://stackoverflow.com/questions/73627369/performance-impact-of-async-vs-defer-in-3rd-party-script-tag

[^16]: https://nitropack.io/blog/post/eliminate-render-blocking-resources

[^17]: https://docs.astro.build/en/guides/prefetch/

[^18]: https://docs.astro.build/en/reference/experimental-flags/client-prerender/

[^19]: https://web.dev/articles/top-cwv

[^20]: https://owdt.com/insight/how-to-improve-core-web-vitals/

[^21]: https://audienzelabs.com/blogs/optimizing-layouts-in-astro-for-better-seo-and-user-experience/

[^22]: https://docs.sentry.io/platforms/javascript/guides/astro/configuration/tree-shaking/

[^23]: https://vaihe.com/case-studies/perfect-seo-with-astro/

[^24]: https://www.epj-conferences.org/10.1051/epjconf/201920901039

[^25]: http://arxiv.org/pdf/2205.13138.pdf

[^26]: http://arxiv.org/pdf/2501.06244.pdf

[^27]: https://arxiv.org/pdf/2412.18006.pdf

[^28]: https://arxiv.org/abs/2308.01957

[^29]: https://www.spiedigitallibrary.org/journals/Journal-of-Astronomical-Telescopes-Instruments-and-Systems/volume-8/issue-4/044005/Next-generation-active-telescope-for-space-astronomy/10.1117/1.JATIS.8.4.044005.pdf

[^30]: https://arxiv.org/pdf/2501.06249.pdf

[^31]: http://arxiv.org/pdf/2407.16049.pdf

[^32]: http://arxiv.org/pdf/2202.11048.pdf

[^33]: https://arxiv.org/pdf/2206.14220.pdf

[^34]: https://arxiv.org/vc/arxiv/papers/0802/0802.0582v1.pdf

[^35]: https://arxiv.org/html/2311.18094

[^36]: https://arxiv.org/html/2409.10383v1

[^37]: https://arxiv.org/pdf/2311.04272.pdf

[^38]: https://arxiv.org/abs/2308.04545

[^39]: https://arxiv.org/pdf/2407.17142.pdf

[^40]: https://arxiv.org/html/2411.00263

[^41]: https://www.mdpi.com/1424-8220/22/4/1421/pdf

[^42]: http://arxiv.org/pdf/2401.00242.pdf

[^43]: https://www.spiedigitallibrary.org/journals/Journal-of-Astronomical-Telescopes-Instruments-and-Systems/volume-7/issue-2/021213/Exoplanet-imaging-scheduling-optimization-for-an-orbiting-starshade-working-with/10.1117/1.JATIS.7.2.021213.pdf

[^44]: https://developer.chrome.com/docs/lighthouse/overview?hl=es-419

[^45]: https://www.youtube.com/watch?v=P3k8OQmLKnM

[^46]: https://lenguajejs.com/astro/estructura/frontmatter-astro/

[^47]: https://developer.chrome.com/docs/devtools/lighthouse?hl=es-419

[^48]: https://www.youtube.com/watch?v=4cKPqxGkFZQ

[^49]: https://uploadcare.com/blog/how-to-optimize-images-in-astro/

[^50]: https://www.youtube.com/watch?v=oiuTKQajb7o

[^51]: https://alexbobes.com/programming/a-deep-dive-into-astro-build/

[^52]: https://es.scribd.com/document/801969125/Guia-estudio-Frontend

[^53]: https://strapi.io/blog/astro-vs-gatsby-performance-comparison

[^54]: https://www.reddit.com/r/webdev/comments/16cg0f7/how_important_is_lighthouse_performance_score_to/

[^55]: https://web.dev/articles/optimize-vitals-lighthouse?hl=es-419

[^56]: https://kontent.ai/blog/site-performance-tips-lighthouse-score/

[^57]: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring

[^58]: https://www.connectinfosoft.com/blog/boost-the-performance-of-your-website-using-astro-framework/

[^59]: https://ieeexplore.ieee.org/document/10724007/

[^60]: https://ieeexplore.ieee.org/document/10819093/

[^61]: https://ieeexplore.ieee.org/document/9874629/

[^62]: https://arxiv.org/abs/2502.08995

[^63]: https://dl.acm.org/doi/10.1145/3592407

[^64]: https://www.semanticscholar.org/paper/088625555d8675ec80c1c6ec304377717ab16582

[^65]: https://www.fmdbpub.com/user/journals/article_details/FTSCL/373

[^66]: http://proceedings.spiedigitallibrary.org/proceeding.aspx?doi=10.1117/12.2234230

[^67]: https://www.spiedigitallibrary.org/journals/Journal-of-Astronomical-Telescopes-Instruments-and-Systems/volume-4/issue-02/021407/In-flight-verification-of-the-calibration-and-performance-of-the/10.1117/1.JATIS.4.2.021407.full

[^68]: http://www.aanda.org/10.1051/0004-6361/201730747

[^69]: https://arxiv.org/html/2405.13267v1

[^70]: https://arxiv.org/pdf/1812.09702.pdf

[^71]: https://arxiv.org/pdf/2306.07922.pdf

[^72]: https://arxiv.org/pdf/2207.10973.pdf

[^73]: http://arxiv.org/abs/2208.14974

[^74]: https://arxiv.org/html/2503.15984

[^75]: https://www.mdpi.com/2072-4292/15/21/5146/pdf?version=1698412750

[^76]: https://joss.theoj.org/papers/10.21105/joss.02641.pdf

[^77]: https://downloads.hindawi.com/journals/js/2020/8849552.pdf

[^78]: https://docs.astro.build/en/guides/styling/

[^79]: https://github.com/withastro/astro/issues/918

[^80]: https://www.semanticscholar.org/paper/d0ae388a40cc31d9029dc823390849c43d2978c4

[^81]: https://www.semanticscholar.org/paper/4251de0df41f4931b75279e792a185ea91fd45dc

[^82]: https://www.semanticscholar.org/paper/3086904664465fd8245dfcd94cf36e3f108d73a3

[^83]: http://arxiv.org/pdf/2502.11399.pdf

[^84]: https://arxiv.org/abs/2104.10741

[^85]: https://arxiv.org/pdf/2303.14017.pdf

[^86]: https://arxiv.org/pdf/2104.03064.pdf

[^87]: https://arxiv.org/pdf/2310.06939.pdf

[^88]: https://arxiv.org/pdf/1610.03159.pdf

[^89]: http://arxiv.org/pdf/2403.06453.pdf

[^90]: https://aclanthology.org/2021.emnlp-main.244.pdf

[^91]: https://docs.astro.build/en/guides/fonts/

[^92]: https://www.npmjs.com/package/astro-font

[^93]: https://docs.astro.build/en/guides/on-demand-rendering/

[^94]: https://docs.astro.build/en/reference/configuration-reference/

[^95]: https://www.launchfa.st/features/astro-font/

[^96]: https://docs.astro.build/en/guides/client-side-scripts/

[^97]: https://github.com/withastro/astro/issues/6010

[^98]: https://ieeexplore.ieee.org/document/10196933/

[^99]: https://ijecom.org/index.php/IJECOM/article/view/46

[^100]: https://journal.lppmunindra.ac.id/index.php/Faktor_Exacta/article/view/23248

[^101]: https://ieeexplore.ieee.org/document/10928128/

[^102]: https://journal-laaroiba.com/ojs/index.php/alkharaj/article/view/6855

[^103]: https://journal.uny.ac.id/publications/jiety/article/view/266

[^104]: https://ejournal.nusamandiri.ac.id/index.php/techno/article/view/6332

[^105]: https://www.scitepress.org/DigitalLibrary/Link.aspx?doi=10.5220/0013598400004664

[^106]: https://jurnal.syntaxliterate.co.id/index.php/syntax-literate/article/view/61243

[^107]: https://jurnalwahana.poltekykpn.ac.id/wahana/article/view/951

[^108]: https://arxiv.org/pdf/1907.04943.pdf

[^109]: http://arxiv.org/pdf/2503.08766.pdf

[^110]: https://www.ijfmr.com/papers/2024/5/29091.pdf

[^111]: https://arxiv.org/pdf/2312.02992.pdf

[^112]: https://arxiv.org/pdf/2107.06799.pdf

[^113]: https://arxiv.org/html/2407.17681v1

[^114]: https://arxiv.org/html/2409.07945v1

[^115]: https://www.frontiersin.org/articles/10.3389/fcomm.2024.1288896/pdf?isPublishedV2=False

[^116]: https://jmir.org/api/download?alt_name=jmir_v23i1e19151_app4.pdf\&filename=1d258c328adf7e8a97cb6b4c2d88e561.pdf

[^117]: https://dl.acm.org/doi/pdf/10.1145/3664639

[^118]: https://demo.hub.opsfolio.com/blog/astro-seo

[^119]: https://www.youtube.com/watch?v=4580P3H7Y8g

[^120]: https://www.reddit.com/r/astrojs/comments/1n29cov/astro_checklist_for_seo_a11y_etc/

[^121]: https://github.com/withastro/astro/issues/6328

[^122]: https://dev.to/saida_lachgar/image-optimization-in-astro-boost-site-performance-and-seo-2k80

[^123]: https://stackoverflow.com/questions/56423219/how-to-properly-do-tree-shaking-to-reduce-bundle-size-and-separate-entry-point-f

[^124]: https://www.linkedin.com/pulse/landing-page-perfect-100-scores-hours-stephen-parker-xmpqe

