import * as THREE from 'three';
import type { GeoCoordinate, MarkerPoint } from '../types';

/**
 * Convert latitude and longitude to 3D cartesian coordinates on a unit sphere
 */
export function geoToCartesian(lat: number, long: number): THREE.Vector3 {
  const latRad = THREE.MathUtils.degToRad(lat);
  const longRad = THREE.MathUtils.degToRad(long);

  const x = Math.cos(latRad) * Math.cos(longRad);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.sin(longRad);

  return new THREE.Vector3(x, y, z).normalize();
}

/**
 * Convert 3D cartesian coordinates to latitude and longitude
 */
export function cartesianToGeo(position: THREE.Vector3): GeoCoordinate {
  const lat = 90 - (Math.acos(position.y) * 180) / Math.PI;
  const lng = ((270 + (Math.atan2(position.x, position.z) * 180) / Math.PI) % 360) - 180;

  return { lat, long: lng };
}

/**
 * Format coordinate for display
 */
export function formatCoordinate(
  coordinate: number,
  positiveDirection: string,
  negativeDirection: string
): string {
  const direction = coordinate >= 0 ? positiveDirection : negativeDirection;
  return `${Math.abs(coordinate).toFixed(4)}° ${direction}`;
}

/**
 * Format geo coordinates as a readable string
 */
export function formatGeoCoordinates(coords: GeoCoordinate): string {
  const latStr = formatCoordinate(coords.lat, 'N', 'S');
  const longStr = formatCoordinate(coords.long, 'E', 'W');
  return `${latStr}, ${longStr}`;
}

/**
 * Project 3D position to 2D screen coordinates
 */
export function projectToScreen(
  position: THREE.Vector3,
  camera: THREE.Camera,
  containerWidth: number,
  containerHeight: number
): [number, number] {
  const projected = position.clone().project(camera);
  const x = (projected.x + 1) * containerWidth * 0.5;
  const y = (1 - projected.y) * containerHeight * 0.5;
  return [x, y];
}

/**
 * Check if a point is visible from camera perspective
 */
export function isPointVisible(
  position: THREE.Vector3,
  camera: THREE.Camera
): boolean {
  const matrixWorldInverse = camera.matrixWorldInverse;
  const transformed = position.clone().applyMatrix4(matrixWorldInverse);
  return transformed.z > -1;
}

/**
 * Default marker points
 */
export const defaultMarkers: MarkerPoint[] = [
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
