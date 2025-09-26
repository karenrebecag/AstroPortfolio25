import React, { useRef, useEffect, useState } from 'react';

interface LightDitheringShaderProps {
  width?: number;
  height?: number;
  colorBack?: string;
  colorFront?: string;
  className?: string;
}

export function LightDitheringShader({
  width = 1920,
  height = 1800,
  colorBack = "#ececec",
  colorFront = "#ffffff",
  className = ""
}: LightDitheringShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      observer.observe(currentCanvas);
    }

    return () => {
      if (currentCanvas) {
        observer.unobserve(currentCanvas);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const speed = 0.6;

    const animate = () => {
      if (!isVisible) return;

      time += 0.016 * speed; // ~60fps

      // Simple animated gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const offset1 = (Math.sin(time) + 1) * 0.5;
      const offset2 = (Math.cos(time * 0.7) + 1) * 0.5;
      
      gradient.addColorStop(0, colorBack);
      gradient.addColorStop(offset1, colorFront);
      gradient.addColorStop(1, colorBack);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle noise pattern
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
      }
      
      ctx.putImageData(imageData, 0, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, width, height, colorBack, colorFront]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
}
