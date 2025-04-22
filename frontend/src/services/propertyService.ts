'use client';

import api from './api';

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

    const response = await api.get(`/properties?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    const response = await api.get('/properties/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (id: string) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
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
    const response = await api.get(`/properties/agent/${agentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching properties for agent ${agentId}:`, error);
    throw error;
  }
};
