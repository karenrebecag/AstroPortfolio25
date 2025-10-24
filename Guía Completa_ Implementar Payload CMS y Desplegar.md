<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Guía Completa: Implementar Payload CMS y Desplegarlo en Vercel como Proyecto Separado

## Arquitectura del Proyecto

Tu estrategia de usar un repositorio anidado es excelente para mantener separaciones claras entre tu portfolio y el CMS. Usarás **Git submodules** para lograr esto.[^1][^2]

## Configuración Inicial del Repositorio Anidado

### Paso 1: Crear el Proyecto Payload CMS

Dentro de tu repositorio principal del portfolio, crea el CMS como submodule:

```bash
# En la raíz de tu proyecto portfolio
cd /ruta-a-tu-portfolio

# Crea una carpeta para el CMS (será un submodule)
mkdir payload-cms
cd payload-cms

# Inicializa un nuevo repositorio Git
git init

# Crea el proyecto Payload
npx create-payload-app@latest . --template blank

# Durante la instalación, configura:
# - Database: PostgreSQL o MongoDB (recomiendo PostgreSQL con Neon o Supabase)
# - Nombre del proyecto: tu-portfolio-cms
```


### Paso 2: Configurar como Submodule

```bash
# Vuelve a la raíz de tu portfolio
cd ..

# Crea un repositorio remoto en GitHub para el CMS
# (ejemplo: tu-usuario/portfolio-cms)

# En la carpeta payload-cms, conecta con el remoto
cd payload-cms
git remote add origin https://github.com/tu-usuario/portfolio-cms.git
git add .
git commit -m "Initial Payload CMS setup"
git push -u origin main

# Vuelve al portfolio principal
cd ..

# Elimina la carpeta local (temporal)
rm -rf payload-cms

# Añade como submodule oficial
git submodule add https://github.com/tu-usuario/portfolio-cms.git payload-cms

# Actualiza el .gitignore del portfolio principal
echo "payload-cms/" >> .gitignore

# Commit del submodule
git add .gitmodules
git commit -m "Add Payload CMS as submodule"
```


## Configuración de Payload CMS

### Estructura de Archivos Recomendada

```
payload-cms/
├── src/
│   ├── collections/
│   │   ├── Projects.ts
│   │   ├── BlogPosts.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── globals/
│   │   ├── Header.ts
│   │   └── Footer.ts
│   ├── server.ts
│   └── payload.config.ts
├── .env.local
├── .env.production
├── vercel.json
├── package.json
└── tsconfig.json
```


### payload.config.ts - Configuración Completa

```typescript
// src/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Projects } from './collections/Projects'
import { BlogPosts } from './collections/BlogPosts'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // URL completa de tu CMS desplegado en Vercel
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  
  // Secret para encriptación (genera uno seguro)
  secret: process.env.PAYLOAD_SECRET || '',
  
  // Configuración de base de datos
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // CRÍTICO: Desactiva auto-push en producción
    push: process.env.NODE_ENV === 'development',
  }),
  
  // Editor de texto enriquecido
  editor: lexicalEditor({}),
  
  // Colecciones (tus tipos de contenido)
  collections: [
    Users,
    Projects,
    BlogPosts,
    Media,
  ],
  
  // Contenido global (header, footer, etc.)
  globals: [
    Header,
    Footer,
  ],
  
  // CORS: Permite peticiones desde tu portfolio
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:4321',
    'https://tu-portfolio.vercel.app',
    'https://tu-portfolio-cms.vercel.app',
  ],
  
  // CSRF protection
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:4321',
    'https://tu-portfolio.vercel.app',
  ],
  
  // TypeScript: Genera tipos automáticamente
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  
  // Configuración del panel admin
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Portfolio CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },
  
  // GraphQL habilitado
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  
  // Límites de seguridad
  maxDepth: 5,
  rateLimit: {
    window: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 peticiones
  },
})
```


### Colecciones de Ejemplo

#### Projects.ts - Colección de Proyectos

