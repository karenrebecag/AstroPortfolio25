<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Guía Completa para Animación SVG Drawing con Scroll en Astro usando GSAP

Esta guía avanzada te llevará paso a paso para implementar animaciones de dibujo SVG sincronizadas con el scroll en un proyecto Astro, usando GSAP y ScrollTrigger, optimizando rendimiento y manteniendo el bundle ligero.

***

## 1. Fundamentos de SVG Drawing

- **SVG** es un formato vectorial escalable, ideal para gráficos nítidos y animaciones.
- La animación de dibujo se basa en manipular las propiedades `stroke-dasharray` y `stroke-dashoffset` para simular que un trazo se dibuja progresivamente.
- GSAP facilita esta animación con su plugin **DrawSVGPlugin** o manipulando manualmente estas propiedades.


## 2. Preparación del Proyecto Astro

- Crea un proyecto Astro nuevo o usa uno existente.
- Instala GSAP con:

```bash
npm install gsap
```

- Importa GSAP y plugins solo en los componentes donde los necesites para mantener el bundle pequeño.


## 3. Importar y Optimizar SVG en Astro

- Usa la nueva funcionalidad de Astro para importar SVGs como componentes:

```js
import Brush from '../assets/Brush.svg';
```

- Optimiza el SVG con herramientas como [SVGOMG](https://jakearchibald.github.io/svgomg/) para reducir puntos y eliminar metadatos innecesarios.
- Asegúrate que los paths que quieres animar tengan `stroke` y `fill="none"` para animar solo el trazo.


## 4. Implementar Animación Drawing con GSAP y ScrollTrigger

- Registra los plugins:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

- Selecciona el path y calcula su longitud:

```js
const path = document.querySelector('#brush-stroke');
const length = path.getTotalLength();
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
```

- Crea la animación ligada al scroll:

```js
gsap.to(path, {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: '#brush-section',
    start: 'top center',
    end: 'bottom center',
    scrub: true
  },
  ease: 'none'
});
```


## 5. Integración en Astro Component

Ejemplo básico en un archivo `.astro`:

```astro
---
import { onMount } from 'solid-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMount(() => {
  const path = document.querySelector('#brush-stroke');
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: '#brush-section',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    },
    ease: 'none'
  });
});
---

<section id="brush-section">
  <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
    <path id="brush-stroke" d="M10 30 C 20 50, 40 50, 50 30" fill="none" stroke="#444" stroke-width="5" />
  </svg>
</section>
```


## 6. Tips para Optimización y Buenas Prácticas

- **Carga selectiva:** importa GSAP solo en componentes que lo usen.
- **Lazy load:** si la animación no es visible al inicio, carga GSAP bajo demanda.
- **Reduce paths:** simplifica paths para mejorar rendimiento.
- **Usa timelines:** para animar múltiples paths coordinadamente.
- **Context API de GSAP:** para limpiar animaciones en Astro y evitar fugas de memoria.


## 7. Recursos y Documentación Clave

- GSAP DrawSVGPlugin: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Astro + GSAP integración: https://astro-tips.dev/tips/how-to-add-gsap/
- SVG optimización: https://jakearchibald.github.io/svgomg/
- Tutorial avanzado SVG + GSAP: https://svgenius.design/blog/building-svg-animations-with-gsap-a-practical-guide-for-frontend-developers-and-designers
- Ejemplo scroll drawing con GSAP: https://dev.to/andrew-saeed/bring-your-scroll-to-life-a-beginners-guide-to-scroll-based-animations-with-gsap-f95
- Astro ViewTransitions + GSAP: https://vaskopavic.com/blog/enhancing-astro-view-transitions-with-gsap-animations/

***

¿Quieres que te prepare un proyecto base completo con código listo para Astro, o prefieres que te guíe en la creación paso a paso con explicaciones detalladas y ejemplos interactivos?
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^3][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^4][^40][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.qeios.com/read/GT3D1V/pdf

[^2]: https://arxiv.org/html/2405.14276

[^3]: https://arxiv.org/html/2411.19233

[^4]: https://arxiv.org/html/2412.10488v2

[^5]: http://arxiv.org/pdf/2409.05819.pdf

[^6]: http://arxiv.org/pdf/2311.15306.pdf

[^7]: https://arxiv.org/pdf/2007.11301v3.pdf

[^8]: https://arxiv.org/pdf/2310.06860.pdf

[^9]: https://dev.to/andrew-saeed/bring-your-scroll-to-life-a-beginners-guide-to-scroll-based-animations-with-gsap-f95

[^10]: https://gsap.com/community/forums/topic/34563-scroll-triggerdraw-svg/

[^11]: https://www.youtube.com/watch?v=ersN5fk8py0

[^12]: https://www.youtube.com/watch?v=7DiKBDC7cz8

[^13]: https://www.youtube.com/watch?v=XrBlDhLX58s

[^14]: https://vaskopavic.com/blog/enhancing-astro-view-transitions-with-gsap-animations/

[^15]: https://svgenius.design/blog/building-svg-animations-with-gsap-a-practical-guide-for-frontend-developers-and-designers

[^16]: https://dev.to/anticoder03/day-3-mastering-svg-animations-with-gsap-34hp

[^17]: https://astro-tips.dev/tips/how-to-add-gsap/

[^18]: https://gsap.com/community/forums/topic/43847-gsap-correct-location-astro/

[^19]: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/

[^20]: https://www.launchfa.st/blog/gsap-astro/

[^21]: https://www.reddit.com/r/astrojs/comments/1muex5m/astro_gsapframeranimation_and_ai_tools_opinions/

[^22]: https://www.youtube.com/watch?v=PrQeeUt49f4

[^23]: https://gsap.com/community/forums/topic/39684-gsap-astro/

[^24]: https://astrothem.es/blog/astro-svg-components/

[^25]: http://arxiv.org/pdf/2312.11556.pdf

[^26]: http://arxiv.org/pdf/2309.14642.pdf

[^27]: https://arxiv.org/html/2410.05991

[^28]: https://arxiv.org/html/2404.00412v1

[^29]: https://arxiv.org/pdf/2404.10250.pdf

[^30]: https://arxiv.org/pdf/1907.10699.pdf

[^31]: http://arxiv.org/pdf/2312.16476.pdf

[^32]: https://arxiv.org/html/2312.16812

[^33]: https://arxiv.org/html/2407.10707v1

[^34]: https://arxiv.org/html/2501.16550v1

[^35]: https://arxiv.org/pdf/2308.00224.pdf

[^36]: http://arxiv.org/pdf/2405.07065.pdf

[^37]: https://www.youtube.com/watch?v=d8MbaVEF3eI

[^38]: https://www.launchfa.st/es/blog/gsap-astro-view-transitions/

[^39]: https://javascript.plainenglish.io/animate-anything-with-gsap-a-beginners-guide-ac11acfe0398

[^40]: https://www.youtube.com/watch?v=JmYxiTW671g

