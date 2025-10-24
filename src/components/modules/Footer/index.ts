// Footer Module - Centralized exports
// This module contains all components, shaders, game, and utilities related to the footer system

// Components
export { StickyFooter } from './components/StickyFooter';
export { WhiteStickyFooter } from './components/WhiteStickyFooter';

// Astro Components (can't be default exported, need to be imported directly)
// import Footer from './components/Footer.astro';

// Shaders
export { DitheringShader } from './shaders/DitheringShader';
export { LightDitheringShader } from './shaders/LightDitheringShader';

// Game
export { SpaceInvadersIsland } from './game/SpaceInvadersIsland';
// import SpaceInvaders from './game/SpaceInvaders.astro';

// Utils (Speedlify)
export { SpeedlifyStats } from './utils/SpeedlifyStats';
export { SpeedlifyStatsLight } from './utils/SpeedlifyStatsLight';
