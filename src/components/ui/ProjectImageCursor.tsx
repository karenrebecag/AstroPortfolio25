import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Project as CMSProject } from '../../lib/cms';

interface ProjectImageData {
  id: number;
  src: string;
  alt: string;
}

interface ProjectImageCursorProps {
  projects: CMSProject[];
}

// Hook para detectar dispositivos desktop
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
      
      setIsDesktop(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return isDesktop;
};

export const ProjectImageCursor: React.FC<ProjectImageCursorProps> = ({ projects: cmsProjects }) => {
  const isDesktop = useIsDesktop();
  const [activeImage, setActiveImage] = useState<ProjectImageData | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef<number | null>(null);
  const prevCursorPosition = useRef({ x: 0, y: 0 });

  // Fallback images for projects without mainImage
  const fallbackImages: Record<number, string> = {
    1: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/KarenBillboard.webp',
    2: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Frame%202147225832.webp',
    3: 'https://picsum.photos/300/300?random=13',
    4: 'https://picsum.photos/300/300?random=17',
    5: 'https://picsum.photos/300/300?random=21',
  };

  // Build project images map from CMS data (memoized — cmsProjects is stable)
  const projectImages = useMemo<Record<number, ProjectImageData>>(() =>
    cmsProjects.reduce((acc, project, index) => {
      const projectId = index + 1;
      acc[projectId] = {
        id: projectId,
        src: project.mainImage?.url || fallbackImages[projectId] || `https://picsum.photos/300/300?random=${projectId}`,
        alt: project.mainImage?.alt || project.title || `Project ${projectId}`,
      };
      return acc;
    }, {} as Record<number, ProjectImageData>),
  [cmsProjects]);

  // Smooth cursor movement with easing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const dx = clientX - prevCursorPosition.current.x;
    const dy = clientY - prevCursorPosition.current.y;

    const easeAmount = 0.2;
    const newX = prevCursorPosition.current.x + dx * easeAmount;
    const newY = prevCursorPosition.current.y + dy * easeAmount;

    setCursorPosition({ x: newX, y: newY });
    prevCursorPosition.current = { x: newX, y: newY };
  }, []);

  // Update cursor position with requestAnimationFrame
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      if (requestRef.current) return;
      requestRef.current = requestAnimationFrame(() => {
        handleMouseMove(e);
        requestRef.current = null;
      });
    };

    window.addEventListener('mousemove', updateCursorPosition);
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [handleMouseMove]);

  // Handle project hover
  const handleProjectHover = useCallback((projectId: number) => {
    if (!isDesktop) return;
    
    const image = projectImages[projectId];
    if (!image) return;

    if (activeImage?.id !== image.id) {
      setActiveImage(image);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpacity(1);
        setScale(1);
      }, 50);
    } else {
      setOpacity(1);
      setScale(1);
    }
  }, [activeImage, isDesktop]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    setScale(0.5);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveImage(null);
    }, 300);
  }, []);

  // Set up event listeners for project items
  useEffect(() => {
    if (!isDesktop) return;

    const projectItems = document.querySelectorAll('.project-item');
    
    const handleMouseEnter = (e: Event) => {
      const projectItem = e.currentTarget as HTMLElement;
      const projectId = parseInt(projectItem.getAttribute('data-project') || '0');
      if (projectId) {
        handleProjectHover(projectId);
      }
    };

    projectItems.forEach(item => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      projectItems.forEach(item => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isDesktop, handleProjectHover, handleMouseLeave]);

  // Don't render on mobile or if no active image
  if (!isDesktop || !activeImage) return null;

  return (
    <img
      src={activeImage.src}
      alt={activeImage.alt}
      className="fixed pointer-events-none z-30 w-[280px] h-[200px] rounded-lg object-cover border-4 border-white shadow-xl"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    />
  );
};

export default ProjectImageCursor;
