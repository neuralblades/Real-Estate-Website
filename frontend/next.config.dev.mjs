/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure image optimization
  images: {
    // Configure remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],

    // Configure image formats
    formats: ['image/webp', 'image/avif'],

    // Set the device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Set the image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Set the minimum cache TTL for optimized images
    minimumCacheTTL: 60 * 60 * 24, // 24 hours

    // Allow SVG images (for icons and logos)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configure compression (using Next.js built-in compression)
  compress: true, // This uses Next.js built-in compression which doesn't use util._extend

  // Configure the build output
  output: 'standalone',

  // Configure the build ID
  generateBuildId: async () => {
    // You can set this to be a constant value or generate it based on the current time
    return `build-${Date.now()}`;
  },

  // Configure the asset prefix
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  // Configure the trailing slash
  trailingSlash: false,

  // Configure the build directory
  distDir: '.next',

  // Configure the experimental features
  experimental: {
    // Enable optimizations for large pages
    optimizePackageImports: ['react-icons', 'date-fns', 'lodash'],
    // Disable process killing that causes EPERM errors
    forceSwcTransforms: true,
  },

  // Configure the headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Configure the redirects
  async redirects() {
    return [];
  },

  // Configure the rewrites
  async rewrites() {
    return [
      // Proxy direct uploads requests to the backend
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
      // Proxy API image requests to the backend
      {
        source: '/api/images/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
      // Proxy property images
      {
        source: '/property-images/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },

  // Disable the process killing that causes EPERM errors
  onDemandEntries: {
    // Keep the pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // Don't dispose of pages
    pagesBufferLength: 5,
  },
};

export default nextConfig;
