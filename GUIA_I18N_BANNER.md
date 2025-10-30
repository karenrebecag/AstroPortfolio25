# Guía Completa: Globalización del Módulo Banner

Esta guía te ayudará a implementar i18n (internacionalización) para todos los textos hardcodeados en el módulo Banner (`src/components/Home/Banner/`).

## 📋 Tabla de Contenidos
1. [Textos Identificados](#textos-identificados)
2. [Paso 1: Actualizar Traducciones](#paso-1-actualizar-traducciones)
3. [Paso 2: Actualizar LeftMarqueeBanner](#paso-2-actualizar-leftmarqueebanner)
4. [Paso 3: Actualizar RightMarqueeBanner](#paso-3-actualizar-rightmarqueebanner)
5. [Paso 4: Actualizar Banner.astro](#paso-4-actualizar-bannerastro)
6. [Paso 5: Verificar y Probar](#paso-5-verificar-y-probar)

---

## Textos Identificados

### LeftMarqueeBanner.astro
- **Texto:** `CREATIVE • DEVELOPER • DESIGNER • PORTFOLIO •`
- **Línea:** 15, 18, 21, 24, 27, 30

### RightMarqueeBanner.astro
- **Texto:** `FRONTEND • BACKEND • FULLSTACK • PROJECTS •`
- **Línea:** 15

### Banner.astro
- **Texto:** `Projects` (botón)
- **Línea:** 31
- **Texto:** `Get my Resume` (botón)
- **Línea:** 32

---

## Paso 1: Actualizar Traducciones

Edita el archivo **`src/i18n/translations.js`** y agrega las siguientes traducciones para todos los idiomas.

### 1.1 Agregar keys en inglés (en)

Busca la sección `en:` y agrega el bloque `banner:` después de `hero:`:

```javascript
hero: {
  title: 'Full Stack Developer',
  subtitle: 'Creating exceptional web experiences with React, Astro and Three.js',
  cta: 'View Projects'
},
banner: {
  leftMarquee: 'CREATIVE • DEVELOPER • DESIGNER • PORTFOLIO •',
  rightMarquee: 'FRONTEND • BACKEND • FULLSTACK • PROJECTS •',
  projectsButton: 'Projects',
  resumeButton: 'Get my Resume'
},
```

### 1.2 Agregar keys en español (es)

Busca la sección `es:` y agrega:

```javascript
banner: {
  leftMarquee: 'CREATIVA • DESARROLLADORA • DISEÑADORA • PORTAFOLIO •',
  rightMarquee: 'FRONTEND • BACKEND • FULLSTACK • PROYECTOS •',
  projectsButton: 'Proyectos',
  resumeButton: 'Ver mi CV'
},
```

### 1.3 Agregar keys en francés (fr)

Busca la sección `fr:` y agrega:

```javascript
banner: {
  leftMarquee: 'CRÉATIVE • DÉVELOPPEUSE • DESIGNEUSE • PORTFOLIO •',
  rightMarquee: 'FRONTEND • BACKEND • FULLSTACK • PROJETS •',
  projectsButton: 'Projets',
  resumeButton: 'Voir mon CV'
},
```

### 1.4 Agregar keys en hindi (hi)

Busca la sección `hi:` y agrega:

```javascript
banner: {
  leftMarquee: 'रचनात्मक • डेवलपर • डिज़ाइनर • पोर्टफोलियो •',
  rightMarquee: 'फ्रंटएंड • बैकएंड • फुलस्टैक • प्रोजेक्ट्स •',
  projectsButton: 'परियोजनाएँ',
  resumeButton: 'मेरा रिज्यूमे देखें'
},
```

### 1.5 Agregar keys en japonés (ja)

Busca la sección `ja:` y agrega:

```javascript
banner: {
  leftMarquee: 'クリエイティブ • デベロッパー • デザイナー • ポートフォリオ •',
  rightMarquee: 'フロントエンド • バックエンド • フルスタック • プロジェクト •',
  projectsButton: 'プロジェクト',
  resumeButton: '履歴書を見る'
},
```

### 1.6 Agregar keys en chino simplificado (zh-cn)

Busca la sección `zh-cn:` (o `'zh-cn':`) y agrega:

```javascript
banner: {
  leftMarquee: '创意 • 开发者 • 设计师 • 作品集 •',
  rightMarquee: '前端 • 后端 • 全栈 • 项目 •',
  projectsButton: '项目',
  resumeButton: '查看简历'
},
```

### 1.7 Agregar keys en chino tradicional (zh-tw)

Busca la sección `zh-tw:` (o `'zh-tw':`) y agrega:

```javascript
banner: {
  leftMarquee: '創意 • 開發者 • 設計師 • 作品集 •',
  rightMarquee: '前端 • 後端 • 全端 • 專案 •',
  projectsButton: '專案',
  resumeButton: '查看履歷'
},
```

---

## Paso 2: Actualizar LeftMarqueeBanner

Edita **`src/components/Home/Banner/LeftMarqueeBanner.astro`**

### 2.1 Importar función de traducción

En la parte superior del frontmatter (sección `---`), agrega:

```astro
---
// LeftMarqueeBanner - Large animated text moving from right to left
import styles from './LeftMarqueeBanner.module.css';
import { getTranslations } from '../../../i18n/utils.js';

const { lang = 'en' } = Astro.props;
const t = getTranslations(lang);
---
```

### 2.2 Reemplazar textos hardcodeados

Reemplaza todas las instancias del texto hardcodeado con la variable de traducción.

**Antes:**
```html
<span class="marquee-content">
  CREATIVE • DEVELOPER • DESIGNER • PORTFOLIO •
</span>
```

**Después:**
```html
<span class="marquee-content">
  {t.banner.leftMarquee}
</span>
```

Esto debe hacerse en **TODAS** las 6 instancias (líneas 14-31).

**Resultado final del contenido del marquee:**
```html
<div
  id="left-marquee"
  class="whitespace-nowrap font-display font-bold select-none text-right"
  style="font-size: clamp(163px, 32.6vw, 326px); background: linear-gradient(90deg, #b190ff, #7449ff); background-clip: text; -webkit-background-clip: text; color: transparent; width: max-content; text-shadow: 0px 4px 8px rgba(59, 2, 111, 0.3); height: clamp(163px, 32.6vw, 326px); line-height: 1; will-change: transform; contain: layout style paint;"
>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
  <span class="marquee-content">
    {t.banner.leftMarquee}
  </span>
</div>
```

---

## Paso 3: Actualizar RightMarqueeBanner

Edita **`src/components/Home/Banner/RightMarqueeBanner.astro`**

### 3.1 Importar función de traducción

En la parte superior del frontmatter:

```astro
---
// RightMarqueeBanner - Large animated text moving from left to right
import styles from './RightMarqueeBanner.module.css';
import { getTranslations } from '../../../i18n/utils.js';

const { lang = 'en' } = Astro.props;
const t = getTranslations(lang);
---
```

### 3.2 Reemplazar texto hardcodeado

**Antes:**
```html
<span class="marquee-content">
  FRONTEND • BACKEND • FULLSTACK • PROJECTS • FRONTEND • BACKEND • FULLSTACK • PROJECTS • FRONTEND • BACKEND • FULLSTACK • PROJECTS •
</span>
```

**Después:**
```html
<span class="marquee-content">
  {t.banner.rightMarquee.repeat(3)}
</span>
```

**Resultado final del contenido del marquee:**
```html
<div
  id="right-marquee"
  class="whitespace-nowrap font-display font-bold text-gray-1000/50 select-none text-left"
  style="font-size: clamp(163px, 32.6vw, 326px); width: max-content; text-shadow: 0px 4px 8px rgba(2, 2, 2, 0.398); height: clamp(163px, 32.6vw, 326px); line-height: 1; will-change: transform; contain: layout style paint;"
>
  <span class="marquee-content">
    {t.banner.rightMarquee.repeat(3)}
  </span>
</div>
```

---

## Paso 4: Actualizar Banner.astro

Edita **`src/components/Home/Banner/Banner.astro`**

### 4.1 Importar función de traducción

En la parte superior del frontmatter:

```astro
---
// Banner component integrating BannerButtonsWrapper and Marquees
import styles from './Banner.module.css';
import BannerButtonsWrapper from './BannerButtonsWrapper.astro';
import BannerMarqueesWrapper from './BannerMarqueesWrapper.astro';
import MainButton from '../../modules/Header/MainButton.astro';
import SecondaryButton from '../../ui/SecondaryButton.astro';
import { getTranslations } from '../../../i18n/utils.js';

const { lang = 'en' } = Astro.props;
const t = getTranslations(lang);
---
```

### 4.2 Pasar prop `lang` a componentes hijos

Actualiza la llamada a `BannerMarqueesWrapper`:

**Antes:**
```html
<BannerMarqueesWrapper />
```

**Después:**
```html
<BannerMarqueesWrapper lang={lang} />
```

### 4.3 Reemplazar textos de botones

**Antes:**
```html
<div class={`${styles.bannerButtonsWrapper} banner-buttons`}>
  <SecondaryButton text="Projects" />
  <MainButton text="Get my Resume" href="/resume" />
</div>
```

**Después:**
```html
<div class={`${styles.bannerButtonsWrapper} banner-buttons`}>
  <SecondaryButton text={t.banner.projectsButton} />
  <MainButton text={t.banner.resumeButton} href="/resume" />
</div>
```

---

## Paso 5: Actualizar BannerMarqueesWrapper

Edita **`src/components/Home/Banner/BannerMarqueesWrapper.astro`**

### 5.1 Pasar prop `lang` a componentes hijos

Agrega la prop `lang` al frontmatter y pásala a los marquees:

```astro
---
import LeftMarqueeBanner from './LeftMarqueeBanner.astro';
import RightMarqueeBanner from './RightMarqueeBanner.astro';

const { lang = 'en' } = Astro.props;
---

<div class="banner-marquees-wrapper">
  <LeftMarqueeBanner lang={lang} />
  <RightMarqueeBanner lang={lang} />
</div>
```

---

## Paso 6: Actualizar páginas que usan Banner

Asegúrate de que todas las páginas que usan el componente Banner pasen la prop `lang`.

### Ejemplo para index.astro

Edita **`src/pages/index.astro`**:

**Antes:**
```astro
<Banner />
```

**Después:**
```astro
<Banner lang="en" />
```

### Ejemplo para páginas traducidas

Para `src/pages/es/index.astro`:
```astro
<Banner lang="es" />
```

Para `src/pages/ja/index.astro`:
```astro
<Banner lang="ja" />
```

Y así sucesivamente para cada idioma.

---

## Paso 7: Verificar y Probar

### 7.1 Ejecutar el servidor de desarrollo

```bash
pnpm run dev
```

### 7.2 Probar en diferentes idiomas

Visita las siguientes URLs para verificar que las traducciones funcionen:

- **Inglés:** `http://localhost:4322/`
- **Español:** `http://localhost:4322/es/`
- **Francés:** `http://localhost:4322/fr/`
- **Hindi:** `http://localhost:4322/hi/`
- **Japonés:** `http://localhost:4322/ja/`
- **Chino Simplificado:** `http://localhost:4322/zh-cn/`
- **Chino Tradicional:** `http://localhost:4322/zh-tw/`

### 7.3 Verificar que los marquees muestren el texto correcto

✅ **LeftMarquee** debe mostrar el texto traducido correspondiente
✅ **RightMarquee** debe mostrar el texto traducido repetido 3 veces
✅ **Botones** deben mostrar el texto traducido

### 7.4 Verificar que las fuentes se rendericen correctamente

- **Japonés:** Debe usar Rampart One, Kosugi Maru, DotGothic16
- **Hindi:** Debe usar Sarala Regular y Bold
- **Chino Simplificado:** Debe usar Noto Sans SC
- **Chino Tradicional:** Debe usar Chocolate Classical Sans

---

## 📝 Notas Importantes

1. **No traduzcas textos que vienen de Payload CMS** - Esos se traducen desde el CMS
2. **Mantén el separador `•`** en todas las traducciones de marquees para consistencia visual
3. **Usa MAYÚSCULAS** para los textos de marquees (excepto en idiomas como japonés/chino donde no aplica)
4. **El método `.repeat(3)`** en RightMarquee asegura que haya suficiente contenido para la animación fluida

---

## ✅ Checklist Final

- [ ] Traducciones agregadas en `src/i18n/translations.js` para todos los idiomas
- [ ] `LeftMarqueeBanner.astro` actualizado con i18n
- [ ] `RightMarqueeBanner.astro` actualizado con i18n
- [ ] `Banner.astro` actualizado con i18n
- [ ] `BannerMarqueesWrapper.astro` actualizado para pasar `lang`
- [ ] Páginas de índice actualizadas para pasar `lang` prop
- [ ] Probado en todos los idiomas
- [ ] Fuentes personalizadas renderizando correctamente

---

## 🐛 Troubleshooting

### Problema: Los textos no cambian al cambiar de idioma

**Solución:** Verifica que estés pasando la prop `lang` correctamente en toda la cadena de componentes:
```
index.astro → Banner → BannerMarqueesWrapper → LeftMarqueeBanner/RightMarqueeBanner
```

### Problema: Error "Cannot read property 'banner' of undefined"

**Solución:** Asegúrate de que todas las secciones de idioma en `translations.js` tengan el bloque `banner:` definido.

### Problema: Las fuentes no se cargan en idiomas específicos

**Solución:** Verifica que el condicional en `Layout.astro` (líneas 117-146) esté correctamente configurado para precargar las fuentes según el idioma.

---

## 📚 Referencias

- Documentación de i18n utils: `src/i18n/utils.js`
- Archivo de traducciones: `src/i18n/translations.js`
- Sistema de fuentes multiidioma: `src/styles/i18n-fonts.css`

---

**¡Listo!** Ahora tienes el módulo Banner completamente globalizado con soporte para 7 idiomas. 🎉
