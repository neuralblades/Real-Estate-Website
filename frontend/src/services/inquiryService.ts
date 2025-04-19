'use client';

import api from './api';

// Types
export interface Inquiry {
  _id: string;
  property: string | {
    _id: string;
    title: string;
    mainImage: string;
  };
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface InquiryData {
  property: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface GeneralInquiryData {
  name: string;
  phone: string;
  email?: string;
  propertyType?: string;
  bedroomCount?: string;
  propertyInterest?: string;
  message?: string;
}

// Create a new inquiry
export const createInquiry = async (inquiryData: InquiryData) => {
  try {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
};

// Get inquiries for a property (agent only)
export const getPropertyInquiries = async (propertyId: string) => {
  try {
    const response = await api.get(`/inquiries/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inquiries for property ${propertyId}:`, error);
    throw error;
  }
};

// Get inquiries for an agent (agent only)
export const getAgentInquiries = async () => {
  try {
    const response = await api.get('/inquiries/agent');
    return response.data;
  } catch (error) {
    console.error('Error fetching agent inquiries:', error);
    throw error;
  }
};

// Update inquiry status (agent only)
export const updateInquiryStatus = async (inquiryId: string, status: 'new' | 'in-progress' | 'resolved') => {
  try {
    const response = await api.put(`/inquiries/${inquiryId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating inquiry ${inquiryId}:`, error);
    throw error;
  }
};

// Get all inquiries (admin only)
export const getAllInquiries = async () => {
  try {
    const response = await api.get('/inquiries');
    return response.data;
  } catch (error) {
    console.error('Error fetching all inquiries:', error);
    throw error;
  }
};

// Create a general inquiry (not tied to a specific property)
export const createGeneralInquiry = async (inquiryData: GeneralInquiryData) => {
  try {
    // First try to submit to the backend if it has a general inquiry endpoint
    try {
      const response = await api.post('/inquiries/general', inquiryData);
      return response.data;
    } catch (apiError) {
      // If the endpoint doesn't exist or there's an error, store in localStorage as a fallback
      const existingInquiries = JSON.parse(localStorage.getItem('generalInquiries') || '[]');
      const newInquiry = {
        ...inquiryData,
        id: `inquiry-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      existingInquiries.push(newInquiry);
      localStorage.setItem('generalInquiries', JSON.stringify(existingInquiries));

      return newInquiry;
    }
  } catch (error) {
    console.error('Error creating general inquiry:', error);
    throw error;
  }
};

// Get all general inquiries from localStorage (admin only)
export const getGeneralInquiries = () => {
  try {
    // Get inquiries from localStorage
    const inquiries = JSON.parse(localStorage.getItem('generalInquiries') || '[]');

    // No test data needed anymore

    return inquiries;
  } catch (error) {
    console.error('Error fetching general inquiries:', error);
    return [];
  }
};
