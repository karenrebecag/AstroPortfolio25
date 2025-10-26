/**
 * Unified Three.js Store
 *
 * Centralized Zustand store for all Three.js components.
 * Replaces duplicated stores in GemBackground, SilkBackground, GemCanvas, and GemModel.
 *
 * Features:
 * - Optimized with useShallow for selective re-renders
 * - Divided into slices by functionality
 * - Batch updates support
 * - Quality-based rendering
 *
 * @module utils/stores/threeJSStore
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

/**
 * Quality level for rendering
 */
export type QualityLevel = 'low' | 'medium' | 'high';

/**
 * Visibility State Slice
 * Controls when components should render
 */
interface VisibilityState {
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
}

/**
 * Settings State Slice
 * Configuration that changes infrequently
 */
interface SettingsState {
  opacity: number;
  quality: QualityLevel;
}

/**
 * Animation State Slice
 * Properties for animations
 */
interface AnimationState {
  animationSpeed: number;
  // Scroll-based rotation for Gem
  scrollRotationX: number;
  scrollRotationY: number;
  scrollRotationZ: number;
}

/**
 * Color State Slice
 * Color configuration (primarily for Silk)
 */
interface ColorState {
  colors: {
    primary: string;
    contrast: string;
  };
}

/**
 * Complete State
 */
export interface ThreeJSState
  extends VisibilityState,
    SettingsState,
    AnimationState,
    ColorState {}

/**
 * Action creators for state updates
 */
interface ThreeJSActions {
  // Visibility actions
  setVisible: (visible: boolean) => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Settings actions
  setOpacity: (opacity: number) => void;
  setQuality: (quality: QualityLevel) => void;

  // Animation actions
  setAnimationSpeed: (speed: number) => void;
  setScrollRotation: (x: number, y: number, z: number) => void;

  // Color actions
  setColors: (colors: { primary: string; contrast: string }) => void;

  // Batch updater
  batchUpdate: (updates: Partial<ThreeJSState>) => void;

  // Reset to defaults
  reset: () => void;
}

/**
 * Default state values
 */
const DEFAULT_STATE: ThreeJSState = {
  // Visibility
  isVisible: false,
  isPaused: false,
  isLoading: true,

  // Settings
  opacity: 0,
  quality: 'medium',

  // Animation
  animationSpeed: 1.0,
  scrollRotationX: 0,
  scrollRotationY: 0,
  scrollRotationZ: 0,

  // Colors (for Silk)
  colors: {
    primary: '#9D7FC1',
    contrast: '#4523AE'
  }
};

/**
 * Main Three.js Store
 *
 * Optimized for performance with:
 * - Early returns for identical values
 * - Batch updates
 * - Slice-based selectors
 */
export const useThreeJSStore = create<ThreeJSState & ThreeJSActions>((set, get) => ({
  ...DEFAULT_STATE,

  // ===== Visibility Actions =====

  setVisible: (visible) => {
    const current = get();
    if (current.isVisible === visible) return;

    set({ isVisible: visible });

    // Smooth opacity transition
    // Note: The rendering should continue even when isVisible is false
    // to allow smooth fade-out transitions
    if (visible) {
      setTimeout(() => {
        const state = get();
        if (state.isVisible) {
          // Double-check to avoid race conditions
          set({ opacity: 1 });
        }
      }, 200); // Fade in quickly
    } else {
      setTimeout(() => set({ opacity: 0 }), 100); // Start fade out immediately
    }
  },

  setPaused: (paused) => {
    const current = get();
    if (current.isPaused === paused) return;
    set({ isPaused: paused });
  },

  setLoading: (loading) => {
    const current = get();
    if (current.isLoading === loading) return;
    set({ isLoading: loading });
  },

  // ===== Settings Actions =====

  setOpacity: (opacity) => {
    const current = get();
    if (current.opacity === opacity) return;
    set({ opacity });
  },

  setQuality: (quality) => {
    const current = get();
    if (current.quality === quality) return;
    set({ quality });
  },

  // ===== Animation Actions =====

  setAnimationSpeed: (speed) => {
    const current = get();
    if (current.animationSpeed === speed) return;
    set({ animationSpeed: speed });
  },

  setScrollRotation: (x, y, z) => {
    const current = get();
    if (
      current.scrollRotationX === x &&
      current.scrollRotationY === y &&
      current.scrollRotationZ === z
    ) {
      return;
    }
    set({
      scrollRotationX: x,
      scrollRotationY: y,
      scrollRotationZ: z
    });
  },

  // ===== Color Actions =====

  setColors: (colors) => {
    const current = get();
    if (JSON.stringify(current.colors) === JSON.stringify(colors)) return;
    set({ colors });
  },

  // ===== Batch Update =====

  batchUpdate: (updates) => {
    const current = get();
    const filteredUpdates: Partial<ThreeJSState> = {};

    Object.entries(updates).forEach(([key, value]) => {
      const typedKey = key as keyof ThreeJSState;

      // Special handling for colors (object comparison)
      if (key === 'colors') {
        if (JSON.stringify(current.colors) !== JSON.stringify(value)) {
          (filteredUpdates as any)[key] = value;
        }
      }
      // Standard comparison for primitives
      else if (current[typedKey] !== value) {
        (filteredUpdates as any)[key] = value;
      }
    });

    if (Object.keys(filteredUpdates).length > 0) {
      set(filteredUpdates);
    }
  },

  // ===== Reset =====

  reset: () => {
    set(DEFAULT_STATE);
  }
}));

