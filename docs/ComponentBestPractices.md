# Guía para Crear Nuevos Componentes de Sección

Esta guía describe las mejores prácticas para crear nuevos componentes de sección en este proyecto, asegurando que sean responsivos, mantenibles y consistentes con el diseño general.

## 1. Estructura de Archivos

Cada nuevo componente debe consistir en dos archivos, ubicados en `src/components/modules/CaseStudy/` (o un directorio de componentes apropiado):

1.  **`NombreComponente.astro`**: El archivo del componente de Astro.
2.  **`NombreComponente.module.css`**: El módulo de CSS para los estilos del componente.

## 2. Creación del Componente (`.astro`)

El archivo `.astro` es responsable de la estructura HTML y de manejar los datos.

### a. Definir Props

Define una interfaz `Props` para el componente. Esto hace que tu componente sea reutilizable y que los datos puedan ser pasados desde un CMS (Payload).

```typescript
// Ejemplo: src/components/modules/CaseStudy/ArticleBanner.astro
---
import styles from './ArticleBanner.module.css';

export interface Props {
  mainTag: string;
  uploadDate: string;
  title: string;
  authorImage: string;
  authorName: string;
}

const { mainTag, uploadDate, title, authorImage, authorName } = Astro.props;
---
```

### b. Usar HTML Semántico

Usa etiquetas HTML semánticas (`<section>`, `<h1>`, `<p>`, `<blockquote>`, etc.) en lugar de `<div>` para todo. Esto mejora el SEO y la accesibilidad.

### c. Aplicar Clases del Módulo de CSS

Importa el módulo de CSS y aplica las clases a tus elementos HTML. **No uses estilos en línea (inline styles).**

```astro
// Ejemplo: src/components/modules/CaseStudy/ArticleBanner.astro
<section class={styles.banner}>
    <div class={styles.container}>
        <h1 class={styles.title}>{title}</h1>
        ...
    </div>
</section>
```

## 3. Estilización con CSS Modules (`.module.css`)

El archivo `.module.css` contiene todos los estilos para tu componente.

### a. Diseño Mobile-First y Responsivo

Comienza escribiendo los estilos para dispositivos móviles primero. Luego, usa media queries para adaptar el diseño a pantallas más grandes. Evita tamaños fijos (ej. `width: 1200px`); en su lugar, usa `max-width: 1200px` y anchos fluidos como `width: 100%`.

```css
/* Estilos base (mobile-first) */
.container {
    width: 100%;
    padding: 0 20px;
}

.title {
    font-size: 36px;
    line-height: 40px;
}

/* Estilos para pantallas más grandes */
@media (min-width: 768px) {
    .title {
        font-size: 48px;
        line-height: 52px;
    }
}
```

### b. Usar Variables y Clases Tipográficas Globales

Utiliza las variables de CSS definidas en `src/styles/global.css` para fuentes, colores y otros valores de diseño. Esto mantiene la consistencia en todo el sitio.

```css
.title {
    font-family: var(--font-secondary); /* Correcto */
    color: var(--text-primary); /* Correcto */
}
```

Si ya existen clases tipográficas que se ajustan a tus necesidades en `global.css`, puedes usarlas directamente en tu componente Astro si es necesario (aunque es preferible mantener los estilos encapsulados en el módulo CSS).

### c. Evitar Posicionamiento Absoluto para el Layout

Para el layout principal, evita `position: absolute`. Como se hizo en el refactor de `ArticleSection`, es mejor usar Flexbox o Grid para crear una estructura que fluya naturalmente y sea inherentemente responsiva. El posicionamiento absoluto debe reservarse para pequeños adornos o elementos superpuestos que no afecten al layout general.

## Resumen

Al seguir estas prácticas, crearás componentes que son:
-   **Mantenibles:** Los estilos están encapsulados y son fáciles de encontrar y modificar.
-   **Responsivos:** Se ven bien en todos los dispositivos.
-   **Consistentes:** Mantienen la coherencia visual con el resto del sitio.
-   **Performantes:** Astro puede optimizar mejor los estilos y el marcado.
