import { create } from 'zustand';
import type { Globe3DStore, Globe3DState } from '../types';

const initialState: Globe3DState = {
  isLoading: true,
  isInteracting: false,
  isPaused: false,
  isHovered: false,
  opacity: 0,
  activeMarker: null,
  pointerPosition: null,
  coordinates2D: [0, 0],
  popupVisible: false,
};

export const useGlobe3DStore = create<Globe3DStore>((set, get) => ({
  ...initialState,

  setLoading: (loading) => {
    if (get().isLoading === loading) return;
    set({ isLoading: loading });
    if (!loading) {
      setTimeout(() => set({ opacity: 1 }), 100);
    }
  },

  setInteracting: (interacting) => {
    if (get().isInteracting === interacting) return;
    set({ isInteracting: interacting });
  },

  setPaused: (paused) => {
    if (get().isPaused === paused) return;
    set({ isPaused: paused });
  },

  setHovered: (hovered) => {
    if (get().isHovered === hovered) return;
    set({ isHovered: hovered });
  },

  setOpacity: (opacity) => {
    if (get().opacity === opacity) return;
    set({ opacity });
  },

  setActiveMarker: (marker) => set({ activeMarker: marker }),

  setPointerPosition: (pos) => set({ pointerPosition: pos }),

  setCoordinates2D: (coords) => set({ coordinates2D: coords }),

  setPopupVisible: (visible) => {
    if (get().popupVisible === visible) return;
    set({ popupVisible: visible });
  },

  reset: () => set(initialState),
}));

// Selector hooks for optimized re-renders
export const useGlobeLoading = () => useGlobe3DStore((state) => state.isLoading);
export const useGlobeInteracting = () => useGlobe3DStore((state) => state.isInteracting);
export const useGlobePaused = () => useGlobe3DStore((state) => state.isPaused);
export const useGlobeHovered = () => useGlobe3DStore((state) => state.isHovered);
export const useGlobeOpacity = () => useGlobe3DStore((state) => state.opacity);
export const useActiveMarker = () => useGlobe3DStore((state) => state.activeMarker);
export const usePopupVisible = () => useGlobe3DStore((state) => state.popupVisible);
