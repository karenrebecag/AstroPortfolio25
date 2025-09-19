import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisIsland() {
  useEffect(() => {
    // Configuración optimizada de Lenis basada en las mejores prácticas de la comunidad
    const lenis = new Lenis({
      duration: 1.2, // Duración suave pero responsiva
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing suave
      smooth: true,
      lerp: 0.07, // Balance óptimo entre suavidad y respuesta (0.05-0.1 recomendado)
      wheelMultiplier: 1, // Velocidad estándar del scroll con rueda del mouse
      touchMultiplier: 2, // Velocidad para dispositivos táctiles
      infinite: false,
      autoResize: true, // Ajuste automático en cambios de tamaño
      syncTouch: false, // Mejor performance en móviles
      syncTouchLerp: 0.1,
    });

    // Función de animación usando requestAnimationFrame para máximo rendimiento
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Iniciar el loop de animación
    requestAnimationFrame(raf);

    // Detectar dispositivos de gama baja y ajustar configuración
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowEndDevice) {
      lenis.options.lerp = 0.1; // Más responsivo en dispositivos lentos
      lenis.options.duration = 0.8; // Duración más corta
    }

    // Pausar Lenis durante redimensionamiento para evitar lag
    let resizeTimeout;
    const handleResize = () => {
      lenis.stop();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.start();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      lenis.destroy();
    };
  }, []);

  // No renderiza nada, solo maneja el smooth scroll
  return null;
}
