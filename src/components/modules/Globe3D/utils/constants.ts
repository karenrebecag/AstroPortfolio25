import type { Globe3DConfig } from '../types';

export const DEFAULT_CONFIG: Required<Globe3DConfig> = {
  dotSize: 0.02,
  globeColor: 0x011ec7,
  markerColor: 0x5450ff,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  enableDamping: true,
  minPolarAngle: 0.4 * Math.PI,
  maxPolarAngle: 0.4 * Math.PI,
  enableZoom: false,
  enablePan: false,
};

export const EARTH_TEXTURE_URL =
  'https://cdn.prod.website-files.com/649345de5f3dcabcbb28c754/67340244d2b2704159cab924_earth-map-white.png';

export const GLOBE_GEOMETRY_DETAIL = 55;

export const POINTER_SIZE = 0.02;
export const POINTER_SEGMENTS = 16;
export const POINTER_COLOR = 0xac0000;

export const MARKER_SIZE = 0.02;
export const MARKER_SEGMENTS = 16;

export const CAMERA_BOUNDS = {
  left: -1.1,
  right: 1.1,
  top: 1.1,
  bottom: -1.1,
  near: 0,
  far: 3,
};

export const CAMERA_Z_POSITION = 1.1;

export const RAYCASTER_FAR = 1.15;

export const GLOBE_MESH_OPACITY = 0.05;

export const TEXTURE_REPEAT = { x: 5, y: 1 };
