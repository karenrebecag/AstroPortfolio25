# 🌙 Dark Mode System Documentation

## Resumen General

Este documento describe el sistema completo de Dark Mode implementado en la página `p_AurinTaskManager.astro`. El sistema permite alternar entre modo claro y oscuro con transiciones suaves, persistencia de estado y cambio dinámico de componentes.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
DarkModeSystem/
├── DarkModeContainer.tsx     # Controlador principal del estado
├── DarkModeToggle.tsx        # Botón de alternancia
├── DynamicFooter.tsx         # Footer que cambia dinámicamente
├── WhiteStickyFooter.tsx     # Footer para modo claro
└── StickyFooter.tsx          # Footer para modo oscuro
```

## 📦 Componentes Detallados

### 1. DarkModeContainer.tsx
**Propósito**: Controlador centralizado del estado de dark mode.

**Características**:
- ✅ Estado centralizado con `useState`
- ✅ Persistencia en `localStorage` con key `'aurin-theme'`
- ✅ Aplicación de clases CSS globales
- ✅ Animaciones Motion.dev coordinadas
- ✅ Hidratación sin flash (FOUC prevention)

**Props**:
```tsx
interface DarkModeContainerProps {
  children: React.ReactNode;
}
```

**Estado**:
```tsx
const [isDark, setIsDark] = useState(false);
const [isClient, setIsClient] = useState(false);
```

**Funcionalidad**:
- Detecta preferencia guardada en localStorage
- Aplica clases CSS al `documentElement`
- Maneja transiciones de `body` background/color
- Renderiza contenido con animaciones Motion.dev

### 2. DarkModeToggle.tsx
**Propósito**: Botón interactivo para alternar entre modos.

**Características**:
- ✅ Iconos animados (Sun/Moon) de Lucide React
- ✅ Switch visual con animación spring
- ✅ Hover effects con Motion.dev
- ✅ Estados responsive

**Props**:
```tsx
interface DarkModeToggleProps {
  onToggle: (isDark: boolean) => void;
  className?: string;
}
```

**Animaciones**:
```tsx
// Botón principal
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Icono rotación
animate={{ rotate: isDark ? 180 : 0 }}

// Switch toggle
animate={{ x: isDark ? 26 : 2 }}
```

### 3. DynamicFooter.tsx
**Propósito**: Renderiza el footer apropiado según el tema.

**Lógica**:
```tsx
export function DynamicFooter({ isDark }: DynamicFooterProps) {
  return isDark ? <StickyFooter /> : <WhiteStickyFooter />;
}
```

**Características**:
- ✅ Cambio condicional sin re-mount
- ✅ Transición suave con AnimatePresence
- ✅ Props mínimas para performance

### 4. WhiteStickyFooter.tsx
**Propósito**: Footer optimizado para modo claro.

**Diferencias vs StickyFooter**:
- 🎨 Background: `#ffffff` vs `#111111`
- 🔤 Texto: `#1f2937` vs `#ffffff`
- 🎨 Cards: `#f8f9fa` vs `#1f1f1f`
- 🔘 Botones: `bg-gray-100` vs `bg-white/10`
- 🎭 DitheringShader: `colorBack="#ffffff"`

## 🎨 Sistema de Estilos CSS

### Clases Globales
```css
:global(.dark-mode) {
  color-scheme: dark;
}

:global(.light-mode) {
  color-scheme: light;
}
```

### Elementos Afectados

