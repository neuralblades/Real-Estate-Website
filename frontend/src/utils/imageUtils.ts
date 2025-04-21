/**
 * Utility functions for handling image URLs
 */

// Backend server URL
const API_URL = 'http://localhost:5000';

// Default placeholder image for missing images
const DEFAULT_IMAGE = '/placeholder.png';

/**
 * Converts a relative image path to a full URL
 * @param imagePath - The relative image path (e.g., /uploads/image.jpg)
 * @returns The full URL to the image or a placeholder if the image is missing
 */
export const getFullImageUrl = (imagePath: string): string => {
  // Handle null or undefined image paths
  if (!imagePath) {
    console.log('No image path provided, using default placeholder');
    return DEFAULT_IMAGE;
  }

  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If the image path starts with /uploads, use the backend server
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }

  // If the image path is just a filename without a path, assume it's in uploads
  if (imagePath.match(/^[^/]+\.(jpg|jpeg|png|webp)$/i)) {
    return `${API_URL}/uploads/${imagePath}`;
  }

  // Otherwise, return the image path as is
  return imagePath;
};

/**
 * Handles image loading errors by providing a fallback image
 * @param event - The error event from the image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  console.log('Image failed to load, using fallback:', event.currentTarget.src);
  event.currentTarget.src = DEFAULT_IMAGE;
  event.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
};
