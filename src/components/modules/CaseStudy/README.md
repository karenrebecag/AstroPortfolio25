# Case Study Module

Módulo completo para crear páginas de Case Studies dinámicas consumiendo datos de Payload CMS.

## 📁 Estructura

```
CaseStudy/
├── components/          # Componentes Astro reutilizables
│   ├── HeroStrip.astro
│   ├── ContentStrip.astro
│   ├── ProcessStrip.astro
│   ├── SolutionsStrip.astro
│   ├── NavigationStrip.astro
│   ├── FAQStrip.astro
│   └── index.ts
├── types/              # TypeScript types
│   └── caseStudy.ts
├── data/               # Mock data para desarrollo
│   └── mockCaseStudy.ts
├── index.ts            # Main exports
└── README.md
```

## 🎨 Componentes

### HeroStrip
Sección hero con título, tag, fecha de publicación y autor.

**Props:**
- `title` (string): Título del case study
- `mainTag` (string): Tag principal
- `publishedDate` (string): Fecha de publicación
- `author` (Author): Información del autor
- `featuredImage` (string, opcional): Imagen destacada

### ContentStrip
Renderiza bloques de contenido dinámicos (texto, headings, imágenes, quotes, grids).

**Props:**
- `description` (string): Descripción del proyecto
- `content` (ContentBlock[]): Array de bloques de contenido

**Tipos de bloques soportados:**
- `text`: Párrafos de texto
- `heading`: Títulos de sección
- `image`: Imágenes con caption
- `quote`: Citas con autor
- `imageGrid`: Grid de imágenes (2-3 columnas)

### ProcessStrip
Muestra el proceso/workflow del proyecto.

**Props:**
- `title` (string, opcional): Título de la sección
- `subtitle` (string, opcional): Subtítulo
- `steps` (ProcessStep[]): Pasos del proceso

### SolutionsStrip
Sección con soluciones, achievements y pensamientos finales.

**Props:**
- `title` (string, opcional): Título
- `solutions` (Solution[]): Dropdowns con soluciones
- `achievements` (Achievement[], opcional): Logros/métricas
- `finalThoughts` (FinalThoughts, opcional): Conclusiones
- `tags` (string[], opcional): Tags del proyecto

### NavigationStrip
Navegación a proyectos anteriores/siguientes.

**Props:**
- `previousPost` (RelatedPost, opcional): Proyecto anterior
- `nextPost` (RelatedPost, opcional): Proyecto siguiente

### FAQStrip
Sección de preguntas frecuentes con accordion.

**Props:**
- `title` (string, opcional): Título
- `subtitle` (string, opcional): Subtítulo
- `faqs` (FAQ[]): Preguntas y respuestas

## 🔌 Módulos Integrados

El template consume estos módulos existentes:

- **Header**: `/src/components/modules/Header`
- **ShareBar**: `/src/components/modules/ShareBar`
- **Comments**: `/src/components/modules/Comments`
- **GetInTouch**: `/src/components/modules/GetInTouch`
- **Footer**: `/src/components/modules/Footer`
- **Toasts**: Integrado vía Comments module

## 🧪 Página de Prueba

Visita `/case-studies/demo` para ver el template completo con datos mock.

```astro
---
import { mockCaseStudy } from '@/components/modules/CaseStudy/data/mockCaseStudy'
import { HeroStrip, ContentStrip } from '@/components/modules/CaseStudy'
---

<HeroStrip {...mockCaseStudy} />
<ContentStrip description={mockCaseStudy.description} content={mockCaseStudy.content} />
```

## 📝 Tipos TypeScript

Todos los tipos están definidos en `types/caseStudy.ts`:

- `CaseStudy`: Tipo principal del case study
- `ContentBlock`: Bloques de contenido dinámicos
- `ProcessStep`: Pasos del proceso
- `Solution`: Soluciones/resultados
- `Achievement`: Métricas/logros
- `FAQ`: Preguntas frecuentes
- `Author`, `RelatedPost`, etc.

## 🚀 Uso

### 1. Con datos mock (desarrollo)

```astro
---
import { mockCaseStudy } from '@/components/modules/CaseStudy'
import { HeroStrip, ContentStrip } from '@/components/modules/CaseStudy'
---

<HeroStrip {...mockCaseStudy} />
```

### 2. Con Payload CMS (producción)

```astro
---
import { getCaseStudyBySlug } from '@/lib/payload/api'
import { HeroStrip } from '@/components/modules/CaseStudy'

const caseStudy = await getCaseStudyBySlug(Astro.params.slug)
---

<HeroStrip {...caseStudy} />
```

## 📦 Siguiente Paso: Configurar Payload

Una vez que el template esté completo y probado, configuraremos la colección de Payload CMS con todos los campos mapeados a estos tipos.

**Campos a añadir en Payload:**

- ✅ `title`, `slug`, `description` (ya existen)
- ✅ `featuredImage`, `gallery` (ya existen)
- ✅ `technologies` (ya existe)
- 🔜 `processSteps` (array)
- 🔜 `solutions` (array)
- 🔜 `achievements` (array)
- 🔜 `faqs` (array)
- 🔜 `author` (object)
- 🔜 `contentBlocks` (rich text / array)
- 🔜 `previousPost`, `nextPost` (relationships)

## 🎯 Features

- ✅ Type-safe con TypeScript
- ✅ Componentes modulares y reutilizables
- ✅ Responsive design
- ✅ Integración con módulos existentes
- ✅ FAQs por case study
- ✅ Navegación entre proyectos
- ✅ Comentarios habilitables por proyecto
- ✅ Sticky ShareBar
- ✅ Mock data para desarrollo
