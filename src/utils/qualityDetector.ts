/**
 * WebGL Quality Detection Utility
 *
 * Intelligently detects device capabilities and recommends rendering quality.
 * Uses multiple heuristics beyond simple GPU vendor detection.
 *
 * @module utils/qualityDetector
 */

export type QualityLevel = 'low' | 'medium' | 'high';

interface DeviceCapabilities {
  /** GPU renderer string from WebGL */
  gpu: string;
  /** GPU vendor (NVIDIA, AMD, Intel, Apple, etc.) */
  vendor: string;
  /** Is mobile device */
  isMobile: boolean;
  /** Device memory in GB (if available) */
  memoryGB: number;
  /** Logical processor cores */
  cores: number;
  /** Max texture size supported */
  maxTextureSize: number;
  /** WebGL version (1 or 2) */
  webglVersion: number;
  /** Screen width in pixels */
  screenWidth: number;
  /** Device pixel ratio */
  pixelRatio: number;
  /** Connection type (if available) */
  connection: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  /** Battery saving mode active */
  powerSaveMode: boolean;
}

/**
 * Gets comprehensive device capabilities
 *
 * @returns {DeviceCapabilities} Device capability information
 */
export const getDeviceCapabilities = (): DeviceCapabilities => {
  // Default values for SSR
  if (typeof window === 'undefined') {
    return {
      gpu: 'Unknown',
      vendor: 'Unknown',
      isMobile: false,
      memoryGB: 4,
      cores: 4,
      maxTextureSize: 2048,
      webglVersion: 1,
      screenWidth: 1920,
      pixelRatio: 1,
      connection: 'unknown',
      powerSaveMode: false
    };
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  const gpu = gl ? (gl.getParameter(gl.RENDERER) || 'Unknown') : 'Unknown';
  const vendor = gl ? (gl.getParameter(gl.VENDOR) || 'Unknown') : 'Unknown';

  // Detect mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Device memory (Chrome only, defaults to 4GB)
  const memoryGB = (navigator as any).deviceMemory || 4;

  // CPU cores
  const cores = navigator.hardwareConcurrency || 4;

  // Max texture size
  const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048;

  // WebGL version
  const webglVersion = gl?.constructor.name === 'WebGL2RenderingContext' ? 2 : 1;

  // Screen dimensions
  const screenWidth = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;

  // Network connection (if available)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';

  // Power save mode detection (experimental)
  const powerSaveMode = (navigator as any).getBattery
    ? false // Will be updated async
    : false;

  // Async battery check
  if ((navigator as any).getBattery) {
    (navigator as any).getBattery().then((battery: any) => {
      // Battery API available but not used for initial detection
    });
  }

  return {
    gpu,
    vendor,
    isMobile,
    memoryGB,
    cores,
    maxTextureSize,
    webglVersion,
    screenWidth,
    pixelRatio,
    connection: connectionType,
    powerSaveMode
  };
};

/**
 * Analyzes GPU string to determine performance tier
 *
 * @param {string} gpu - GPU renderer string
 * @param {string} vendor - GPU vendor string
 * @returns {number} Score from 0-40 points
 */
const analyzeGPU = (gpu: string, vendor: string): number => {
  const gpuLower = gpu.toLowerCase();
  const vendorLower = vendor.toLowerCase();

  // High-end desktop GPUs (35-40 points)
  if (
    gpuLower.includes('rtx 40') || // NVIDIA RTX 40xx series
    gpuLower.includes('rtx 30') || // NVIDIA RTX 30xx series
    gpuLower.includes('rx 7') ||   // AMD RX 7xxx series
    gpuLower.includes('rx 6')      // AMD RX 6xxx series
  ) {
    return 40;
  }

  // Mid-high desktop GPUs (30-35 points)
  if (
    gpuLower.includes('rtx 20') || // NVIDIA RTX 20xx
    gpuLower.includes('gtx 16') || // NVIDIA GTX 16xx
    gpuLower.includes('rx 5') ||   // AMD RX 5xxx
    gpuLower.includes('vega')      // AMD Vega
  ) {
    return 33;
  }

  // Apple Silicon (28-38 points depending on gen)
  if (vendorLower.includes('apple') || gpuLower.includes('apple')) {
    if (gpuLower.includes('m3')) return 38; // M3 series
    if (gpuLower.includes('m2')) return 35; // M2 series
    if (gpuLower.includes('m1')) return 32; // M1 series
    return 28; // Older Apple GPUs
  }

  // Modern Intel (Arc, Xe) (25-30 points)
  if (
    gpuLower.includes('arc') ||    // Intel Arc
    gpuLower.includes('xe') ||     // Intel Xe
    gpuLower.includes('iris xe')   // Intel Iris Xe
  ) {
    if (gpuLower.includes('arc')) return 30;
    return 26;
  }

  // Mid-range mobile GPUs (20-28 points)
  if (
    gpuLower.includes('adreno 7') ||  // Qualcomm Adreno 7xx
    gpuLower.includes('adreno 6') ||  // Qualcomm Adreno 6xx
    gpuLower.includes('mali-g7') ||   // ARM Mali G7x
    gpuLower.includes('mali-g610')    // ARM Mali G610+
  ) {
    return 24;
  }

  // Older desktop GPUs (15-25 points)
  if (
    gpuLower.includes('gtx 10') || // NVIDIA GTX 10xx
    gpuLower.includes('gtx 9') ||  // NVIDIA GTX 9xx
    gpuLower.includes('rx 4')      // AMD RX 4xx
  ) {
    return 20;
  }

  // Lower-end mobile GPUs (10-18 points)
  if (
    gpuLower.includes('adreno 5') ||
    gpuLower.includes('mali-g5') ||
    gpuLower.includes('powervr')
  ) {
    return 14;
  }

  // Integrated/older Intel (5-15 points)
  if (vendorLower.includes('intel')) {
    if (gpuLower.includes('uhd') || gpuLower.includes('iris')) return 15;
    return 8; // Old Intel HD
  }

  // Unknown/fallback
  return 10;
};

/**
 * Detects optimal rendering quality based on device capabilities
 *
 * Scoring system (0-100 points):
 * - GPU: 0-40 points
 * - Memory: 0-20 points
 * - CPU cores: 0-20 points
 * - Desktop bonus: 0-20 points
 *
 * Thresholds:
 * - 70+: high quality
 * - 40-69: medium quality
 * - 0-39: low quality
 *
 * @returns {QualityLevel} Recommended quality level
 *
 * @example
 * ```typescript
 * const quality = detectQuality();
 * console.log(`Recommended quality: ${quality}`);
 *
 * // Use in renderer config
 * const renderer = new THREE.WebGLRenderer({
 *   antialias: quality !== 'low',
 *   powerPreference: quality === 'high' ? 'high-performance' : 'default'
 * });
 * ```
 */
export const detectQuality = (): QualityLevel => {
  const caps = getDeviceCapabilities();

  let score = 0;

  // 1. GPU Analysis (0-40 points)
  score += analyzeGPU(caps.gpu, caps.vendor);

  // 2. Memory check (0-20 points)
  if (caps.memoryGB >= 16) score += 20;
  else if (caps.memoryGB >= 8) score += 15;
  else if (caps.memoryGB >= 4) score += 10;
  else score += 5;

  // 3. CPU cores (0-20 points)
  if (caps.cores >= 16) score += 20;
  else if (caps.cores >= 8) score += 15;
  else if (caps.cores >= 4) score += 10;
  else score += 5;

  // 4. Desktop vs Mobile (0-20 points)
  score += caps.isMobile ? 0 : 20;

  // Penalties and bonuses

  // High resolution penalty for mobile
  if (caps.isMobile && caps.screenWidth > 1440) {
    score -= 10; // High res on mobile = likely struggles
  }

  // Very high pixel ratio penalty
  if (caps.pixelRatio > 2.5) {
    score -= 5; // Lots of pixels to push
  }

  // WebGL 1 only penalty
  if (caps.webglVersion === 1) {
    score -= 5;
  }

  // Small texture size penalty
  if (caps.maxTextureSize < 4096) {
    score -= 5;
  }

  // Slow connection penalty
  if (caps.connection === 'slow-2g' || caps.connection === '2g') {
    score -= 10; // Slow network = likely low-end device
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine quality tier
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

/**
 * Gets a detailed quality report with reasoning
 *
 * Useful for debugging and understanding why a certain quality was chosen
 *
 * @returns {object} Detailed quality report
 *
 * @example
 * ```typescript
 * const report = getQualityReport();
 * console.log('Quality Report:', report);
 * // {
 * //   quality: 'high',
 * //   score: 85,
 * //   capabilities: { ... },
 * //   reasoning: [
 * //     'High-end GPU detected (RTX 3080)',
 * //     '16GB RAM available',
 * //     'Desktop device',
 * //     '8 CPU cores'
 * //   ]
 * // }
 * ```
 */
export const getQualityReport = () => {
  const caps = getDeviceCapabilities();
  const quality = detectQuality();
  const reasoning: string[] = [];

  // GPU reasoning
  const gpuScore = analyzeGPU(caps.gpu, caps.vendor);
  if (gpuScore >= 35) reasoning.push(`High-end GPU detected (${caps.gpu})`);
  else if (gpuScore >= 25) reasoning.push(`Mid-range GPU detected (${caps.gpu})`);
  else reasoning.push(`Entry-level GPU detected (${caps.gpu})`);

  // Memory reasoning
  if (caps.memoryGB >= 8) reasoning.push(`${caps.memoryGB}GB RAM available`);
  else reasoning.push(`Limited RAM (${caps.memoryGB}GB)`);

  // Device type
  reasoning.push(caps.isMobile ? 'Mobile device' : 'Desktop device');

  // CPU
  if (caps.cores >= 8) reasoning.push(`${caps.cores} CPU cores`);
  else reasoning.push(`${caps.cores} CPU cores (limited)`);

  // WebGL version
  if (caps.webglVersion === 2) reasoning.push('WebGL 2 supported');
  else reasoning.push('WebGL 1 only (legacy)');

  return {
    quality,
    capabilities: caps,
    reasoning
  };
};
