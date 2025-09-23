import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useDeviceQuality } from '../../hooks/useDeviceQuality';

// ✅ Configuración adaptativa basada en calidad - siguiendo la guía (SSR safe)
const getGlobeConfig = (quality: 'low' | 'medium' | 'high', pixelRatio: number = 1) => ({
  devicePixelRatio: Math.min(pixelRatio, quality === 'low' ? 1 : 2),
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: quality === 'low' ? 8000 : quality === 'medium' ? 16000 : 24000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1] as [number, number, number],
  markerColor: [115 / 255, 80 / 255, 204 / 255] as [number, number, number], // Purple color matching portfolio theme
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
    { location: [19.076, 72.8777] as [number, number], size: 0.1 },
    { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
    { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
    { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
    { location: [19.4326, -99.1332] as [number, number], size: 0.1 }, // Mexico City
    { location: [40.7128, -74.006] as [number, number], size: 0.1 },
    { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
    { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
  ],
});

interface GlobeBackgroundProps {
  className?: string;
  config?: COBEOptions;
}

export default function GlobeBackground({ 
  className, 
  config 
}: GlobeBackgroundProps) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ✅ Detección automática de calidad siguiendo la guía (SSR safe)
  const deviceQuality = useDeviceQuality();
  const [pixelRatio, setPixelRatio] = useState(1);
  
  // ✅ Solo acceder a window en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPixelRatio(window.devicePixelRatio || 1);
    }
  }, []);
  
  const globeConfig = getGlobeConfig(deviceQuality, pixelRatio);

  const updatePointerInteraction = (value: number | null) => {
    // Disabled pointer interaction
    return;
  };

  const updateMovement = (clientX: number) => {
    // Disabled movement interaction
    return;
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!isPaused) {
        phi += 0.0035; // 30% más lento (0.005 * 0.7 = 0.0035)
      }
      state.phi = phi;
      state.width = width * 2;
      state.height = width * 2;
    },
    [isPaused],
  );

  const onResize = () => {
    if (canvasRef.current && containerRef.current) {
      width = Math.min(containerRef.current.offsetWidth, 600); // Limitar a 600px máximo
    }
  };

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsPaused(true);
        } else {
          setIsPaused(false);
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Page Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...globeConfig,
      width: 600, // Tamaño fijo para evitar problemas
      height: 600, // Tamaño fijo para evitar problemas
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [isVisible, onRender, deviceQuality, pixelRatio]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-[1/1] w-full max-w-[600px] h-[600px] ${className || ''}`}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
