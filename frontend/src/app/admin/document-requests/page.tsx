'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllDocumentRequests, updateDocumentRequestStatus, deleteDocumentRequest } from '@/services/documentRequestService';
import { formatDate } from '@/utils/dateUtils';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';
import { FaTrash } from 'react-icons/fa';

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
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    requestType: '',
    status: '',
  });

  // Effect to fetch data on mount and when dependencies change
  useEffect(() => {
    // Get token from localStorage
    const localToken = localStorage.getItem('token');

    if (localToken) {
      const fetchDocumentRequests = async () => {
        setLoading(true);
        try {
          const response = await getAllDocumentRequests(localToken, {
            requestType: filters.requestType ? (filters.requestType as 'brochure' | 'floorplan') : undefined,
            status: filters.status ? (filters.status as 'pending' | 'sent' | 'completed') : undefined,
            page: currentPage,
            limit: 10,
            sort: 'createdAt',
            order: 'DESC',
          });

          if (response.success) {
            setDocumentRequests(response.data || []);
            setTotalPages(response.pages || 1);
          } else {
            setError(response.message);
          }
        } catch (err) {
          console.error('Error fetching document requests:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch document requests';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchDocumentRequests();
    }
  }, [currentPage, filters]);

  // Update document request status
  const handleStatusUpdate = async (id: string, status: 'pending' | 'sent' | 'completed') => {
    // Get token from localStorage
    const localToken = localStorage.getItem('token');

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
    }
  };

  // Delete document request
  const handleDelete = async (id: string) => {
    // Get token from localStorage
    const localToken = localStorage.getItem('token');

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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete request';
        setError(errorMessage);
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };



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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Document Requests</h1>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : documentRequests.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No document requests found.</p>
          </div>
        ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Property
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
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
                        onChange={(e) => handleStatusUpdate(
                          request.id,
                          e.target.value as 'pending' | 'sent' | 'completed'
                        )}
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
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                variant="minimal"
                size="md"
                showPageInfo={true}
                className="mb-8"
              />
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
