'use client';

import api from './api';

interface DocumentRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  requestType: 'brochure' | 'floorplan';
}

interface DocumentRequestResponse {
  success: boolean;
  message: string;
  documentRequest?: any;
  error?: string;
}

/**
 * Create a new document request (brochure or floor plan)
 */
export const createDocumentRequest = async (data: DocumentRequestData): Promise<DocumentRequestResponse> => {
  try {
    const response = await api.post('/document-requests', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating document request:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create document request',
    };
  }
};

/**
 * Get all document requests (admin only)
 */
export const getAllDocumentRequests = async (
  token: string,
  filters: {
    requestType?: 'brochure' | 'floorplan';
    status?: 'pending' | 'sent' | 'completed';
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
  } = {}
) => {
  try {
    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Make the request with query parameters
    const response = await api.get('/document-requests', { params: filters });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching document requests:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch document requests',
    };
  }
};

/**
 * Update document request status (admin only)
 */
export const updateDocumentRequestStatus = async (
  id: string,
  status: 'pending' | 'sent' | 'completed',
  token: string
) => {
  try {
    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Make the request
    const response = await api.put(`/document-requests/${id}`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating document request status:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update document request status',
    };
  }
};

/**
 * Delete document request (admin only)
 */
export const deleteDocumentRequest = async (id: string, token: string) => {
  try {
    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Make the request
    const response = await api.delete(`/document-requests/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting document request:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete document request',
    };
  }
};
