import { useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { Globe3D } from "../../../modules/Globe3D";
import type { MarkerPoint } from "../../../modules/Globe3D/types";

// Marker locations for the globe
const DEFAULT_MARKERS: MarkerPoint[] = [
  { lat: 18.918611111111, long: -80.234166666667 }, // Cuernavaca
  { lat: 30.26715, long: -80.74306 }, // Austin, TX
  { lat: 39.96118, long: -88.99879 }, // Columbus, Ohio
  { lat: 35.22709, long: -95.84313 }, // Charlotte
  { lat: 20.918611111111, long: -80.234166666667 }, // CDMX
  { lat: 38.9072, long: -102.0369 }, // Washington, D.C.
  { lat: 45.4215, long: -100.6972 }, // Ottawa, Canadá
  { lat: 48.856666666667, long: 176.3522222222222 }, // París, Francia
  { lat: 40.856666666667, long: 186.3522222222222 }, // Madrid, España
  { lat: 40.856666666667, long: 190.3522222222222 }, // Lisboa, Portugal
  { lat: 0.918611111111, long: -102.234166666667 }, // Quito, Ecuador
  { lat: -34.918611111111, long: -122.234166666667 }, // Buenos Aires
  { lat: 20.918611111111, long: -105.234166666667 }, // Santo Domingo
  { lat: -32.918611111111, long: -127.234166666667 }, // Montevideo
  { lat: -15.918611111111, long: -130.234166666667 }, // Brasilia
  { lat: -30.918611111111, long: -110.234166666667 }, // Santiago, Chile
  { lat: 15.918611111111, long: -87.234166666667 }, // Ciudad de Guatemala
  { lat: 15.918611111111, long: -90.234166666667 }, // El Salvador
  { lat: 25.918611111111, long: 102.234166666667 }, // Nueva Delhi, India
  { lat: 50.918611111111, long: 158.234166666667 }, // Varsovia, Polonia
];

interface GlobeBackgroundProps {
  className?: string;
}

export default function GlobeBackground({ className }: GlobeBackgroundProps) {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer - only mount once when first visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
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
  }, [hasBeenVisible]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[600px] flex items-center justify-center",
        className
      )}
      style={{ aspectRatio: "1 / 1" }}
    >
      {hasBeenVisible && (
        <Globe3D
          markers={DEFAULT_MARKERS}
          width={600}
          height={600}
          config={{
            autoRotate: true,
            autoRotateSpeed: 0.5,
            globeColor: 0x011ec7,
            markerColor: 0x5450ff,
          }}
        />
      )}
    </div>
  );
}
