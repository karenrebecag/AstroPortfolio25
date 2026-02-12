// Footer Module - Centralized exports

// Components (unified with variant prop)
export { StickyFooter, WhiteStickyFooter } from './components/StickyFooter';

// Astro Components (can't be default exported, need to be imported directly)
// import Footer from './components/Footer.astro';

// Shaders
export { DitheringShader } from './shaders/DitheringShader';
export { LightDitheringShader } from './shaders/LightDitheringShader';

// Game
export { SpaceInvadersIsland } from './game/SpaceInvadersIsland';
// import SpaceInvaders from './game/SpaceInvaders.astro';

// Utils (unified with variant prop)
export { SpeedlifyStats, SpeedlifyStatsLight } from './utils/SpeedlifyStats';
