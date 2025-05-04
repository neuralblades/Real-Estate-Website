'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  getFullImageUrl,
  handleImageError,
  getResponsiveSizes,
  generateBlurPlaceholder
} from '@/utils/imageUtils';

interface OptimizedImageProps {
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
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
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
}) => {
  // Start with isLoaded=false to ensure the fade-in effect
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Force images to start with opacity-0 by using useEffect
  useEffect(() => {
    // Reset loading state when src changes
    setIsLoaded(false);

    // For cached images that load instantly, set loaded after a small delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [src]);

  // Ensure alt text is provided and meaningful
  const safeAlt = alt && alt.trim() !== '' ? alt : 'Image';

  // Generate a default blur data URL if not provided
  const defaultBlurDataURL = blurDataURL || generateBlurPlaceholder(100, 100);

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || getResponsiveSizes();

  // Handle image load
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Make sure the image is actually loaded before setting isLoaded to true
    const img = event.target as HTMLImageElement;
    if (img.complete) {
      // Use a small timeout to ensure the transition is visible
      setTimeout(() => {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }, 10);
    } else {
      // For images that load very quickly, set loaded state directly
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  };

  // Handle image error
  const handleError = () => {
    console.error(`Image failed to load: ${fullSrc}`);
    setError(true);
    // Create a synthetic event with the current image source
    const event = {
      currentTarget: {
        src: fullSrc,
        onerror: null
      }
    } as React.SyntheticEvent<HTMLImageElement, Event>;
    handleImageError(event);
  };

  // If there's an error, show a fallback
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Get the full image URL
  const fullSrc = getFullImageUrl(src);

  // Common props for the Image component
  const imageProps = {
    src: fullSrc,
    alt: safeAlt, // Use the safe alt text
    // Next.js 15 doesn't support the quality prop directly in the images config
    // but we can still pass it to the Image component
    ...(quality ? { quality } : {}),
    sizes: responsiveSizes,
    className: `transition-opacity duration-500 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    style: { objectFit } as React.CSSProperties,
    onLoad: handleLoad,
    onError: handleError,
    priority,
    placeholder: placeholder as 'blur' | 'empty',
    blurDataURL: defaultBlurDataURL,
    loading: priority ? undefined : 'lazy' as const,
  };

  return fill ? (
    <div className="relative w-full h-full bg-gray-100">
      <Image
        {...imageProps}
        alt={safeAlt} // Explicitly add alt prop to satisfy ESLint
        fill
      />
    </div>
  ) : (
    <div className="relative bg-gray-100" style={{ width: width || 'auto', height: height || 'auto' }}>
      <Image
        {...imageProps}
        alt={safeAlt} // Explicitly add alt prop to satisfy ESLint
        width={width || 100}
        height={height || 100}
      />
    </div>
  );
};

export default OptimizedImage;
