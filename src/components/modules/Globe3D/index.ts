// Main component
export { Globe3D, default } from './components/Globe3D';

// Hooks
export { useGlobe3D } from './hooks/useGlobe3D';

// Store
export {
  useGlobe3DStore,
  useGlobeLoading,
  useGlobeInteracting,
  useActiveMarker,
  usePopupVisible,
} from './stores/useGlobe3DStore';

// Utils
export {
  geoToCartesian,
  cartesianToGeo,
  formatCoordinate,
  formatGeoCoordinates,
  projectToScreen,
  isPointVisible,
  defaultMarkers,
} from './utils/coordinates';

export {
  DEFAULT_CONFIG,
  EARTH_TEXTURE_URL,
  GLOBE_GEOMETRY_DETAIL,
  POINTER_SIZE,
  POINTER_COLOR,
  MARKER_SIZE,
  CAMERA_BOUNDS,
  CAMERA_Z_POSITION,
} from './utils/constants';

// Types
export type {
  GeoCoordinate,
  MarkerPoint,
  Globe3DConfig,
  Globe3DState,
  Globe3DActions,
  Globe3DStore,
  Globe3DProps,
  ShaderUniforms,
  Globe3DRefs,
} from './types';
