<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Nunca he animado SVGs

¡Perfecto! Considerando que nunca has animado SVGs, esta guía partirá desde cero y avanzará hasta temas avanzados y profesionales. Explicaré todo el proceso, los conceptos clave y agregaré muchos fragmentos de código, tips y enlaces a documentación oficial y recursos útiles, para que puedas dominar las animaciones SVG con GSAP y scroll.

### 1. **¿Por qué animar SVGs y qué es SVG Drawing?**

- **SVG (Scalable Vector Graphics)** es un formato vectorial que se dibuja y escala perfectamente en cualquier pantalla.
- El “drawing animation” de SVG implica dar la ilusión de que una línea, forma o icono se va dibujando ante tus ojos, simulando trazos a mano.


### 2. **Estructura de un SVG para Animación**

Vamos a usar tu ejemplo ([Brush.svg]), pero puedes abrir cualquier SVG en un editor de código y verás algo parecido a:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80">
  <path id="brush-stroke" d="M10 30 C 20 50, 40 50, 50 30" fill="none" stroke="#444" stroke-width="5"/>
</svg>
```

**Consejos:**

```
- Cada línea/forma es un `<path>`, `<rect>`, `<circle>`, etc.
```

- Para animar “drawing”, necesitas paths abiertos (lines, outlines) NO rellenos.

***

### 3. **Preparando tu Proyecto**

#### a) Carga mínima de GSAP y DrawSVGPlugin

Aunque GSAP es potente, puedes cargar solo lo necesario:

```html
<script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>
<script src="https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://assets.codepen.io/16327/DrawSVGPlugin3.min.js"></script>
```

- Si solo usas animación de SVG, **no cargas otros plugins de GSAP**.
- La versión DrawSVGPlugin oficial es de pago, pero para pruebas puedes usar la de CodePen.


#### b) Incluir tu SVG en el HTML

```html
<!-- Puedes incluir tu SVG directamente o como <img> si es solo decorativo -->
<svg id="myBrush" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80">
  <path id="brush-stroke" d="M10 30 C 20 50, 40 50, 50 30" fill="none" stroke="#444" stroke-width="5"/>
</svg>
```


***

### 4. **Principio Técnico: ¿Cómo “dibuja” GSAP un SVG?**

- GSAP “recorta” el path usando la propiedad `stroke-dasharray` y `stroke-dashoffset`. El plugin **DrawSVGPlugin** facilita esto:

```js
gsap.from("#brush-stroke", {drawSVG: "0%", duration: 2, ease: "power1.inOut"});
```

Esto hace que la línea se “dibuje” desde 0% hasta completo.

***

### 5. **Integrando ScrollTrigger para “dibujar en scroll”**

Primero, asegúrate de tener una sección con suficiente alto para testear el scroll.

```html
<div style="height: 100vh"></div> <!-- Espaciador -->
<section id="brushSection">
  <!-- Aquí tu SVG -->
</section>
<div style="height: 150vh"></div> <!-- Otro espaciador -->
```


#### Código GSAP avanzado:

```js
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

gsap.from("#brush-stroke", {
  scrollTrigger: {
    trigger: "#brushSection",
    start: "top center", // Empieza cuando la sección llega al centro del viewport
    end: "bottom center", 
    scrub: true          // “ata” la animación al scroll
  },
  drawSVG: "0%",
  ease: "none",
  duration: 2
});
```


***

### 6. **Snippet Completo: Integrando todo**

```html
<svg id="myBrush" viewBox="0 0 400 80">
  <path id="brush-stroke" d="M10 30 C 20 50, 40 50, 50 30" fill="none" stroke="#444" stroke-width="5"/>
</svg>
<script>
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
gsap.from("#brush-stroke", {
  scrollTrigger: {
    trigger: "#myBrush",
    start: "top center",
    end: "bottom center",
    scrub: true
  },
  drawSVG: "0%",
  ease: "power1.inOut"
});
</script>
```


***

### 7. **Tips Profesionales**

- Convierte tu SVG a “inline” (directo en el HTML) si quieres manipularlo con JS/CSS.
- Usa solo un path por animación. Si son muchas líneas y performance es un problema, anima solo las que sean visibles en pantalla.
- Para bundles pequeños, instala solo estos plugins (sin extras). Si usas bundler, importa solo GSAP y DrawSVG.
- Si necesitas otras animaciones, considera si puedes hacerlas con el mismo plugin sin recargar más JS.

***

### 8. **Debugging y Optimización**

- Aprovecha la consola para identificar selectores y errores de carga JS.
- Reduce el número de puntos y vértices en tus `path` para mejores FPS.
- Analiza el SVG en https://jakearchibald.github.io/svgomg/ para optimizarlo.

***

### 9. **Extiende la Animación**

- Puedes sincronizar múltiples paths.
- Cambiar colores o grosor durante el “drawing” (aniamr múltiples atributos con GSAP).
- Usar timelines para encadenar varias animaciones.

***

### 10. **Documentación Oficial y Recursos**

- GSAP Docs DrawSVG:
https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- GSAP Docs ScrollTrigger:
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Guía avanzada de SVG + GSAP:
https://svgenius.design/blog/building-svg-animations-with-gsap-a-practical-guide-for-frontend-developers-and-designers
- Buenas prácticas de SVG:
https://blog.pixelfreestudio.com/best-practices-for-animating-svgs-on-the-web/
- Ejemplo real foro GSAP:
https://gsap.com/community/forums/topic/34563-scroll-triggerdraw-svg/
- Guía animar SVGs en español:
https://www.edeptec.com/2024/10/animar-svg-con-gsap.html

***

¿Quieres ejemplos concretos adaptados a tu SVG específico, más optimización para bundles pequeños o un enfoque con React, Vue u otra tecnología? ¡Dímelo y extiendo la guía según lo necesites!

