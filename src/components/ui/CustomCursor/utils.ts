/**
 * Utility functions for the Custom Cursor module.
 */

/**
 * Checks for touch devices with enhanced Safari/iPad compatibility.
 * @returns {boolean} True if the device is a touch device.
 */
export const isTouchDevice = (): boolean => {
  try {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let isPrimaryTouch = false;
    try {
      isPrimaryTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    } catch (e) {
      isPrimaryTouch = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
    const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafariDesktop = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !hasTouch && !isIPad;

    if (isSafariDesktop) return false;
    return hasTouch || isPrimaryTouch || isIPad;
  } catch (error) {
    console.warn('Error detecting touch device:', error);
    return false;
  }
};

/**
 * Linearly interpolates between two numbers.
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @param {number} factor - The interpolation factor.
 * @returns {number} The interpolated value.
 */
export const lerp = (start: number, end: number, factor: number): number => start + (end - start) * factor;