```typescript
// src/collections/Projects.ts
import { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  
  // Control de acceso
  access: {
    // Lectura pública (para tu portfolio)
    read: () => true,
    // Escritura solo usuarios autenticados
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  
  // Configuración del admin panel
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate'],
    group: 'Content',
  },
  
  // Campos de la colección
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // Soporte multi-idioma
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
    {
      name: 'demoUrl',
      type: 'text',
      admin: {
        placeholder: 'https://demo.example.com',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        placeholder: 'https://github.com/user/repo',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in homepage featured section',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  
  // Versiones y drafts
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  
  // Timestamps automáticos
  timestamps: true,
}
```


#### Media.ts - Gestión de Archivos

```typescript
// src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  
  access: {
    read: () => true,
  },
  
  upload: {
    // Configuración de almacenamiento
    staticDir: 'media', // Local en desarrollo
    
    // Validación de archivos
    mimeTypes: ['image/*', 'video/*'],
    
    // Tamaños de imagen automáticos
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    
    // Límites
    filesRequiredOnCreate: true,
  },
  
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
```


#### Users.ts - Autenticación

```typescript
// src/collections/Users.ts
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  
  auth: {
    tokenExpiration: 7200, // 2 horas
    verify: false, // Desactiva verificación de email en desarrollo
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutos
  },
  
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
    },
  ],
}
```


## Variables de Entorno

### .env.local (Desarrollo)

```bash
# Base de datos (usa Neon.tech o Supabase para PostgreSQL)
DATABASE_URI=postgresql://user:password@localhost:5432/portfolio_dev

# Secret de Payload (genera uno: openssl rand -base64 32)
PAYLOAD_SECRET=tu-secret-super-seguro-aqui

# URL del servidor
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# URL del frontend
FRONTEND_URL=http://localhost:4321

# Desactiva jobs automáticos en serverless
ENABLE_PAYLOAD_AUTORUN=true
ENABLE_PAYLOAD_TASK_SCHEDULE=true
```


### .env.production (Template para Vercel)

```bash
# Configuradas en Vercel Dashboard
DATABASE_URI=
PAYLOAD_SECRET=
PAYLOAD_PUBLIC_SERVER_URL=https://tu-cms.vercel.app
FRONTEND_URL=https://tu-portfolio.vercel.app

# Serverless configuration
ENABLE_PAYLOAD_AUTORUN=false
ENABLE_PAYLOAD_TASK_SCHEDULE=false
CRON_SECRET=
```


## Configuración para Vercel

