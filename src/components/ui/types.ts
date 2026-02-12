/** Shared type for Quick Project cards used by marquee and slider */
export interface QuickProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  url: string;
  type: string;
}
