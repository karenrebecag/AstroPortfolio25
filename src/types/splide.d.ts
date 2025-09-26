// Type declarations for @splidejs/react-splide
declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react';

  export interface SplideOptions {
    type?: 'slide' | 'loop' | 'fade';
    perPage?: number;
    perMove?: number;
    gap?: string | number;
    arrows?: boolean;
    pagination?: boolean;
    autoplay?: boolean;
    pauseOnHover?: boolean;
    resetProgress?: boolean;
    [key: string]: any;
  }

  export interface SplideProps {
    className?: string;
    options?: SplideOptions;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    key?: string;
    role?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps & { ref?: any }>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}

declare module '@splidejs/react-splide/css/core' {
  // CSS module
}
