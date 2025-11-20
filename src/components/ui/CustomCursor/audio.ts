/**
 * Audio functions for the Custom Cursor module.
 */

let clickAudio: HTMLAudioElement | null = null;

/**
 * Initializes the click sound audio element.
 */
export const initClickAudio = () => {
  try {
    clickAudio = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Click.mp3');
    clickAudio.volume = 0.15;
    clickAudio.preload = 'auto';
  } catch (error) {
    console.warn('Could not load click sound:', error);
  }
};

/**
 * Plays the click sound if it has been initialized.
 */
export const playClickSound = () => {
  if (clickAudio) {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(error => console.warn('Could not play click sound:', error));
  }
};
