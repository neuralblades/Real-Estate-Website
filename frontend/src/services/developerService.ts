'use client';

import api from './api';

// Types
export interface Developer {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  established?: number;
  headquarters?: string;
  featured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Get all developers
export const getDevelopers = async () => {
  try {
    const response = await api.get('/developers');
    return response.data;
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw error;
  }
};

// Get featured developers
export const getFeaturedDevelopers = async () => {
  try {
    const response = await api.get('/developers/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured developers:', error);
    throw error;
  }
};

// Get developer by ID
export const getDeveloperById = async (id: string) => {
  try {
    const response = await api.get(`/developers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching developer with ID ${id}:`, error);
    throw error;
  }
};

// Get developer by slug
export const getDeveloperBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/developers/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching developer with slug ${slug}:`, error);
    throw error;
  }
};

// Get developer properties
export const getDeveloperProperties = async (id: string, page = 1) => {
  try {
    const response = await api.get(`/developers/${id}/properties?page=${page}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching properties for developer ${id}:`, error);
    throw error;
  }
};

// Get developer properties by slug
export const getDeveloperPropertiesBySlug = async (slug: string, page = 1) => {
  try {
    const response = await api.get(`/developers/slug/${slug}/properties?page=${page}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching properties for developer ${slug}:`, error);
    throw error;
  }
};

// Create a new developer (admin only)
export const createDeveloper = async (formData: FormData) => {
  try {
    const response = await api.post('/developers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating developer:', error);
    throw error;
  }
};

// Update a developer (admin only)
export const updateDeveloper = async (id: string, formData: FormData) => {
  try {
    const response = await api.put(`/developers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating developer ${id}:`, error);
    throw error;
  }
};

// Delete a developer (admin only)
export const deleteDeveloper = async (id: string) => {
  try {
    const response = await api.delete(`/developers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting developer ${id}:`, error);
    throw error;
  }
};

// Get developer logo URL
export const getDeveloperLogoUrl = (logoPath: string | null | undefined) => {
  if (!logoPath) return '/images/developers/default.webp';

  if (logoPath.startsWith('http')) {
    return logoPath;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/${logoPath}`;
};