### vercel.json

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```


### package.json - Scripts Optimizados

```json
{
  "name": "portfolio-cms",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "cross-env NODE_ENV=development next dev",
    "build": "pnpm run payload:generate-types && cross-env NODE_ENV=production next build",
    "start": "cross-env NODE_ENV=production next start",
    "payload": "cross-env NODE_ENV=development payload",
    "payload:generate-types": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload generate:types",
    "payload:migrate:create": "payload migrate:create",
    "payload:migrate": "cross-env NODE_ENV=production payload migrate",
    "payload:seed": "cross-env NODE_ENV=development tsx src/seed.ts"
  },
  "dependencies": {
    "payload": "^3.0.0",
    "@payloadcms/db-postgres": "^3.0.0",
    "@payloadcms/richtext-lexical": "^3.0.0",
    "@payloadcms/next": "^3.0.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "graphql": "^16.8.1",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^19.0.0",
    "cross-env": "^7.0.3",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```


## Despliegue en Vercel

### Paso 1: Crear Proyecto en Vercel

```bash
# En la carpeta payload-cms
cd payload-cms

# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy inicial (solo la primera vez)
vercel

# Sigue el wizard:
# - Setup and deploy: Yes
# - Scope: tu-cuenta
# - Link to existing project: No
# - Project name: portfolio-cms
# - Directory: ./
# - Override settings: No
```


### Paso 2: Configurar Variables de Entorno en Vercel

```bash
# Usando CLI
vercel env add DATABASE_URI production
vercel env add PAYLOAD_SECRET production
vercel env add PAYLOAD_PUBLIC_SERVER_URL production
vercel env add FRONTEND_URL production
vercel env add ENABLE_PAYLOAD_AUTORUN production
vercel env add ENABLE_PAYLOAD_TASK_SCHEDULE production
vercel env add CRON_SECRET production

# O en el Dashboard:
# 1. Ve a tu proyecto en vercel.com
# 2. Settings > Environment Variables
# 3. Añade cada variable para Production, Preview y Development
```


### Paso 3: Configurar Dominio Personalizado (Opcional)

```bash
# En Vercel Dashboard:
# Settings > Domains > Add Domain
# Ejemplo: cms.tu-portfolio.com
```


## Conectar Portfolio con el CMS

### Configuración en tu Portfolio (Astro)

#### astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // ... otras configuraciones
  
  // Variables de entorno
  env: {
    schema: {
      CMS_URL: {
        context: 'server',
        access: 'public',
        default: 'http://localhost:3000',
      },
    },
  },
})
```


#### .env (Portfolio)

```bash
# URL del CMS
CMS_URL=https://tu-cms.vercel.app

# API Key (opcional, para seguridad adicional)
CMS_API_KEY=tu-api-key
```


#### Utilidad para Fetch de Datos

```typescript
// src/lib/payload.ts
interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: any
  featuredImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  technologies: Array<{
    name: string
    icon?: string
  }>
  demoUrl?: string
  githubUrl?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  publishedDate: string
  createdAt: string
  updatedAt: string
}

const CMS_URL = import.meta.env.CMS_URL || 'http://localhost:3000'

/**
 * Cliente para comunicarse con Payload CMS
 */
class PayloadClient {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Elimina trailing slash
    this.apiKey = apiKey
  }

  /**
   * Realiza petición a la API de Payload
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Añade API key si existe
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Cache en producción
        ...(import.meta.env.PROD && {
          next: { revalidate: 3600 }, // 1 hora
        }),
      })

      if (!response.ok) {
        throw new Error(`Payload API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching from Payload CMS:`, error)
      throw error
    }
  }

  /**
   * Obtiene todos los proyectos publicados
   */
  async getProjects(params?: {
    limit?: number
    page?: number
    featured?: boolean
  }): Promise<PayloadResponse<Project>> {
    const queryParams = new URLSearchParams()
    
    // Filtro: solo publicados
    queryParams.set('where[status][equals]', 'published')
    
    if (params?.limit) {
      queryParams.set('limit', params.limit.toString())
    }
    
    if (params?.page) {
      queryParams.set('page', params.page.toString())
    }
    
    if (params?.featured) {
      queryParams.set('where[featured][equals]', 'true')
    }

    // Ordena por fecha de publicación descendente
    queryParams.set('sort', '-publishedDate')

    return this.fetch<PayloadResponse<Project>>(
      `/projects?${queryParams.toString()}`
    )
  }

  /**
   * Obtiene un proyecto por slug
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    const queryParams = new URLSearchParams({
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
    })

    const response = await this.fetch<PayloadResponse<Project>>(
      `/projects?${queryParams.toString()}`
    )

    return response.docs[^0] || null
  }

  /**
   * Obtiene el header global
   */
  async getHeader() {
    return this.fetch('/globals/header')
  }

  /**
   * Obtiene el footer global
   */
  async getFooter() {
    return this.fetch('/globals/footer')
  }
}

// Exporta instancia singleton
export const payloadClient = new PayloadClient(
  CMS_URL,
  import.meta.env.CMS_API_KEY
)

// Exporta tipos
export type { Project, PayloadResponse }
```


#### Ejemplo de Uso en Páginas Astro

```astro
---
// src/pages/projects/[slug].astro
import { payloadClient } from '@/lib/payload'
import Layout from '@/layouts/Layout.astro'

export async function getStaticPaths() {
  const { docs: projects } = await payloadClient.getProjects({ limit: 100 })
  
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }))
}

const { project } = Astro.props
---

<Layout title={project.title}>
  <article class="project">
    <header>
      <h1>{project.title}</h1>
      <p class="description">{project.description}</p>
      
      {project.featuredImage && (
        <img
          src={project.featuredImage.url}
          alt={project.featuredImage.alt}
          width={project.featuredImage.width}
          height={project.featuredImage.height}
          loading="eager"
        />
      )}
    </header>

    <section class="content">
      <!-- Renderiza el contenido rich text -->
      <div set:html={project.content} />
    </section>

    <aside class="technologies">
      <h2>Technologies Used</h2>
      <ul>
        {project.technologies.map((tech) => (
          <li>
            {tech.icon && <img src={tech.icon} alt={tech.name} />}
            <span>{tech.name}</span>
          </li>
        ))}
      </ul>
    </aside>

    <footer class="project-links">
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noopener">
          View Demo
        </a>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener">
          View Code
        </a>
      )}
    </footer>
  </article>
</Layout>
```

```astro
---
// src/pages/index.astro
import { payloadClient } from '@/lib/payload'
import Layout from '@/layouts/Layout.astro'
import ProjectCard from '@/components/ProjectCard.astro'

// Obtiene proyectos destacados
const { docs: featuredProjects } = await payloadClient.getProjects({
  featured: true,
  limit: 6,
})
---

<Layout title="Portfolio">
  <section class="hero">
    <h1>Welcome to My Portfolio</h1>
  </section>

  <section class="featured-projects">
    <h2>Featured Projects</h2>
    <div class="grid">
      {featuredProjects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  </section>
</Layout>
```


## Tips de Desarrolladores Experimentados

### 1. Migraciones en Lugar de Auto-Push[^3]

```bash
# NUNCA uses push: true en producción
# Usa migraciones para control total

# Genera migración después de cambiar schema
pnpm payload migrate:create

# Revisa el archivo generado en /migrations

# Aplica en producción
pnpm payload migrate
```


### 2. Configuración de CORS Específica[^4][^5]

```typescript
// payload.config.ts
cors: [
  process.env.FRONTEND_URL,
  'https://tu-dominio.com',
  'https://preview.tu-dominio.com',
],
csrf: [
  process.env.FRONTEND_URL,
  'https://tu-dominio.com',
],
```


### 3. Cron Jobs para Serverless[^6][^7]

```typescript
// src/app/api/cron/cleanup/route.ts
import { NextResponse } from 'next/server'

const isAuthorized = (req: Request): boolean => {
  const authHeader = req.headers.get('authorization') || ''
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Lógica de limpieza
  console.log('[CRON] Running cleanup...')
  
  return NextResponse.json({ success: true })
}
```


### 4. Almacenamiento de Archivos en Vercel[^8]

Vercel no soporta almacenamiento persistente. Usa:

- **Vercel Blob** (recomendado para Vercel)
- **Cloudflare R2** (más económico)
- **AWS S3** (más flexible)

```typescript
// Ejemplo con Vercel Blob
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```


### 5. Workflow de Trabajo con Submodules[^1]

```bash
# Trabajar en el CMS
cd payload-cms
git checkout -b feature/nueva-coleccion
# ... hacer cambios ...
git add .
git commit -m "Add new collection"
git push origin feature/nueva-coleccion

# Volver al portfolio principal
cd ..
git status # Verá cambios en payload-cms (nuevo commit)
git add payload-cms
git commit -m "Update CMS to latest version"
git push
```


### 6. Despliegue Automático

#### GitHub Actions para CMS

```yaml
# payload-cms/.github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```


### 7. Seguridad y Performance

```typescript
// payload.config.ts - Configuración de seguridad
export default buildConfig({
  // Rate limiting
  rateLimit: {
    window: 15 * 60 * 1000, // 15 min
    max: 100,
    trustProxy: true, // Para Vercel
  },
  
  // Límites de payload
  maxDepth: 5,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  
  // Cache control
  graphQL: {
    maxComplexity: 1000,
    disablePlaygroundInProduction: true,
  },
})
```


### 8. Monitoreo y Logs

```typescript
// payload.config.ts - Logger personalizado
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export default buildConfig({
  logger,
  onInit: async (payload) => {
    payload.logger.info(`✅ Payload Admin URL: ${payload.getAdminURL()}`)
  },
})
```


## Checklist Final de Despliegue

### Pre-Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] Base de datos PostgreSQL creada (Neon/Supabase)
- [ ] `push: false` en db adapter
- [ ] Migraciones creadas y probadas
- [ ] CORS configurado con URLs de producción
- [ ] Almacenamiento de archivos configurado (Vercel Blob/S3)
- [ ] Secret de CRON generado


### Durante Despliegue

- [ ] Deploy del CMS: `vercel --prod`
- [ ] Ejecutar migraciones en producción
- [ ] Verificar que el admin panel carga
- [ ] Crear primer usuario admin
- [ ] Subir contenido de prueba


### Post-Despliegue

- [ ] Verificar CORS desde el frontend
- [ ] Probar fetch de datos desde portfolio
- [ ] Verificar generación de imágenes
- [ ] Configurar dominio personalizado
- [ ] Configurar GitHub Actions (CI/CD)
- [ ] Documentar URLs y credenciales

Esta arquitectura te proporciona separación completa entre CMS y frontend, permitiendo escalar independientemente cada parte. El uso de submodules mantiene tu repositorio limpio mientras facilita el desarrollo integrado.[^9][^10][^2][^1]
<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73]</span>

