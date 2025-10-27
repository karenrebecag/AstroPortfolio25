# 🚀 On-Demand ISR Setup Guide

## ¿Qué hace esto?

Permite que tu portfolio se **actualice automáticamente** cuando cambies contenido en el CMS, **sin hacer redeploy manual**.

## 📋 Configuración Paso a Paso

### 1. Generar Tokens Seguros

Ejecuta esto en tu terminal para generar 2 tokens seguros:

```bash
# Token 1: ISR Bypass Token (para Vercel)
openssl rand -base64 32

# Token 2: Revalidate Token (para webhook)
openssl rand -base64 32
```

Guarda estos tokens, los necesitarás en los siguientes pasos.

### 2. Configurar Variables en Vercel - PORTFOLIO

Ve a tu proyecto de Astro en Vercel → Settings → Environment Variables

Agrega estas 3 variables:

```env
PUBLIC_CMS_URL=https://astro-portfolio-cms-delta.vercel.app
ISR_BYPASS_TOKEN=<pega-aqui-el-token-1>
REVALIDATE_TOKEN=<pega-aqui-el-token-2>
```

### 3. Configurar Variables en Vercel - CMS

Ve a tu proyecto del CMS en Vercel → Settings → Environment Variables

Agrega estas 2 variables:

```env
ASTRO_REVALIDATE_URL=https://karenortiz.space/api/revalidate
ASTRO_REVALIDATE_TOKEN=<pega-aqui-el-token-2-mismo-del-paso-2>
```

⚠️ **IMPORTANTE**: `ASTRO_REVALIDATE_TOKEN` debe ser **exactamente igual** a `REVALIDATE_TOKEN` del portfolio.

### 4. Hacer Redeploy

Después de agregar las variables de entorno:

1. **Portfolio**: Ve a Deployments → Click en el último deployment → Redeploy
2. **CMS**: Ve a Deployments → Click en el último deployment → Redeploy

## ✅ Cómo Probar

### Prueba 1: Verificar el Endpoint

```bash
curl https://karenortiz.space/api/revalidate
```

Deberías ver información sobre cómo usar el endpoint.

### Prueba 2: Triggear Revalidación Manualmente

```bash
curl -X POST https://karenortiz.space/api/revalidate \
  -H "x-revalidate-token: TU-REVALIDATE-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"routes": ["/"]}'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "All routes revalidated successfully",
  "results": [
    {
      "route": "/",
      "success": true,
      "cacheStatus": "REVALIDATED",
      "status": 200
    }
  ]
}
```

### Prueba 3: Editar Contenido en el CMS

1. Ve al admin del CMS
2. Edita un servicio, FAQ o proyecto
3. Guarda los cambios
4. **Espera 5-10 segundos**
5. Visita `https://karenortiz.space` en modo incógnito
6. ✅ Deberías ver el contenido actualizado

## 🔧 Troubleshooting

### No se actualizan los cambios

**Verifica las variables de entorno:**
```bash
# En el portfolio
echo $ISR_BYPASS_TOKEN
echo $REVALIDATE_TOKEN
echo $PUBLIC_CMS_URL

# En el CMS
echo $ASTRO_REVALIDATE_URL
echo $ASTRO_REVALIDATE_TOKEN
```

**Revisa los logs del CMS:**
- Ve a Vercel → Tu proyecto CMS → Deployments → Functions
- Busca mensajes que digan "✅ Astro ISR revalidation triggered"

**Limpia el cache del navegador:**
- Abre el sitio en modo incógnito
- O presiona Ctrl+Shift+R (Cmd+Shift+R en Mac)

### Error 401 "Invalid token"

Los tokens no coinciden. Verifica que:
- `REVALIDATE_TOKEN` en el portfolio
- `ASTRO_REVALIDATE_TOKEN` en el CMS
- Sean **exactamente iguales** (sin espacios extras)

### Error 500 "ISR_BYPASS_TOKEN not configured"

Falta el `ISR_BYPASS_TOKEN` en las variables de entorno del portfolio.

### El webhook nunca se ejecuta

Verifica en los logs del CMS si aparece:
- ⚠️ "ASTRO_REVALIDATE_URL or ASTRO_REVALIDATE_TOKEN not configured"

Si ves esto, las variables no están configuradas correctamente en el CMS.

## 📊 Cómo Funciona

```
1. Editas contenido en el CMS
   ↓
2. CMS ejecuta el hook afterChange
   ↓
3. CMS envía POST a /api/revalidate
   ↓
4. Portfolio verifica el token
   ↓
5. Portfolio envía HEAD con x-prerender-revalidate
   ↓
6. Vercel invalida el cache
   ↓
7. Próxima visita regenera la página
   ↓
8. ✅ Usuario ve contenido nuevo
```

## 💡 Beneficios

✅ **Cero rebuilds manuales** - El CMS actualiza el sitio automáticamente
✅ **Actualización instantánea** - Cambios visibles en 5-10 segundos
✅ **Sin downtime** - Las páginas se regeneran en background
✅ **Performance óptima** - Las páginas siguen siendo estáticas
✅ **Fallback robusto** - Si el CMS falla, muestra la última versión cached

## 📝 Archivos Modificados

### Portfolio
- ✅ `astro.config.mjs` - ISR config con bypassToken
- ✅ `src/pages/api/revalidate.ts` - Webhook endpoint
- ✅ `src/pages/index.astro` - Prerender habilitado
- ✅ `.env.local` - Variables de entorno

### CMS
- ✅ `src/lib/revalidate.ts` - Función de revalidación
- ✅ `src/collections/Projects.ts` - Hook afterChange
- ⚠️ `src/collections/Services.ts` - Pendiente agregar hook
- ⚠️ `src/collections/HomeFAQs.ts` - Pendiente agregar hook

## 🎯 Siguiente Paso

Una vez configurado todo, **simplemente edita contenido en el CMS** y los cambios aparecerán automáticamente en el sitio. ¡No más rebuilds manuales!
