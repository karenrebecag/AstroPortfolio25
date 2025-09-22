# 🎬 Estándares de Animaciones con Motion.dev

## Filosofía de Animación

Las animaciones deben ser **sutiles, smooth y finas** - mejorando la experiencia del usuario sin ser intrusivas. Cada animación debe tener un propósito claro: guiar la atención, proporcionar feedback o crear una sensación de fluidez.

## 📋 Principios Fundamentales

### 1. **Sutileza sobre Espectáculo**
- Las animaciones deben sentirse naturales, no llamativas
- Prefiere movimientos pequeños y elegantes
- Evita animaciones que distraigan del contenido

### 2. **Performance First**
- Usa `viewport: { once: true }` para animaciones de scroll
- Implementa animaciones que no afecten el layout (transform, opacity)
- Limita animaciones simultáneas complejas

### 3. **Consistencia Visual**
- Mantén duraciones y easings consistentes en toda la aplicación
- Usa la misma familia de transiciones para elementos similares

## 🎯 Patrones de Animación Estándar

### **Animaciones de Aparición (Scroll)**

```tsx
// Patrón estándar para elementos que aparecen en scroll
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Contenido */}
</motion.div>
```

**Configuración:**
- `initial`: `{ opacity: 0, y: 30 }` - Invisible y 30px abajo
- `whileInView`: `{ opacity: 1, y: 0 }` - Visible y posición final
- `viewport`: `{ once: true, margin: "-100px" }` - Ejecuta una vez, 100px antes
- `transition`: `{ duration: 0.6, ease: "easeOut" }` - Duración suave

### **Animaciones Staggered (Secuenciales)**

```tsx
// Para listas o elementos múltiples
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, delay: 0.1 * index }} // Delay incremental
>
  {/* Elemento de lista */}
</motion.div>
```

**Configuración de Delays:**
- Primer elemento: `delay: 0.1`
- Segundo elemento: `delay: 0.2`
- Incremento: `0.1s` por elemento
- Máximo recomendado: `1.2s` total

### **Animaciones de Hover**

```tsx
// Hover sutil para botones y elementos interactivos
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  {/* Contenido del botón */}
</motion.button>
```

**Configuración:**
- `whileHover`: `{ scale: 1.05, y: -2 }` - Escala ligera + elevación
- `whileTap`: `{ scale: 0.95 }` - Feedback táctil
- `transition`: `{ duration: 0.2 }` - Respuesta rápida

### **Animaciones de Pills/Tags**

```tsx
// Para elementos seleccionables como pills
<motion.button
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.4, delay: 0.1 * index }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Contenido del pill */}
</motion.button>
```

## ⏱️ Duraciones Estándar

| Tipo de Animación | Duración | Uso |
|-------------------|----------|-----|
| **Micro-interacciones** | `0.2s` | Hover, tap, focus |
| **Elementos pequeños** | `0.4s` | Pills, tags, iconos |
| **Elementos medianos** | `0.6s` | Cards, formularios, texto |
| **Elementos grandes** | `0.8s` | Secciones, headers |
| **Transiciones de página** | `1.0s` | Cambios de vista |

## 🎨 Easings Recomendados

```tsx
// Easings por tipo de animación
const easings = {
  // Aparición suave y natural
  entrance: "easeOut",
  
  // Salida rápida
  exit: "easeIn", 
  
  // Movimiento continuo
  continuous: "easeInOut",
  
  // Bounce sutil para feedback
  feedback: [0.4, 0, 0.2, 1], // cubic-bezier personalizado
  
  // Spring natural
  spring: { type: "spring", stiffness: 300, damping: 30 }
};
```

## 📱 Consideraciones Responsive

### **Breakpoints de Animación**

```tsx
// Reduce animaciones en móviles
const isMobile = window.innerWidth < 768;

<motion.div
  initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: isMobile ? 0.4 : 0.6 }}
>
  {/* Contenido */}
</motion.div>
```

### **Respeto por Preferencias del Usuario**

```css
/* En CSS global */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔧 Implementación Práctica

### **Estructura de Componente Animado**

```tsx
import { motion } from 'motion/react';

const AnimatedComponent = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};
```

### **Hook Personalizado para Animaciones**

```tsx
import { useInView } from 'motion/react';
import { useRef } from 'react';

export const useScrollAnimation = (delay = 0) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return {
    ref,
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, delay, ease: "easeOut" }
  };
};
```

## 📋 Checklist de Calidad

### **Antes de Implementar**
- [ ] ¿La animación mejora la UX o es solo decorativa?
- [ ] ¿Es sutil y no distrae del contenido?
- [ ] ¿Respeta las preferencias de accesibilidad?
- [ ] ¿Es consistente con otras animaciones del proyecto?

### **Durante la Implementación**
- [ ] Usar `viewport: { once: true }` para scroll animations
- [ ] Implementar delays apropiados para staggered animations
- [ ] Incluir estados de hover y tap para elementos interactivos
- [ ] Testear en dispositivos móviles

### **Después de Implementar**
- [ ] Verificar performance (no drops de FPS)
- [ ] Testear con `prefers-reduced-motion`
- [ ] Validar en diferentes velocidades de conexión
- [ ] Confirmar que funciona en todos los navegadores objetivo

## 🎯 Ejemplos de Implementación

### **Header con FlipText**

```tsx
<motion.div 
  className="contact-title"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <FlipText text="Get" isHovered={isHovered} />
  <FlipText text="In" isHovered={isHovered} />
  <FlipText text="Touch" isHovered={isHovered} />
</motion.div>
```

### **Formulario con Staggered Animation**

```tsx
<motion.form 
  className="contact-form-container"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, delay: 0.3 }}
>
  {/* Campos con delays incrementales */}
  <motion.div transition={{ delay: 0.4 }}>Campo 1</motion.div>
  <motion.div transition={{ delay: 0.5 }}>Campo 2</motion.div>
  <motion.div transition={{ delay: 0.6 }}>Campo 3</motion.div>
</motion.form>
```

### **Pills Animados**

```tsx
{options.map((option, index) => (
  <motion.button
    key={option}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {option}
  </motion.button>
))}
```

## 🚀 Mejores Prácticas

1. **Menos es Más**: Prefiere pocas animaciones bien ejecutadas
2. **Propósito Claro**: Cada animación debe tener una razón de ser
3. **Consistencia**: Mantén patrones similares en toda la app
4. **Performance**: Monitorea el impacto en rendimiento
5. **Accesibilidad**: Siempre respeta `prefers-reduced-motion`
6. **Testing**: Prueba en diferentes dispositivos y conexiones

## 📚 Recursos Adicionales

- [Motion.dev Documentation](https://motion.dev/)
- [Animation Principles by Disney](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- [Web Animation Guidelines](https://web.dev/animations-guide/)
- [Accessible Animations](https://web.dev/prefers-reduced-motion/)

---

*Esta guía está basada en las implementaciones exitosas del proyecto Karen Portfolio y debe ser actualizada conforme evolucionen las mejores prácticas.*