<div align="center">⁂</div>

[^1]: https://www.buildwithmatija.com/blog/git-submodules-nested-repositories-guide

[^2]: https://blog.bitsrc.io/how-to-utilize-submodules-within-git-repos-5dfdd1c62d09

[^3]: https://www.buildwithmatija.com/blog/how-to-build-ecommerce-with-payload-cms

[^4]: https://payloadcms.com/community-help/discord/whats-the-best-way-to-secure-api-endpoints-and-allow-it-only-from-the-front-end

[^5]: https://payloadcms.com/community-help/github/cors-configuration-ineffective

[^6]: https://payloadcms.com

[^7]: https://dev.to/aaronksaunders/run-payload-jobs-on-vercel-serverless-step-by-step-migration-aj9

[^8]: https://payloadcms.com/posts/guides/how-to-configure-file-storage-in-payload-with-vercel-blob-r2-and-uploadthing

[^9]: https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload

[^10]: https://payloadcms.com/community-help/github/question-is-there-a-recommended-approach-to-split-deployments

[^11]: http://arxiv.org/pdf/2110.08588.pdf

[^12]: https://computingonline.net/computing/article/view/704

[^13]: http://arxiv.org/pdf/2410.16569.pdf

[^14]: https://arxiv.org/pdf/1905.07314.pdf

