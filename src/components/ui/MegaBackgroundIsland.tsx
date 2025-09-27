// MegaBackgroundIsland.tsx - Background component sin efectos exagerados de padding
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface MegaBackgroundProps {
  backgroundSrc: string;
  placeholder?: string;
  className?: string;
}

const getFileExtension = (url: string): string => {
  return url.split(".").pop()?.toLowerCase() || "";
};

const isVideo = (extension: string): boolean => {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "m4v"];
  return videoExtensions.includes(extension);
};

const VideoWithPlaceholder: React.FC<{
  src: string;
  className?: string;
  placeholder?: string;
}> = ({ src, className, placeholder }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !placeholder) {
      console.warn("No placeholder provided for video");
    }
  }, [placeholder]);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("canplay", handleCanPlay);
      video.load();
      
      if (video.readyState >= 2) {
        setVideoLoaded(true);
      }
      
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [src]);

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play();
    }
  }, [videoLoaded]);

  return (
    <>
      {placeholder && (
        <img
          src={placeholder}
          loading="eager"
          fetchPriority="high"
          alt="Background"
          className={`${className} ${videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-600`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        controls={false}
        preload="auto"
        className={`${className} ${!videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-600`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </>
  );
};

const MegaBackgroundIslandComponent: React.FC<MegaBackgroundProps> = ({
  backgroundSrc,
  placeholder,
  className = ""
}) => {
  const extension = getFileExtension(backgroundSrc);
  const isVideoFile = isVideo(extension);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // useScroll para toda la página
  const { scrollYProgress } = useScroll();
  
  // Efectos sutiles sin padding exagerado - solo cuando es visible
  const scaleValue = useTransform(scrollYProgress, [0, 1], isVisible ? [1, 1.05] : [1, 1]);
  const yValue = useTransform(scrollYProgress, [0, 1], isVisible ? [0, -20] : [0, 0]);

  // IntersectionObserver para optimización de performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '200px 0px', // Carga temprana pero no demasiado
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`mega-background ${className}`}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%'
      }}
    >
      {isVideoFile ? (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            scale: scaleValue,
            y: yValue,
            overflow: 'hidden'
          }}
        >
          <VideoWithPlaceholder
            src={backgroundSrc}
            className="absolute left-0 top-0 w-full h-full object-cover"
            placeholder={placeholder}
          />
        </motion.div>
      ) : (
        <motion.img
          src={backgroundSrc}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            scale: scaleValue,
            y: yValue,
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1
          }}
        />
      )}
    </div>
  );
};

// Optimización con React.memo para evitar re-renders innecesarios
const MegaBackgroundIsland = React.memo(MegaBackgroundIslandComponent);

export default MegaBackgroundIsland;
