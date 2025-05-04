'use client';

import api, { cachedGet, invalidateCache } from './api';

// Types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType: string;
  status: string;

  isOffplan?: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  mainImage: string;
  agent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  developer?: {
    id: string;
    name: string;
    logo?: string;
    slug: string;
  };
  featured: boolean;
  yearBuilt?: number;
  paymentPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilter {
  page?: number;
  type?: string;
  status?: string;

  isOffplan?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  keyword?: string;
  yearBuilt?: number;
}

// Get all properties with filtering
export const getProperties = async (filters: PropertyFilter = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/properties?${queryString}`;

    // Generate a cache key based on the filters
    const cacheKey = `properties-${queryString}`;

    // Use cached get with a 2-minute TTL for property listings
    return await cachedGet(url, {
      cacheKey,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    // Use cached get with a 5-minute TTL for featured properties
    return await cachedGet('/properties/featured', {
      cacheKey: 'featured-properties',
      cacheTTL: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (id: string) => {
  try {
    // Use cached get with a 5-minute TTL for property details
    return await cachedGet(`/properties/${id}`, {
      cacheKey: `property-${id}`,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
    });
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Create property (agent only)
export const createProperty = async (propertyData: FormData) => {
  try {
    const response = await api.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Invalidate relevant caches
    invalidateCache('featured-properties');
    // Invalidate any properties list cache
    invalidateCache('properties-');

    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Update property (agent only)
export const updateProperty = async (id: string, propertyData: FormData) => {
  try {
    const response = await api.put(`/properties/${id}`, propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Invalidate relevant caches
    invalidateCache(`property-${id}`);
    invalidateCache('featured-properties');
    // Invalidate any properties list cache
    invalidateCache('properties-');

    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

// Delete property (agent only)
export const deleteProperty = async (id: string) => {
  try {
    const response = await api.delete(`/properties/${id}`);

    // Invalidate relevant caches
    invalidateCache(`property-${id}`);
    invalidateCache('featured-properties');
    // Invalidate any properties list cache
    invalidateCache('properties-');

    return response.data;
  } catch (error: any) {
    console.error(`Error deleting property with ID ${id}:`, error);
    // Return a structured error response instead of throwing
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete property',
      error: error.message
    };
  }
};

// Get properties by agent
export const getAgentProperties = async (agentId: string) => {
  try {
    // Use cached get with a 2-minute TTL for agent properties
    return await cachedGet(`/properties/agent/${agentId}`, {
      cacheKey: `agent-properties-${agentId}`,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
    });
  } catch (error) {
    console.error(`Error fetching properties for agent ${agentId}:`, error);
    throw error;
  }
};
