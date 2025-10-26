/**
 * Dark Mode Detection and Observation Utilities
 *
 * Provides centralized dark mode detection and observation for the application.
 * Eliminates code duplication across components.
 *
 * @module utils/darkMode
 */

export const THEME_STORAGE_KEY = 'aurin-theme';
export const DARK_MODE_CLASS = 'dark-mode';

/**
 * Detects if dark mode is currently active
 *
 * Checks both:
 * - HTML element class ('dark-mode')
 * - localStorage setting ('aurin-theme' === 'dark')
 *
 * @returns {boolean} True if dark mode is active
 *
 * @example
 * ```typescript
 * if (detectDarkMode()) {
 *   console.log('Dark mode is active');
 * }
 * ```
 */
export const detectDarkMode = (): boolean => {
  if (typeof document === 'undefined') return false;

  const hasClass = document.documentElement.classList.contains(DARK_MODE_CLASS);
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return hasClass || savedTheme === 'dark';
};

/**
 * Callback type for dark mode changes
 */
export type DarkModeCallback = (isDark: boolean) => void;

/**
 * Cleanup function returned by observeDarkMode
 */
export type DarkModeCleanup = () => void;

/**
 * Observes dark mode changes and calls callback when it changes
 *
 * Features:
 * - Immediate callback with current state
 * - MutationObserver for class changes on <html>
 * - Storage event listener for cross-tab sync
 * - Returns cleanup function
 *
 * @param {DarkModeCallback} callback - Function to call when dark mode changes
 * @returns {DarkModeCleanup} Cleanup function to disconnect observers
 *
 * @example
 * ```typescript
 * // In React component
 * useEffect(() => {
 *   const cleanup = observeDarkMode((isDark) => {
 *     console.log('Dark mode:', isDark);
 *     setDarkModeActive(isDark);
 *   });
 *
 *   return cleanup;
 * }, []);
 * ```
 *
 * @example
 * ```typescript
 * // In Astro script
 * const cleanup = observeDarkMode((isDark) => {
 *   applyDarkModeStyles(isDark);
 * });
 *
 * // Cleanup on page unload
 * window.addEventListener('beforeunload', cleanup);
 * ```
 */
export const observeDarkMode = (callback: DarkModeCallback): DarkModeCleanup => {
  if (typeof document === 'undefined') {
    return () => {}; // No-op for SSR
  }

  // Immediate callback with current state
  callback(detectDarkMode());

  // MutationObserver for class changes on documentElement
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        callback(detectDarkMode());
      }
    });
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Storage listener for cross-tab synchronization
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      callback(detectDarkMode());
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    mutationObserver.disconnect();
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * React hook for observing dark mode
 *
 * @param {DarkModeCallback} callback - Function to call when dark mode changes
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const [isDark, setIsDark] = useState(false);
 *
 *   useDarkModeObserver((isDark) => {
 *     setIsDark(isDark);
 *   });
 *
 *   return <div className={isDark ? 'dark' : 'light'}>...</div>;
 * }
 * ```
 */
export const useDarkModeObserver = (callback: DarkModeCallback) => {
  if (typeof window === 'undefined') return;

  // Import React only if needed (code splitting)
  import('react').then(({ useEffect }) => {
    useEffect(() => {
      return observeDarkMode(callback);
    }, [callback]);
  });
};

/**
 * Toggle dark mode on/off
 *
 * Updates both:
 * - HTML class
 * - localStorage
 *
 * @param {boolean} [enabled] - Optional: explicitly set dark mode state. If omitted, toggles current state.
 *
 * @example
 * ```typescript
 * // Toggle
 * toggleDarkMode();
 *
 * // Explicitly enable
 * toggleDarkMode(true);
 *
 * // Explicitly disable
 * toggleDarkMode(false);
 * ```
 */
export const toggleDarkMode = (enabled?: boolean): void => {
  if (typeof document === 'undefined') return;

  const shouldEnable = enabled !== undefined ? enabled : !detectDarkMode();

  if (shouldEnable) {
    document.documentElement.classList.add(DARK_MODE_CLASS);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  } else {
    document.documentElement.classList.remove(DARK_MODE_CLASS);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  }
};
