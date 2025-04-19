/**
 * Utility functions for handling image URLs
 */

// Backend server URL
const API_URL = 'http://localhost:5000';

/**
 * Converts a relative image path to a full URL
 * @param imagePath - The relative image path (e.g., /uploads/image.jpg)
 * @returns The full URL to the image
 */
export const getFullImageUrl = (imagePath: string): string => {
  // Handle null or undefined image paths
  if (!imagePath) {
    return '';
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
