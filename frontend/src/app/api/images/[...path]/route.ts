import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Backend server URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Default placeholder image path
const DEFAULT_IMAGE_PATH = path.join(process.cwd(), 'public', 'placeholder.png');

/**
 * Proxy route handler for image resources
 * This allows us to proxy image requests to the backend server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path segments and join them
    const imagePath = params.path.join('/');

    // Determine content type based on file extension
    let contentType = 'image/jpeg'; // Default
    if (imagePath.endsWith('.png')) {
      contentType = 'image/png';
    } else if (imagePath.endsWith('.webp')) {
      contentType = 'image/webp';
    } else if (imagePath.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    } else if (imagePath.endsWith('.gif')) {
      contentType = 'image/gif';
    }

    // Construct the full URL
    const url = `${API_BASE_URL}/uploads/${imagePath}`;

    console.log(`Proxying image request to: ${url}`);

    // Fetch the resource from the backend
    const response = await fetch(url, {
      headers: {
        'Accept': 'image/*'
      },
      cache: 'no-store' // Ensure we're not using cached responses
    });

    // If the response is not OK, return a placeholder image
    if (!response.ok) {
      console.error(`Image not found: ${url}, status: ${response.status}`);

      try {
        // Return the placeholder image
        const placeholderData = await fs.readFile(DEFAULT_IMAGE_PATH);
        return new Response(placeholderData, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=60' // Short cache for placeholder
          }
        });
      } catch (placeholderError) {
        console.error('Error loading placeholder image:', placeholderError);
        return new Response('Image not found', { status: 404 });
      }
    }

    // Get the image data
    const imageData = await response.arrayBuffer();

    // Get the content type from the response or use our determined one
    const responseContentType = response.headers.get('content-type');

    // Return the image with the correct content type
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': responseContentType || contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);

    try {
      // Return the placeholder image on error
      const placeholderData = await fs.readFile(DEFAULT_IMAGE_PATH);
      return new Response(placeholderData, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60' // Short cache for placeholder
        }
      });
    } catch (placeholderError) {
      console.error('Error loading placeholder image:', placeholderError);
      return new Response('Error fetching image', { status: 500 });
    }
  }
}
