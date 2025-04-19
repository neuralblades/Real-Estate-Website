import { NextRequest } from 'next/server';

// Backend server URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Proxy route handler for image resources
 * This allows us to proxy image requests to the backend server
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path segments and join them
    const path = params.path.join('/');

    // Construct the full URL
    const url = `${API_BASE_URL}/uploads/${path}`;

    // Fetch the resource from the backend
    const response = await fetch(url);

    // If the response is not OK, return an error
    if (!response.ok) {
      return new Response(null, {
        status: response.status,
        statusText: response.statusText
      });
    }

    // Get the image data
    const imageData = await response.arrayBuffer();

    // Get the content type from the response
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with the correct content type
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
