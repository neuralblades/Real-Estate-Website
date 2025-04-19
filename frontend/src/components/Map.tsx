'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  address?: string;
  location?: string;
  height?: string;
  zoom?: number;
}

const Map = ({ address, location, height = '400px', zoom = 15 }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setMapError('Google Maps API key is missing');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load()
      .then(() => {
        setMapLoaded(true);
      })
      .catch((error) => {
        console.error('Error loading Google Maps API:', error);
        setMapError('Failed to load Google Maps');
      });
  }, []);

  // Geocode address to get coordinates
  useEffect(() => {
    if (!mapLoaded || !window.google || !window.google.maps) return;
    if (!address || !location) {
      setMapError('Address or location information is missing');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const fullAddress = `${address}, ${location}`;

    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setCoordinates({
          lat: lat(),
          lng: lng()
        });
      } else {
        console.error('Geocoding failed:', status);
        setMapError('Could not find location on map');
      }
    });
  }, [mapLoaded, address, location]);

  // Initialize map once we have coordinates
  useEffect(() => {
    if (!mapLoaded || !coordinates || !mapRef.current || !window.google || !window.google.maps) return;

    const mapOptions = {
      center: coordinates,
      zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    // Add marker for property location
    new window.google.maps.Marker({
      position: coordinates,
      map,
      title: location,
      animation: window.google.maps.Animation.DROP,
    });

  }, [mapLoaded, coordinates, zoom, location]);

  if (mapError) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">{mapError}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="rounded-lg overflow-hidden w-full"
      style={{ height }}
    >
      {!mapLoaded && (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
