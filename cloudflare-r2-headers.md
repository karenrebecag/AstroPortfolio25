# Configuración de Headers de Cache para Cloudflare R2

## Problema
Los recursos de Cloudflare R2 no tienen headers de cache configurados, causando que se descarguen en cada visita.

## Solución
Configurar Transform Rules en Cloudflare para agregar headers de cache:

### 1. Ir a Cloudflare Dashboard
- Seleccionar tu dominio
- Ir a "Rules" > "Transform Rules"

### 2. Crear Response Header Modification Rule
```
Rule Name: R2 Cache Headers
Field: hostname
Operator: equals
Value: pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev

Actions:
- Set static header: Cache-Control = public, max-age=31536000, immutable
- Set static header: Expires = (1 year from now)
```

### 3. Crear otra regla para el otro bucket
```
Rule Name: R2 Cache Headers Portfolio
Field: hostname  
Operator: equals
Value: pub-2e7dc04d482146c59f472ab28fba09a9.r2.dev

Actions:
- Set static header: Cache-Control = public, max-age=31536000, immutable
- Set static header: Expires = (1 year from now)
```

### 4. Verificar
Después de configurar, verificar con:
```bash
curl -I https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Median.woff2
```

Deberías ver:
```
Cache-Control: public, max-age=31536000, immutable
```