[^15]: http://arxiv.org/pdf/2503.05495.pdf

[^16]: https://wjaets.com/sites/default/files/WJAETS-2023-0226.pdf

[^17]: https://arxiv.org/pdf/2202.09683.pdf

[^18]: http://arxiv.org/pdf/2409.14341.pdf

[^19]: https://www.reddit.com/r/PayloadCMS/comments/1nhv47w/deploying_nextjs_and_payload_cms_same_app_on/

[^20]: https://www.q2bstudio.com/nuestro-blog/25713/ejecutar-trabajos-de-payload-en-vercel-serverless-migracion-paso-a-paso

[^21]: https://docs.astro.build/es/guides/deploy/vercel/

[^22]: https://www.youtube.com/watch?v=YNvPbu6vFtc

[^23]: https://github.com/johnlomat/portfolio-payload-cms

[^24]: https://blog.designly.biz/how-to-create-a-full-stack-blog-with-payload-cms-next-js-and-turbo

[^25]: https://www.youtube.com/watch?v=h3NVEN2iy6k

[^26]: https://payloadcms.com/posts/guides

[^27]: https://www.reddit.com/r/PayloadCMS/comments/1ih3xiy/payload_cms_nextjs_frontend_in_one_repo_best/

[^28]: https://www.youtube.com/watch?v=5UTVV_ZFG7s

