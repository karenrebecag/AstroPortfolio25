// ParallaxBackgroundIsland.tsx - Background component replicando exactamente v0newslettertemplate
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxBackgroundProps {
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

const ParallaxBackgroundIsland: React.FC<ParallaxBackgroundProps> = ({
  backgroundSrc,
  placeholder,
  className = ""
}) => {
  const extension = getFileExtension(backgroundSrc);
  const isVideoFile = isVideo(extension);
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll para toda la página (más simple y confiable)
  const { scrollYProgress } = useScroll();
  
  // Transformar el progreso del scroll a padding SÚPER EXAGERADO 
  // Mapeo: scroll 0% = padding 0px, scroll 100% = padding 400px
  const paddingValue = useTransform(scrollYProgress, [0, 1], [0, 800]);
  
  // Border-radius SÚPER EXAGERADO para debug
  // Mapeo: scroll 0% = radius 0px, scroll 100% = radius 1200px
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 1200]);

  // DEBUG: Log valores en consola
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      console.log('🔥 SCROLL PROGRESS:', latest);
      console.log('📦 PADDING VALUE:', paddingValue.get());
      console.log('🔵 BORDER RADIUS:', borderRadius.get());
      console.log('🎯 CONTAINER REF:', containerRef.current);
    });

    return () => unsubscribe();
  }, [scrollYProgress, paddingValue, borderRadius]);

  // Clases exactas del v0newslettertemplate
  const backgroundClasses = "absolute left-0 top-0 w-full h-full object-cover";

  // DEBUG: Log cuando se monta el componente
  useEffect(() => {
    console.log('🚀 ParallaxBackgroundIsland MOUNTED');
    console.log('🎬 Video file:', isVideoFile);
    console.log('📁 Background src:', backgroundSrc);
    console.log('🖼️ Placeholder:', placeholder);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {isVideoFile ? (
        <motion.div
          style={{
            position: 'absolute',
            top: paddingValue,
            left: paddingValue,
            right: paddingValue,
            bottom: paddingValue,
            borderRadius: borderRadius,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 0, 0, 0.2)', // DEBUG: fondo rojo semi-transparente
            border: '5px solid yellow' // DEBUG: borde amarillo visible
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
            top: paddingValue,
            left: paddingValue,
            right: paddingValue,
            bottom: paddingValue,
            borderRadius: borderRadius,
            objectFit: 'cover',
            objectPosition: 'center',
            backgroundColor: 'rgba(255, 0, 0, 0.2)', // DEBUG: fondo rojo semi-transparente
            border: '5px solid yellow' // DEBUG: borde amarillo visible
          }}
        />
      )}
    </div>
  );
};

export default ParallaxBackgroundIsland;
