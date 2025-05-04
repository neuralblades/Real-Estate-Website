/**
 * Utility functions for handling image URLs and optimizations
 */

// Backend server URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Default placeholder image for missing images
const DEFAULT_IMAGE = '/placeholder.png';

// Default image quality for WebP conversion
const DEFAULT_WEBP_QUALITY = 80;

// Debug mode for image loading
const DEBUG_IMAGES = false;

// Image optimization settings
const IMAGE_OPTIMIZATION = {
  enabled: true,      // Enable Next.js image optimization
  quality: 80,        // Default quality for optimized images
  formats: ['webp'],  // Preferred formats
};

// Check if WebP is supported by the browser
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side rendering
  }

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check if toDataURL returns a WebP data URL
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  return false;
};

/**
 * Converts a relative image path to a full URL with proper optimization handling
 * @param imagePath - The relative image path (e.g., /uploads/image.jpg)
 * @param preferWebP - Whether to prefer WebP format if supported
 * @returns The full URL to the image or a placeholder if the image is missing
 */
export const getFullImageUrl = (imagePath: string, preferWebP: boolean = true): string => {
  // Handle null or undefined image paths
  if (!imagePath) {
    if (DEBUG_IMAGES) console.log('No image path provided, using default placeholder');
    return DEFAULT_IMAGE;
  }

  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Check if we should use WebP format
  const useWebP = preferWebP && isWebPSupported() && !imagePath.endsWith('.webp');

  // If the image path starts with /uploads, use our proxy
  if (imagePath.startsWith('/uploads/')) {
    // For Next.js Image optimization, we use the local proxy path
    // This allows Next.js to optimize the image while still fetching from the backend
    const path = imagePath.substring(9); // Remove '/uploads/'
    const proxyUrl = `/property-images/${path}`;

    if (DEBUG_IMAGES) {
      console.log(`Image URL (optimized): ${proxyUrl}`);
    }

    return proxyUrl;
  }

  // If the image path is just a filename without a path, assume it's in uploads
  if (imagePath.match(/^[^/]+\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
    // For Next.js Image optimization, we use the local proxy path
    const proxyUrl = `/property-images/${imagePath}`;

    if (DEBUG_IMAGES) {
      console.log(`Image URL (filename only, optimized): ${proxyUrl}`);
    }

    return proxyUrl;
  }

  // For static images in the public directory
  if (imagePath.startsWith('/') && !imagePath.startsWith('/api/')) {
    return imagePath;
  }

  // Otherwise, return the image path as is
  return imagePath;
};

/**
 * Handle image loading errors by replacing with a placeholder
 * @param event - The error event from the image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  if (DEBUG_IMAGES) {
    console.error(`Image error handled for: ${event.currentTarget.src}`);
  }

  // Only set the placeholder if the current src is not already the placeholder
  if (event.currentTarget.src !== DEFAULT_IMAGE) {
    event.currentTarget.src = DEFAULT_IMAGE;
    event.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
  }
};

/**
 * Generate responsive image sizes for different screen sizes
 * @param defaultSize - The default size of the image
 * @returns A string of image sizes for the sizes attribute
 */
export const getResponsiveSizes = (defaultSize: string = '100vw'): string => {
  return `
    (max-width: 640px) 100vw,
    (max-width: 768px) 80vw,
    (max-width: 1024px) 60vw,
    (max-width: 1280px) 50vw,
    ${defaultSize}
  `.trim().replace(/\s+/g, ' ');
};

/**
 * Generate a blur data URL for an image placeholder
 * @param width - The width of the placeholder
 * @param height - The height of the placeholder
 * @param color - The background color of the placeholder
 * @returns A data URL for the placeholder
 */
export const generateBlurPlaceholder = (
  width: number = 10,
  height: number = 10,
  color: string = '#f1f1f1'
): string => {
  // Create an SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `.trim().replace(/\s+/g, ' ');

  // Convert to base64
  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);

  return `data:image/svg+xml;base64,${base64}`;
};