[^29]: https://www.reddit.com/r/PayloadCMS/comments/1ibdann/deploying_payload_website_template_to_vercel/

[^30]: https://payloadcms.com/community-help/discord/payload-and-nextjs-same-or-separate-repo-environment

[^31]: https://payloadcms.com/community-help/discord/when-to-use-and-not-use-a-mono-repo

[^32]: https://docs.astro.build/es/guides/cms/payload/

[^33]: https://payloadcms.com/community-help/discord/deploying-to-vercel

[^34]: https://payloadcms.com/posts/blog/how-to-build-a-website-blog-or-portfolio-with-nextjs

[^35]: https://www.buildwithmatija.com/blog/payload-cms-collection-structure-best-practices

[^36]: https://ijsrmst.com/index.php/ijsrmst/article/view/216

[^37]: https://dl.acm.org/doi/10.1145/3159450.3162203

[^38]: http://link.springer.com/10.1007/11948148

[^39]: https://researchonline.jcu.edu.au/56908/

[^40]: https://www.epj-conferences.org/10.1051/epjconf/202024505028

[^41]: https://www.semanticscholar.org/paper/c54b2c2918690e66bc3437f0235a233698bfc852

[^42]: https://www.semanticscholar.org/paper/e62f9da1bb24ee59b599f16387310642af4e9e55

[^43]: https://ieeexplore.ieee.org/document/10132271/

[^44]: https://www.semanticscholar.org/paper/994bfbd6513078bd0381e64ca935dbcb1cf89225

[^45]: https://arxiv.org/pdf/2501.18225.pdf

[^46]: https://arxiv.org/pdf/2004.05688.pdf

[^47]: https://arxiv.org/html/2503.07358v1

[^48]: http://arxiv.org/pdf/1906.04622.pdf

[^49]: https://www.mdpi.com/1999-4893/15/10/382/pdf?version=1666160697

[^50]: https://arxiv.org/pdf/2408.11631.pdf

[^51]: https://arxiv.org/pdf/2203.13737.pdf

[^52]: https://www.mdpi.com/2304-6775/7/2/30/pdf?version=1556271298

[^53]: https://stackoverflow.com/questions/1535524/git-submodule-inside-of-a-submodule-nested-submodules

[^54]: https://payloadcms.com/docs/configuration/overview

[^55]: https://www.reddit.com/r/git/comments/115swlb/how_to_split_up_a_project_with_nested_submodules/

[^56]: https://payloadcms.com/docs/local-api/outside-nextjs

[^57]: https://github.com/payloadcms/payload/discussions/395

[^58]: https://apps.crossref.org/webDeposit/

[^59]: http://pubs.rsna.org/doi/10.1148/ryai.240739

[^60]: https://arxiv.org/abs/2401.16274

[^61]: https://www.semanticscholar.org/paper/d7701b26cb5c7bcef418822dc246dbc6a629e0b1

[^62]: http://arxiv.org/pdf/0706.3008.pdf

[^63]: http://cds.cern.ch/record/1306542/files/05773464.pdf

[^64]: https://arxiv.org/pdf/2502.20825.pdf

[^65]: http://serials.uksg.org/articles/10.1629/1751/galley/778/download/

[^66]: https://kevinchandraofficial.com/blog/integrate-payload-cms-with-next-js/

[^67]: https://payloadcms.com/docs/configuration/environment-vars

[^68]: https://payloadcms.com/docs/production/deployment

[^69]: https://buildwithmatija.com/blog/payload-cms-instant-development-workflow

[^70]: https://www.reddit.com/r/PayloadCMS/comments/1hyzk4k/best_practices_for_pushing_dev_content_to_prod/

[^71]: https://community.vercel.com/t/environment-vars/9043

[^72]: https://makersden.io/blog/is-payloadcms-with-astros-the-killer-marketing-site-combo-of-2025

[^73]: https://vercel.com/docs/integrations/cms

