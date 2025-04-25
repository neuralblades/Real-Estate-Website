'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllDocumentRequests, updateDocumentRequestStatus, deleteDocumentRequest } from '@/services/documentRequestService';
import { formatDate } from '@/utils/dateUtils';
import Link from 'next/link';

interface DocumentRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  requestType: 'brochure' | 'floorplan';
  status: 'pending' | 'sent' | 'completed';
  createdAt: string;
  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
}

export default function DocumentRequestsPage() {
  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    requestType: '',
    status: '',
  });

  // Fetch document requests
  const fetchDocumentRequests = async () => {
    // Get token from localStorage if not available from context
    const localToken = token || localStorage.getItem('token');

    if (!localToken) {
      console.log('No token available, cannot fetch document requests');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching document requests with token:', localToken);
      const response = await getAllDocumentRequests(localToken, {
        requestType: filters.requestType as any || undefined,
        status: filters.status as any || undefined,
        page: currentPage,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
      });

      console.log('Document requests response:', response);

      if (response.success) {
        console.log('Document requests data:', response.data);
        setDocumentRequests(response.data || []);
        setTotalPages(response.pages || 1);
      } else {
        console.error('Error in response:', response.message);
        setError(response.message);
      }
    } catch (err: any) {
      console.error('Error fetching document requests:', err);
      setError(err.message || 'Failed to fetch document requests');
    } finally {
      setLoading(false);
    }
  };

  // Update document request status
  const handleStatusUpdate = async (id: string, status: 'pending' | 'sent' | 'completed') => {
    // Get token from localStorage if not available from context
    const localToken = token || localStorage.getItem('token');

    if (!localToken) return;

    try {
      const response = await updateDocumentRequestStatus(id, status, localToken);
      if (response.success) {
        // Update the local state
        setDocumentRequests(prev =>
          prev.map(req => (req.id === id ? { ...req, status } : req))
        );
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Delete document request
  const handleDelete = async (id: string) => {
    // Get token from localStorage if not available from context
    const localToken = token || localStorage.getItem('token');

    if (!localToken) return;

    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const response = await deleteDocumentRequest(id, localToken);
        if (response.success) {
          // Remove from local state
          setDocumentRequests(prev => prev.filter(req => req.id !== id));
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete request');
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Effect to fetch data on mount and when dependencies change
  useEffect(() => {
    // Get token from localStorage if not available from context
    const localToken = token || localStorage.getItem('token');

    if (localToken) {
      console.log('Token available, fetching document requests');
      fetchDocumentRequests();
    } else {
      console.log('No token available in useEffect');
    }
  }, [token, currentPage, filters]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a49650]"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Authentication Required</h1>
        <p className="text-gray-700 mb-4">Please log in to access this page.</p>
        <a href="/auth/login?redirect=/admin/document-requests" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Log In
        </a>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Requests</h1>

        {/* Filters */}
        <div className="flex space-x-4">
          <div>
            <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
              Request Type
            </label>
            <select
              id="requestType"
              name="requestType"
              value={filters.requestType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="brochure">Brochure</option>
              <option value="floorplan">Floor Plan</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : documentRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No document requests found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.firstName} {request.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.email}</div>
                      <div className="text-sm text-gray-500">{request.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/properties/${request.property?.id || request.propertyId}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {request.propertyTitle || request.property?.title || 'Unknown Property'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.requestType === 'brochure'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {request.requestType === 'brochure' ? 'Brochure' : 'Floor Plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(request.id, e.target.value as any)}
                        className={`text-sm font-medium rounded px-2 py-1 ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <div className="mx-4">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
