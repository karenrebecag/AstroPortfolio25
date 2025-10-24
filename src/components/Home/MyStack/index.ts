// MyStack Module - Centralized exports
// This module contains all components related to the tech stack section

// Main Astro Components (can't be default exported, need to be imported directly)
// import MyStack from './MyStack.astro';
// import TechStack from './TechStack.astro';
// import TechMarquees from './TechMarquees.astro';

// React Components
export { AnimatedTechStackHeader, AnimatedTechSection, AnimatedTechItem } from './components/AnimatedTechStackWrapper';
export { default as TechMarqueesIsland } from './components/TechMarqueesIsland';
export { default as MyStackIsland } from './components/MyStackIsland';
export { MarqueeAnimation } from './components/MarqueeAnimation';

// Re-export types (check MarqueeAnimation.tsx for available types)
