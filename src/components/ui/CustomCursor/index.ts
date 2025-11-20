/**
 * Custom Cursor Module Entry Point
 *
 * Initializes and starts the custom cursor feature.
 */
import { Cursor } from './Cursor';

/**
 * Initializes the custom cursor by creating and initializing a new Cursor instance.
 */
export const initCustomCursor = () => {
  const cursor = new Cursor();
  cursor.init();
};
