import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12'
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  fallback, 
  size = 'md', 
  className = '' 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={(e) => {
            // Hide image on error, show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      {(!src || fallback) && (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium">
          {fallback || getInitials(alt)}
        </div>
      )}
    </div>
  );
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className = '' }) => (
  <img 
    src={src} 
    alt={alt}
    className={`aspect-square h-full w-full object-cover ${className}`}
  />
);

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ${className}`}>
    {children}
  </div>
);
