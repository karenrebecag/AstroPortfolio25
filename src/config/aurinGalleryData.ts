// aurinGalleryData.ts - Gallery configuration data for Aurin Task Manager
export interface GallerySlide {
  title: string;
  button: string;
  src: string;
  alt?: string;
}

export const aurinGallerySlides: GallerySlide[] = [
  {
    title: "Aurin Dashboard",
    button: "View Dashboard",
    src: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin1.webp",
    alt: "Aurin Task Manager dashboard overview showing project statistics and recent activity"
  },
  {
    title: "Task Management",
    button: "View Tasks",
    src: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin2.webp",
    alt: "Task management interface with drag-and-drop functionality and status tracking"
  },
  {
    title: "Analytics Overview",
    button: "View Analytics",
    src: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin3.webp",
    alt: "Analytics dashboard displaying project metrics, time tracking, and performance insights"
  },
  {
    title: "Team Collaboration",
    button: "View Team",
    src: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin4.webp",
    alt: "Team collaboration features including real-time messaging and file sharing"
  },
  {
    title: "Project Settings",
    button: "View Settings",
    src: "https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/aurin5.webp",
    alt: "Project configuration settings with user permissions and notification preferences"
  }
];

export const aurinGalleryConfig = {
  title: "Gallery",
  label: "Visual Showcase",
  slides: aurinGallerySlides
};
