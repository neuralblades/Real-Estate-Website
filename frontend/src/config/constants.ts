// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Image URL
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000/uploads';

// Pagination
export const ITEMS_PER_PAGE = 10;

// Property Types
export const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Duplex',
  'Studio',
  'Office',
  'Retail',
  'Land',
  'Other'
];

// Property Status
export const PROPERTY_STATUS = [
  'for-sale',
  'for-rent'
];

// Amenities
export const AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  'Balcony',
  'Garden',
  'Elevator',
  'Air Conditioning',
  'Furnished',
  'Pet Friendly'
];

// Map default settings
export const MAP_DEFAULT = {
  center: { lat: 25.2048, lng: 55.2708 }, // Dubai coordinates
  zoom: 12
};
