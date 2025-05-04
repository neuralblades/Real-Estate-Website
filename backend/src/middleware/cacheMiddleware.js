/**
 * Cache middleware for API responses
 * 
 * This middleware adds caching headers to API responses based on the route
 * and implements a simple in-memory cache for GET requests.
 */

// Simple in-memory cache
const cache = new Map();

// Cache TTL in milliseconds
const DEFAULT_TTL = 60 * 1000; // 1 minute
const CACHE_TIMES = {
  '/api/properties/featured': 5 * 60 * 1000, // 5 minutes
  '/api/properties': 2 * 60 * 1000, // 2 minutes
  '/api/blog': 10 * 60 * 1000, // 10 minutes
  '/api/developers': 30 * 60 * 1000, // 30 minutes
  '/api/team': 60 * 60 * 1000, // 1 hour
};

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, { expires }] of cache.entries()) {
    if (now > expires) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get cache TTL for a specific route
 * @param {string} url - The request URL
 * @returns {number} - The cache TTL in milliseconds
 */
const getCacheTTL = (url) => {
  // Find the matching route with the longest prefix
  const matchingRoute = Object.keys(CACHE_TIMES)
    .filter(route => url.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];
  
  return matchingRoute ? CACHE_TIMES[matchingRoute] : DEFAULT_TTL;
};

/**
 * Generate a cache key from the request
 * @param {object} req - The request object
 * @returns {string} - The cache key
 */
const generateCacheKey = (req) => {
  const url = req.originalUrl || req.url;
  // Include query parameters in the cache key
  return `${req.method}:${url}`;
};

/**
 * Cache middleware
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  // Skip caching for authenticated requests
  if (req.headers.authorization) {
    return next();
  }
  
  const key = generateCacheKey(req);
  const cachedResponse = cache.get(key);
  
  // If we have a cached response and it's not expired, send it
  if (cachedResponse && Date.now() < cachedResponse.expires) {
    // Set cache headers
    res.set('X-Cache', 'HIT');
    res.set('Content-Type', cachedResponse.contentType);
    
    // Send the cached response
    return res.status(cachedResponse.status).send(cachedResponse.body);
  }
  
  // Set cache headers for the response
  const ttl = getCacheTTL(req.originalUrl || req.url);
  res.set('Cache-Control', `public, max-age=${Math.floor(ttl / 1000)}`);
  res.set('X-Cache', 'MISS');
  
  // Store the original send method
  const originalSend = res.send;
  
  // Override the send method to cache the response
  res.send = function(body) {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        body,
        contentType: res.get('Content-Type'),
        status: res.statusCode,
        expires: Date.now() + ttl
      });
    }
    
    // Call the original send method
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = cacheMiddleware;
