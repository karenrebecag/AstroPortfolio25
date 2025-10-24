// Services Module - Centralized exports
// This module contains all components related to the services section

// Main Services Component (Astro component)
// Note: Astro components can't be default exported, need to be imported directly
// import Services from './Services.astro';

// React Components
export { default as ServicesIsland } from './components/ServicesIsland';
export { BounceCards } from './components/BounceCards';

// Types
export interface Position {
  x: number;
  y: number;
  rotate: number;
}

export interface Service {
  id: number;
  title1: string;
  title2: string;
  description: string;
  tags: string[];
  technologies: string[];
  example: string;
  images: string[];
  positions: Position[];
}

export interface ServicesIslandProps {
  lang?: string;
}
