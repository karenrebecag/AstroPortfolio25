// GetInTouch Module - Centralized exports
// This module contains all components, stores, and utilities related to the contact form

// Components
export { default as GetInTouchIsland } from './components/GetInTouchIsland';
export { default as GetInTouchWithToast } from './components/GetInTouchWithToast';

// Stores
export {
  useContactFormStore,
  useFormData,
  useUIState,
  useFormActions,
  useUIActions
} from './stores/contactFormStore';

// Note: GetInTouch.astro must be imported directly
// import GetInTouch from './components/GetInTouch.astro';
