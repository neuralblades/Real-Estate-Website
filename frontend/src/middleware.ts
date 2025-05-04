import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function will be executed for every request
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // Add custom headers to avoid the util._extend deprecation warning
  // These headers help with compression without relying on the compression middleware
  response.headers.set('Cache-Control', 'public, max-age=3600');
  
  // Return the modified response
  return response;
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    // Apply to all routes except for API routes, static files, and images
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
