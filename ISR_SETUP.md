# ISR (Incremental Static Regeneration) Setup

## ¿Qué es ISR?

ISR permite que tu sitio Astro se actualice automáticamente cuando cambies contenido en el CMS, **sin necesidad de hacer redeploy manual**.

## Cómo Funciona

1. **ISR Automático**: La página se regenera automáticamente cada 60 segundos cuando alguien la visita
2. **Webhook Manual**: El CMS puede forzar una actualización inmediata mediante un webhook

## Configuración

### 1. Variables de Entorno en Vercel (Portfolio)

En tu proyecto de Astro en Vercel, agrega estas variables:

```env
PUBLIC_CMS_URL=https://astro-portfolio-cms-delta.vercel.app
REVALIDATE_TOKEN=<genera-un-token-secreto-aqui>
```

Para generar un token seguro, usa:
```bash
openssl rand -base64 32
```

### 2. Variables de Entorno en Vercel (CMS)

En tu proyecto del CMS en Vercel, agrega:

```env
ASTRO_REVALIDATE_URL=https://karenortiz.space/api/revalidate
ASTRO_REVALIDATE_TOKEN=<el-mismo-token-del-paso-1>
```

### 3. Actualizar Collections del CMS

Agrega hooks a las collections para triggear revalidación:

**Services.ts, HomeFAQs.ts, QuickProjects.ts:**

```typescript
import { CollectionConfig } from 'payload'
import { triggerAstroRevalidation } from '../lib/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  // ... resto de configuración

  hooks: {
    afterChange: [
      async ({ operation }) => {
        if (operation === 'create' || operation === 'update' || operation === 'delete') {
          await triggerAstroRevalidation(['/'])
        }
      },
    ],
  },

  // ... resto de configuración
}
```

## Cómo Usar

### Actualización Automática (ISR)
1. Edita contenido en el CMS
2. Guarda los cambios
3. **Espera hasta 60 segundos**
4. La próxima visita a la página mostrará el contenido actualizado

### Actualización Inmediata (Webhook)
1. Edita contenido en el CMS
2. El hook `afterChange` se ejecuta automáticamente
3. Llama al endpoint `/api/revalidate`
4. La página se marca para regeneración
5. **La próxima visita mostrará el contenido actualizado inmediatamente**

## Testing

### Probar el endpoint de revalidación:

```bash
curl -X POST https://karenortiz.space/api/revalidate \
  -H "x-revalidate-token: tu-token-secreto" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/"]}'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Revalidation triggered",
  "paths": ["/"],
  "timestamp": "2025-01-27T..."
}
```

## Beneficios

✅ **No más rebuilds manuales**: El sitio se actualiza automáticamente
✅ **Actualización rápida**: Cambios visibles en ~60 segundos (o inmediato con webhook)
✅ **Sin downtime**: Las páginas se regeneran en background
✅ **Performance**: Las páginas siguen siendo estáticas y ultrarrápidas
✅ **Fallback**: Si el CMS falla, el sitio muestra la última versión cached

## Troubleshooting

### El contenido no se actualiza

1. **Verifica las variables de entorno** en Vercel (ambos proyectos)
2. **Revisa los logs del CMS** para ver si el webhook se ejecuta
3. **Espera 60 segundos** y recarga la página (limpia cache del navegador)
4. **Prueba el endpoint** manualmente con curl

### Error 401 en el webhook

- Verifica que `REVALIDATE_TOKEN` sea el mismo en ambos proyectos
- Verifica que el token no tenga espacios o saltos de línea

### Error 500 en el endpoint

- Verifica que `REVALIDATE_TOKEN` esté configurado en Vercel
- Revisa los logs de Vercel para más detalles

## Archivos Modificados

### Portfolio (Astro)
- ✅ `src/pages/index.astro` - ISR config agregado
- ✅ `src/pages/api/revalidate.ts` - Webhook endpoint creado
- ✅ `.env.local` - Variables de entorno agregadas

### CMS (Payload)
- ⚠️ `src/lib/revalidate.ts` - Función compartida creada
- ⚠️ `src/collections/Projects.ts` - Hook ya existe, solo actualizar import
- ⚠️ `src/collections/Services.ts` - Agregar hook
- ⚠️ `src/collections/HomeFAQs.ts` - Agregar hook
- ⚠️ `src/collections/QuickProjects.ts` - Agregar hook

**Nota**: Los archivos marcados con ⚠️ en el CMS necesitan ser actualizados manualmente o en un commit separado.
