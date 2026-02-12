/**
 * Three.js Gem Store & Quality Detection
 *
 * - useGemStore: Zustand store for GemBackground (single instance).
 * - detectQuality: GPU-based quality detection utility.
 *
 * SilkBackground uses component-local state because there are
 * multiple instances (one per skill card) that need independent lifecycles.
 */

import { create } from 'zustand';

export type QualityLevel = 'low' | 'medium' | 'high';

/**
 * Detect rendering quality based on GPU capabilities.
 * Uses WEBGL_debug_renderer_info with fallback to gl.RENDERER.
 */
export function detectQuality(): QualityLevel {
  if (typeof window === 'undefined') return 'medium';
  try {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'low';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
      : (gl.getParameter(gl.RENDERER) as string);

    if (isMobile || /Intel|Mali|Adreno 5/i.test(renderer)) return 'low';
    if (/NVIDIA|AMD|Radeon|GeForce/i.test(renderer)) return 'high';
  } catch {
    /* fallback */
  }
  return 'medium';
}

// ═══════════════════════════════════════════════════
// GEM STORE  (single instance — GemBackground)
// ═══════════════════════════════════════════════════

interface GemState {
  isVisible: boolean;
  isPaused: boolean;
  quality: QualityLevel;
}

interface GemActions {
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setQuality: (quality: QualityLevel) => void;
}

export const useGemStore = create<GemState & GemActions>((set, get) => ({
  isVisible: false,
  isPaused: false,
  quality: typeof window !== 'undefined' ? detectQuality() : 'medium',

  setVisible: (visible) => {
    if (get().isVisible !== visible) set({ isVisible: visible });
  },
  setPaused: (paused) => {
    if (get().isPaused !== paused) set({ isPaused: paused });
  },
  setQuality: (quality) => {
    if (get().quality !== quality) set({ quality });
  },
}));
