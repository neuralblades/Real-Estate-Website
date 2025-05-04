'use client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {
    this.cache = new Map();
    
    // Clean up expired cache items periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanupExpiredItems(), 60 * 1000); // Run every minute
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Set an item in the cache
   * @param key - The cache key
   * @param data - The data to cache
   * @param ttl - Time to live in milliseconds (optional, defaults to 5 minutes)
   */
  public set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;
    
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });
  }

  /**
   * Get an item from the cache
   * @param key - The cache key
   * @returns The cached data or null if not found or expired
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Check if an item exists in the cache and is not expired
   * @param key - The cache key
   * @returns True if the item exists and is not expired
   */
  public has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove an item from the cache
   * @param key - The cache key
   */
  public remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Remove all expired items from the cache
   */
  private cleanupExpiredItems(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get the number of items in the cache
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Set the default TTL for cache items
   * @param ttl - Time to live in milliseconds
   */
  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Export a singleton instance
export const cacheService = CacheService.getInstance();

// Export a hook for React components
export function useCacheService() {
  return cacheService;
}
