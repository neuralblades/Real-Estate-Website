'use client';

import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import LazyComponent from './LazyComponent';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  lazyThreshold?: number;
  lazyPlaceholder?: React.ReactNode;
}

/**
 * LazyImage - A component that combines OptimizedImage with lazy loading
 * 
 * Only loads the image when it comes into the viewport
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '100vw',
  className = '',
  priority = false,
  quality = 75,
  objectFit = 'cover',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  lazyThreshold = 0.1,
  lazyPlaceholder,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // If priority is true, don't use lazy loading
  if (priority) {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        className={className}
        priority={true}
        quality={quality}
        objectFit={objectFit}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
      />
    );
  }

  // Create a placeholder with the same dimensions
  const imagePlaceholder = lazyPlaceholder || (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        aspectRatio: width && height ? width / height : undefined
      }}
    />
  );

  return (
    <LazyComponent
      threshold={lazyThreshold}
      placeholder={imagePlaceholder}
      className={className}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        className={className}
        quality={quality}
        objectFit={objectFit}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
      />
    </LazyComponent>
  );
};

export default LazyImage;
