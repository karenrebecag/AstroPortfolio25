/**
 * Logic for the Page Loader component.
 * Handles scroll blocking and cleanup.
 */
export const initPageLoader = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const body = document.body;

    if (preloader) {
      // Block scroll immediately
      body.classList.add('preloader-active');

      // Remove the preloader from DOM and restore scroll after all animations complete
      setTimeout(() => {
        body.classList.remove('preloader-active');
        preloader.remove();
      }, 3400);
    }
  });
};
