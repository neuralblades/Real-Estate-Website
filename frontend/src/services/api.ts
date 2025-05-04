'use client';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cacheService } from './cacheService';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      // Skip invalid test tokens
      if (token === 'test-admin-token') {
        console.log('Removing invalid test admin token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return config;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login if not already there
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Enhanced API methods with caching
interface CachedRequestConfig extends AxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number;
  cacheKey?: string;
}

/**
 * Make a GET request with optional caching
 * @param url - The URL to request
 * @param config - Request configuration with caching options
 * @returns Promise with the response data
 */
export const cachedGet = async <T = any>(
  url: string,
  config: CachedRequestConfig = {}
): Promise<T> => {
  const {
    cache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    cacheKey = url,
    ...axiosConfig
  } = config;

  // If caching is enabled and we have a cached response, return it
  if (cache) {
    const cachedData = cacheService.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Otherwise, make the request
  const response = await api.get<T>(url, axiosConfig);

  // Cache the response if caching is enabled
  if (cache) {
    cacheService.set<T>(cacheKey, response.data, cacheTTL);
  }

  return response.data;
};

/**
 * Invalidate a cached request
 * @param cacheKey - The cache key to invalidate
 */
export const invalidateCache = (cacheKey: string): void => {
  cacheService.remove(cacheKey);
};

/**
 * Clear all cached requests
 */
export const clearCache = (): void => {
  cacheService.clear();
};

export default api;
