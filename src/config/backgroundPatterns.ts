// Centralized configuration for background pattern opacities
// This ensures consistency across all components using BGPattern

export const backgroundPatternConfig = {
  // Default opacities for general use (WhiteBackground, etc.)
  default: {
    light: 0.05,
    dark: 0.02,
  },

  // Header-specific opacities (more subtle)
  header: {
    light: 0.01,
    dark: 0.01,
  },

  // Color definitions
  colors: {
    light: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
    dark: (opacity: number) => `rgba(157, 127, 193, ${opacity})`,
  },
} as const;

// Helper functions for easy access
export const getBackgroundFill = {
  light: (opacity?: number) =>
    backgroundPatternConfig.colors.light(opacity ?? backgroundPatternConfig.default.light),
  dark: (opacity?: number) =>
    backgroundPatternConfig.colors.dark(opacity ?? backgroundPatternConfig.default.dark),
};

export const getHeaderBackgroundFill = {
  light: () => backgroundPatternConfig.colors.light(backgroundPatternConfig.header.light),
  dark: () => backgroundPatternConfig.colors.dark(backgroundPatternConfig.header.dark),
};
