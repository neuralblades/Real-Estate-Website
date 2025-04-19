import { NextRequest } from 'next/server';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Proxy route handler for backend resources
 * This allows us to proxy requests to the backend server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Get the path segments and join them
  const path = params.path.join('/');

  // Construct the full URL
  const url = `${API_BASE_URL}/${path}`;

  // Fetch the resource from the backend and return it directly
  return fetch(url);
}