#### HeaderPill
```css
:global(.dark-mode .header-pill) {
  background: rgba(17, 17, 17, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

#### Contenido Principal
```css
:global(.dark-mode .main-content) {
  background: #111111;
  color: #ffffff;
}
```

#### Feature Cards
```css
:global(.dark-mode .feature-card) {
  background: #1f1f1f;
  border-color: #333333;
  color: #ffffff;
}
```

#### Tech Tags
```css
:global(.dark-mode .tech-tag) {
  background: #1f1f1f;
  border-color: #333333;
  color: #4523AE;
}
```

### Transiciones Suaves
```css
:global(.header-pill),
:global(.main-content),
:global(.feature-card),
:global(.tech-tag) {
  transition: 
    background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
    color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
    border-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## 🎭 Animaciones Motion.dev

### Container Principal
```tsx
<motion.div 
  animate={{
    backgroundColor: isDark ? '#111111' : '#ffffff',
    color: isDark ? '#ffffff' : '#1f2937'
  }}
  transition={{
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94]
  }}
>
```

### Footer con AnimatePresence
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={isDark ? 'dark-footer' : 'light-footer'}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    <DynamicFooter isDark={isDark} />
  </motion.div>
</AnimatePresence>
```

### Toggle Button
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
>
```

## 💾 Persistencia de Estado

### LocalStorage
- **Key**: `'aurin-theme'`
- **Values**: `'light'` | `'dark'`
- **Default**: `'light'` (modo claro por defecto)

### Implementación
```tsx
useEffect(() => {
  const savedTheme = localStorage.getItem('aurin-theme');
  const shouldBeDark = savedTheme === 'dark';
  setIsDark(shouldBeDark);
}, []);

const handleToggle = (newIsDark: boolean) => {
  setIsDark(newIsDark);
  localStorage.setItem('aurin-theme', newIsDark ? 'dark' : 'light');
};
```

## 🚀 Integración en Astro

### Estructura de la Página
```astro
<Layout title="Karen Ortiz - Aurin Task Manager" lang="en">
  <HeaderPill />
  
  <ParallaxBanner>
    <!-- Banner content -->
  </ParallaxBanner>

  <DarkModeContainer client:load>
    <main class="main-content" id="main-content">
      <!-- All page content -->
      <section class="content-section" id="overview">
        <!-- Content sections -->
      </section>
    </main>
    <!-- DarkModeToggle and DynamicFooter included automatically -->
  </DarkModeContainer>
</Layout>
```

### Client Directives
- **DarkModeContainer**: `client:load` - Hidrata inmediatamente
- **TextDisperseBlack**: `client:visible` - Hidrata cuando es visible
- **InView**: `client:visible` - Animaciones de scroll

## 🎯 Palette de Colores

### Light Mode
```css
--background: #ffffff
--text-primary: #1f2937
--text-secondary: #666666
--card-background: #f8f9fa
--border: #e9ecef
--accent: #4523AE
```

### Dark Mode
```css
--background: #111111
--text-primary: #ffffff
--text-secondary: #e5e5e5
--card-background: #1f1f1f
--border: #333333
--accent: #4523AE
```

## ⚡ Performance

### Optimizaciones
- ✅ **Client-side only**: Evita SSR mismatch
- ✅ **Single state**: Un boolean controla todo
- ✅ **CSS transitions**: Hardware accelerated
- ✅ **AnimatePresence**: Smooth footer transitions
- ✅ **Cubic bezier**: Professional easing curves

### Timing
- **CSS transitions**: 0.5s
- **Motion.dev animations**: 0.5s - 0.6s
- **Stagger delays**: 0.05s, 0.1s, 0.15s
- **Toggle delay**: 0.2s

## 🧪 Testing

### Estados a Probar
1. **Initial load**: Light mode por defecto
2. **Toggle to dark**: Transición suave a modo oscuro
3. **Toggle to light**: Regreso suave a modo claro
4. **Refresh persistence**: Estado se mantiene tras reload
5. **Footer transition**: Cambio suave entre footers
6. **HeaderPill**: Colores correctos en ambos modos
7. **All text elements**: Todos los textos cambian color

### Elementos Críticos
- HeaderPill background y texto
- Main content background
- Feature cards y tech tags
- TextDisperseBlack titles
- Footer transition
- localStorage persistence

## 🔧 Troubleshooting

### Problemas Comunes

#### Flash of Unstyled Content (FOUC)
**Solución**: `isClient` state previene renderizado hasta hidratación
```tsx
if (!isClient) {
  return <div>{children}<DynamicFooter isDark={false} /></div>;
}
```

#### Elementos no cambian color
**Solución**: Agregar a las transiciones CSS globales
```css
:global(.dark-mode .your-element) {
  color: #ffffff;
}
```

#### Footer no transiciona suavemente
**Solución**: Verificar AnimatePresence con `mode="wait"`
```tsx
<AnimatePresence mode="wait">
  <motion.div key={isDark ? 'dark-footer' : 'light-footer'}>
```

## 📝 Changelog

### v1.0.0 - Sistema Inicial
- ✅ DarkModeContainer con estado centralizado
- ✅ DarkModeToggle con animaciones
- ✅ DynamicFooter con transiciones
- ✅ WhiteStickyFooter para modo claro
- ✅ CSS completo para todos los elementos
- ✅ Persistencia en localStorage
- ✅ Integración con HeaderPill
- ✅ Transiciones Motion.dev coordinadas

## 🎨 Customización

### Agregar Nuevos Elementos
1. Crear estilos dark mode:
```css
:global(.dark-mode .your-element) {
  background: #1f1f1f;
  color: #ffffff;
}
```

2. Agregar a transiciones:
```css
:global(.your-element) {
  transition: 
    background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
    color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Cambiar Colores
Modificar las variables CSS en los estilos dark mode:
```css
:global(.dark-mode .element) {
  --your-color: #your-hex;
}
```

### Ajustar Timing
Cambiar durations en Motion.dev y CSS:
```tsx
transition={{ duration: 0.7 }} // Más lento
```

## 🏆 Best Practices

1. **Consistencia**: Usar mismo timing (0.5s) en CSS y Motion.dev
2. **Performance**: Evitar re-renders innecesarios con keys estables
3. **Accessibility**: Respetar `prefers-reduced-motion`
4. **Persistence**: Siempre guardar preferencia del usuario
5. **Fallbacks**: Proveer estados por defecto para SSR
6. **Testing**: Probar todos los elementos en ambos modos

---

**Autor**: Cascade AI  
**Fecha**: 2025-01-25  
**Versión**: 1.0.0  
**Proyecto**: Karen Ortiz Portfolio - Aurin Task Manager
