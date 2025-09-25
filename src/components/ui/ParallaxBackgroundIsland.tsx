// ParallaxBackgroundIsland.tsx - Background component replicando exactamente v0newslettertemplate
import React, { useEffect, useRef, useState } from 'react';

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

  // Clases exactas del v0newslettertemplate
  const backgroundClasses = "absolute left-0 top-0 w-full h-full object-cover";

  return (
    <div className={className}>
      {isVideoFile ? (
        <VideoWithPlaceholder
          src={backgroundSrc}
          className={backgroundClasses}
          placeholder={placeholder}
        />
      ) : (
        <img
          src={backgroundSrc}
          alt="Background"
          className={backgroundClasses}
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      )}
    </div>
  );
};

export default ParallaxBackgroundIsland;
