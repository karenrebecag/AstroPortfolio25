import { useRef } from 'react';
import { useGlobe3D } from '../hooks/useGlobe3D';
import { useGlobeOpacity } from '../stores/useGlobe3DStore';
import { defaultMarkers } from '../utils/coordinates';
import styles from '../styles/Globe3D.module.css';
import type { Globe3DProps } from '../types';

export function Globe3D({
  markers = defaultMarkers,
  config = {},
  width = 400,
  height = 400,
  className = '',
  onMarkerClick,
  onGlobeClick,
}: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const opacity = useGlobeOpacity();

  const { isLoading } = useGlobe3D({
    containerRef,
    canvas3DRef,
    canvas2DRef,
    popupRef,
    markers,
    config,
    onMarkerClick,
    onGlobeClick,
  });

  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div className={`${styles.container} ${className}`} style={containerStyle}>
      <div
        ref={containerRef}
        className={styles.wrapper}
        style={{
          opacity,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <canvas ref={canvas3DRef} className={styles.canvas3d} />
        <canvas ref={canvas2DRef} className={styles.canvas2dOverlay} />
        <div className={styles.popupOverlay}>
          <div ref={popupRef} className={styles.popup} />
        </div>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Globe3D;
