import type {
  Object3D,
  Texture,
  Vector3,
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Points,
  Mesh,
  Clock,
  Raycaster,
} from 'three';

export interface GeoCoordinate {
  lat: number;
  long: number;
}

export interface MarkerPoint extends GeoCoordinate {
  id?: string;
  label?: string;
  color?: number;
}

export interface Globe3DConfig {
  dotSize?: number;
  globeColor?: number;
  markerColor?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDamping?: boolean;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export interface Globe3DState {
  isLoading: boolean;
  isInteracting: boolean;
  isPaused: boolean;
  isHovered: boolean;
  opacity: number;
  activeMarker: MarkerPoint | null;
  pointerPosition: { x: number; y: number; z: number } | null;
  coordinates2D: [number, number];
  popupVisible: boolean;
}

export interface Globe3DActions {
  setLoading: (loading: boolean) => void;
  setInteracting: (interacting: boolean) => void;
  setPaused: (paused: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setOpacity: (opacity: number) => void;
  setActiveMarker: (marker: MarkerPoint | null) => void;
  setPointerPosition: (pos: { x: number; y: number; z: number } | null) => void;
  setCoordinates2D: (coords: [number, number]) => void;
  setPopupVisible: (visible: boolean) => void;
  reset: () => void;
}

export type Globe3DStore = Globe3DState & Globe3DActions;

export interface Globe3DProps {
  markers?: MarkerPoint[];
  config?: Globe3DConfig;
  width?: string | number;
  height?: string | number;
  className?: string;
  onMarkerClick?: (marker: MarkerPoint) => void;
  onGlobeClick?: (coords: GeoCoordinate) => void;
}

export interface ShaderUniforms {
  u_map_tex: { value: Texture | null };
  u_dot_size: { value: number };
  u_pointer: { value: Vector3 };
  u_time_since_click: { value: number };
  [key: string]: { value: unknown };
}

export interface Globe3DRefs {
  renderer: WebGLRenderer | null;
  scene: Scene | null;
  camera: OrthographicCamera | null;
  controls: Object3D | null;
  globe: Points | null;
  globeMesh: Mesh | null;
  pointer: Mesh | null;
  clock: Clock | null;
  rayCaster: Raycaster | null;
  markers: Mesh[];
}
