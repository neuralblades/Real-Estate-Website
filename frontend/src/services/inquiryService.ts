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