/**
 * Custom Hook: Select Visibility State
 *
 * @example
 * ```typescript
 * const { isVisible, isPaused, isLoading } = useVisibilityState();
 * ```
 */
export const useVisibilityState = () =>
  useThreeJSStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      isPaused: state.isPaused,
      isLoading: state.isLoading
    }))
  );

/**
 * Custom Hook: Select Settings State
 *
 * @example
 * ```typescript
 * const { quality, opacity } = useSettingsState();
 * ```
 */
export const useSettingsState = () =>
  useThreeJSStore(
    useShallow((state) => ({
      quality: state.quality,
      opacity: state.opacity
    }))
  );

/**
 * Custom Hook: Select Animation State
 *
 * @example
 * ```typescript
 * const { animationSpeed, scrollRotationX, scrollRotationY, scrollRotationZ } = useAnimationState();
 * ```
 */
export const useAnimationState = () =>
  useThreeJSStore(
    useShallow((state) => ({
      animationSpeed: state.animationSpeed,
      scrollRotationX: state.scrollRotationX,
      scrollRotationY: state.scrollRotationY,
      scrollRotationZ: state.scrollRotationZ
    }))
  );

/**
 * Custom Hook: Select Color State
 *
 * @example
 * ```typescript
 * const { colors } = useColorState();
 * ```
 */
export const useColorState = () =>
  useThreeJSStore(
    useShallow((state) => ({
      colors: state.colors
    }))
  );

/**
 * Custom Hook: Select Actions Only
 *
 * @example
 * ```typescript
 * const { setVisible, setPaused, setQuality } = useThreeJSActions();
 * ```
 */
export const useThreeJSActions = () =>
  useThreeJSStore(
    useShallow((state) => ({
      setVisible: state.setVisible,
      setPaused: state.setPaused,
      setLoading: state.setLoading,
      setOpacity: state.setOpacity,
      setQuality: state.setQuality,
      setAnimationSpeed: state.setAnimationSpeed,
      setScrollRotation: state.setScrollRotation,
      setColors: state.setColors,
      batchUpdate: state.batchUpdate,
      reset: state.reset
    }))
  );

/**
 * Namespace Exports for Component-Specific Usage
 *
 * Maintains backward compatibility while using unified store
 */

/**
 * Store for Gem components (GemBackground)
 * Uses main store but provides familiar interface
 */
export const useGemStore = useThreeJSStore;

/**
 * Store for Silk components (SilkBackground)
 * Uses main store but provides familiar interface
 */
export const useSilkStore = useThreeJSStore;

/**
 * Get store state outside React components
 *
 * @example
 * ```typescript
 * const currentState = getThreeJSState();
 * console.log('Is visible:', currentState.isVisible);
 * ```
 */
export const getThreeJSState = () => useThreeJSStore.getState();
