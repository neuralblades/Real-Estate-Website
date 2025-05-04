'use client';

import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Global cache object
const cache: Record<string, CacheItem<any>> = {};

interface UseDataFetchingOptions {
  cacheTime?: number; // Cache time in milliseconds
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number; // Time window in which duplicate requests are ignored
}

interface UseDataFetchingResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: UseDataFetchingOptions = {}
): UseDataFetchingResult<T> {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2000, // 2 seconds default
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Check if cache is valid
  const isCacheValid = useCallback((cacheItem: CacheItem<T>) => {
    return Date.now() - cacheItem.timestamp < cacheTime;
  }, [cacheTime]);

  // Fetch data function
  const fetchData = useCallback(async (skipCache = false) => {
    // Check if we're in a deduping interval
    if (Date.now() - lastFetchTime < dedupingInterval && !skipCache) {
      return;
    }

    // Check cache first if not skipping
    if (!skipCache && cache[cacheKey] && isCacheValid(cache[cacheKey])) {
      setData(cache[cacheKey].data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLastFetchTime(Date.now());

    try {
      const result = await fetchFn();
      
      // Update cache
      cache[cacheKey] = {
        data: result,
        timestamp: Date.now(),
      };
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [cacheKey, dedupingInterval, fetchFn, isCacheValid, lastFetchTime]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up revalidation on window focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchData, revalidateOnFocus]);

  // Set up revalidation on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      fetchData();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchData, revalidateOnReconnect]);

  // Refetch function for manual refetching
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export default useDataFetching;
