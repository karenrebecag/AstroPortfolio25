import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "../../../../lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [115 / 255, 80 / 255, 204 / 255], // Purple color matching portfolio theme
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 }, // Mexico City
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

interface GlobeBackgroundProps {
  className?: string;
  config?: COBEOptions;
}

export default function GlobeBackground({ 
  className, 
  config = GLOBE_CONFIG 
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
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
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
      ...config,
      width: width * 2,
      height: width * 2,
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
  }, [isVisible, onRender, config]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto aspect-[1/1] w-full max-w-[600px] h-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
