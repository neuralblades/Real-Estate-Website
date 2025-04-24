'use client';

import { Loader } from '@googlemaps/js-api-loader';

// Singleton pattern to ensure we only load the API once
let loaderInstance: Loader | null = null;
let loadPromise: Promise<typeof google> | null = null;

export const getGoogleMapsLoader = () => {
  if (!loaderInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    
    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places']
    });
  }
  
  return loaderInstance;
};

export const loadGoogleMapsApi = (): Promise<typeof google> => {
  if (!loadPromise) {
    const loader = getGoogleMapsLoader();
    loadPromise = loader.load();
  }
  
  return loadPromise;
};

// Check if Google Maps API is already loaded
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         window.google !== undefined && 
         window.google.maps !== undefined;
};
