# ✨ Karen Ortiz - Portfolio 2025

<div align="center">
  <img src="public/images/BannerImage.webp" alt="Karen Ortiz Portfolio Banner" width="100%" style="border-radius: 10px; margin: 20px 0;" />
  
  <p align="center">
    <strong>🎨 Creative Developer & UI/UX Designer</strong>
  </p>
  
  <p align="center">
    Un portfolio moderno y elegante construido con las últimas tecnologías web
  </p>

  <p align="center">
    <a href="#-características">Características</a> •
    <a href="#-tecnologías">Tecnologías</a> •
    <a href="#-instalación">Instalación</a> •
    <a href="#-estructura">Estructura</a> •
    <a href="#-comandos">Comandos</a>
  </p>
</div>

---

## 🌟 Características

### ✨ **Diseño Moderno**
- **Animaciones Fluidas**: Implementadas con Motion.dev y Three.js
- **Efectos 3D**: Modelos interactivos y shaders GLSL personalizados
- **Responsive Design**: Optimizado para todos los dispositivos
- **Dark Mode**: Tema oscuro elegante y profesional

### 🎯 **Experiencia de Usuario**
- **Smooth Scrolling**: Navegación suave con Lenis
- **Custom Cursor**: Cursor personalizado con efectos magnéticos
- **Interactive Elements**: Botones con efectos realistas y glassmorphism
- **Performance Optimized**: Carga lazy y optimizaciones avanzadas

### 🚀 **Funcionalidades Avanzadas**
- **Formulario de Contacto**: Integrado con Resend para envío de emails
- **Marquee Infinito**: Animaciones de texto y logos empresariales
- **Toast Notifications**: Sistema de notificaciones elegante
- **Scroll Indicator**: Indicador de progreso de scroll con animaciones

---

## 🛠 Tecnologías

### **Frontend Framework**
- **[Astro](https://astro.build/)** - Framework web moderno con Islands Architecture
- **[React 19](https://react.dev/)** - Componentes interactivos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático

### **Styling & Animations**
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Motion.dev](https://motion.dev/)** - Animaciones fluidas y naturales
- **[Three.js](https://threejs.org/)** - Gráficos 3D y efectos WebGL

### **3D & Visual Effects**
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer para Three.js
- **[@react-three/drei](https://docs.pmnd.rs/drei)** - Helpers útiles para Three.js
- **Custom GLSL Shaders** - Efectos visuales personalizados

### **State Management & Utils**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management ligero
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scrolling
- **[Lucide React](https://lucide.dev/)** - Iconos modernos

### **Backend & Email**
- **[Resend](https://resend.com/)** - Servicio de email transaccional
- **[Nodemailer](https://nodemailer.com/)** - Envío de emails

---

## 📦 Instalación

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn

### **Pasos de instalación**

```bash
# 1. Clonar el repositorio
git clone https://github.com/karenortiz/portfolio-2025.git
cd portfolio-2025

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev
```

### **Variables de Entorno**

Crea un archivo `.env.local` con las siguientes variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=your_email@domain.com
TO_EMAIL=your_email@domain.com

# Optional: Analytics, etc.
# GOOGLE_ANALYTICS_ID=your_ga_id
```

---

## 📁 Estructura del Proyecto

```
📦 Port25Karen/
├── 🌐 public/                    # Assets estáticos
│   ├── 🖼️  images/               # Imágenes optimizadas
│   ├── 🎨 fonts/                # Fuentes personalizadas
│   ├── 🎯 favicon/              # Iconos de la aplicación
│   ├── 🎮 models/               # Modelos 3D (.json, .glb)
│   └── 🌈 hdr/                  # Texturas HDR para Three.js
├── 📂 src/
│   ├── 🧩 components/           # Componentes reutilizables
│   │   ├── 🎪 banner/           # Componentes del banner
│   │   ├── 🎨 three/            # Componentes 3D y shaders
│   │   └── 🎯 ui/               # Componentes de interfaz
│   ├── 🏗️  layouts/             # Layouts de página
│   ├── 📚 lib/                  # Utilidades y helpers
│   ├── 📄 pages/                # Páginas del sitio
│   │   ├── 🏠 index.astro       # Página principal
│   │   ├── 📋 cv.astro          # Página de CV
│   │   └── 🔌 api/              # API endpoints
│   └── 🎨 styles/               # Estilos globales
├── ⚙️  astro.config.mjs         # Configuración de Astro
├── 🎨 tailwind.config.js        # Configuración de Tailwind
└── 📝 tsconfig.json             # Configuración de TypeScript
```

---

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
|---------|--------|
| `npm install` | 📦 Instala las dependencias |
| `npm run dev` | 🚀 Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build` | 🏗️ Construye el sitio para producción en `./dist/` |
| `npm run preview` | 👀 Previsualiza la build localmente |
| `npm run lint` | 🔍 Ejecuta ESLint para revisar el código |
| `npm run lint:fix` | 🔧 Corrige automáticamente errores de linting |
| `npm run type-check` | ✅ Verifica los tipos de TypeScript |
| `npm run check` | 🧪 Ejecuta linting y verificación de tipos |

---

## 🎨 Características Técnicas Destacadas

### **🏗️ Islands Architecture**
- Hidratación selectiva con `client:load`, `client:visible`
- Componentes estáticos por defecto para máximo rendimiento
- JavaScript mínimo en el cliente

### **🎭 Animaciones Avanzadas**
- **Motion.dev**: Animaciones declarativas con spring physics
- **Scroll Animations**: Activadas por viewport con `whileInView`
- **Staggered Animations**: Efectos secuenciales elegantes
- **Magnetic Effects**: Botones que siguen el cursor

### **🎮 Gráficos 3D**
- **Custom Shaders**: GLSL para efectos de dithering y waves
- **Performance Optimized**: IntersectionObserver y Page Visibility API
- **Responsive 3D**: Adaptación automática según dispositivo
- **HDR Environments**: Iluminación realista con texturas HDR

### **📱 Responsive Design**
- **Mobile-First**: Diseño optimizado para móviles
- **Clamp() Typography**: Tipografía fluida y responsive
- **Breakpoints**: Sistema consistente de breakpoints
- **Touch Optimized**: Interacciones táctiles mejoradas

---

## 🚀 Deployment

### **Vercel (Recomendado)**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en Vercel Dashboard
```

### **Netlify**
```bash
# 1. Build del proyecto
npm run build

# 2. Deploy la carpeta dist/
# Configurar variables de entorno en Netlify Dashboard
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👩‍💻 Autora

**Karen Rebeca Ortiz**
- 🌐 Portfolio: [karenortiz.dev](https://karenortiz.dev)
- 💼 LinkedIn: [linkedin.com/in/karenortiz](https://linkedin.com/in/karenortiz)
- 📧 Email: karen@karenortiz.dev
- 🐙 GitHub: [@karenortiz](https://github.com/karenortiz)

---

<div align="center">
  <p>⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! ⭐</p>
  <p>Hecho con ❤️ y mucho ☕ por Karen Ortiz</p>
</div>
