'use client';

import React, { useEffect, useState } from 'react';
import { getAllOffplanInquiries, updateOffplanInquiryStatus, OffplanInquiry } from '@/services/offplanInquiryService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getFullImageUrl } from '@/utils/imageUtils';

export default function OffplanInquiriesPage() {
  const [inquiries, setInquiries] = useState<OffplanInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredInquiries, setFilteredInquiries] = useState<OffplanInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<OffplanInquiry | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Fetch all offplan inquiries
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await getAllOffplanInquiries();
      if (response.success) {
        setInquiries(response.inquiries);
        setFilteredInquiries(response.inquiries);
      } else {
        setError('Failed to fetch offplan inquiries');
      }
    } catch (error) {
      console.error('Error fetching offplan inquiries:', error);
      setError('An error occurred while fetching offplan inquiries');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchInquiries();
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'new' | 'in-progress' | 'resolved') => {
    try {
      // First update the UI optimistically
      setInquiries(prevInquiries =>
        prevInquiries.map(inquiry =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );
      setFilteredInquiries(prevInquiries =>
        prevInquiries.map(inquiry =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );

      // Then try to update on the server
      const response = await updateOffplanInquiryStatus(id, status);

      if (!response.success) {
        // If server update fails, show error but keep the UI updated
        setError('Failed to update status on server, but changes saved locally');

        // Clear error after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An error occurred while updating status, but changes saved locally');

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filter inquiries based on search term and status filter
  useEffect(() => {
    // First filter by status and search term
    let filtered = [...inquiries];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        inquiry =>
          inquiry.name.toLowerCase().includes(term) ||
          inquiry.email.toLowerCase().includes(term) ||
          (inquiry.message && inquiry.message.toLowerCase().includes(term)) ||
          (inquiry.propertyTitle && inquiry.propertyTitle.toLowerCase().includes(term))
      );
    }

    // Then group by property to remove duplicates
    const propertyGroups: Record<string, OffplanInquiry> = {};

    filtered.forEach(inquiry => {
      const propertyId = inquiry.propertyId;

      // If this property hasn't been seen yet, or if this inquiry has a property image and the existing one doesn't
      if (!propertyGroups[propertyId] ||
          (inquiry.property?.mainImage && !propertyGroups[propertyId].property?.mainImage)) {
        propertyGroups[propertyId] = inquiry;
      }
    });

    // Convert back to array and sort by date (newest first)
    const uniqueFiltered = Object.values(propertyGroups).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredInquiries(uniqueFiltered);
  }, [inquiries, searchTerm, statusFilter]);

  // Initial data fetch
  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/auth/login?redirect=/admin/offplan-inquiries');
      return;
    }

    // Debug authentication
    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);
    console.log('Auth token:', localStorage.getItem('token'));

    fetchInquiries();
  }, [user, isAdmin, router]);

  // View inquiry details
  const viewInquiryDetails = (inquiry: OffplanInquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offplan Property Inquiries</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Debug function to directly check localStorage
                if (typeof window !== 'undefined') {
                  const rawData = localStorage.getItem('offplanInquiries');
                  console.log('Raw localStorage data:', rawData);
                  alert('Check console for localStorage data');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Debug
            </button>
            <button
              onClick={() => {
                // Clear all offplan inquiries from localStorage
                if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all offplan inquiries?')) {
                  localStorage.removeItem('offplanInquiries');
                  setInquiries([]);
                  setFilteredInquiries([]);
                  alert('All offplan inquiries have been cleared.');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, property..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 relative">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-800">{error}</span>
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p>No offplan inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Inquiry</th>
                  <th className="py-3 px-4 text-left">Property</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>{inquiry.name}</span>
                        <span className="text-gray-500 text-sm">{inquiry.email}</span>
                        <span className="text-gray-500 text-sm">{inquiry.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {inquiry.property?.mainImage ? (
                          <img
                            src={getFullImageUrl(inquiry.property.mainImage)}
                            alt={inquiry.propertyTitle || 'Property'}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                            onError={(e) => e.currentTarget.src = '/placeholder.png'}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-200 mr-3 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        <div className="max-w-xs truncate">{inquiry.propertyTitle || inquiry.propertyId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        value={inquiry.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as 'new' | 'in-progress' | 'resolved';
                          handleStatusUpdate(inquiry.id, newStatus);
                        }}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewInquiryDetails(inquiry)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Details Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Inquiry Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Inquiry Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Inquiry Information</h3>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedInquiry.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedInquiry.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedInquiry.status}
                    </span>
                    <select
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={selectedInquiry.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'new' | 'in-progress' | 'resolved';
                        // Update the selected inquiry status immediately for better UX
                        setSelectedInquiry(prev => prev ? {...prev, status: newStatus} : null);
                        // Then update in the database
                        handleStatusUpdate(selectedInquiry.id, newStatus);
                      }}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Name</h4>
                  <p className="mt-1">{selectedInquiry.name}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Email</h4>
                  <p className="mt-1">{selectedInquiry.email}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Phone</h4>
                  <p className="mt-1">{selectedInquiry.phone}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Date</h4>
                  <p className="mt-1">{formatDate(selectedInquiry.createdAt)}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Preferred Language</h4>
                  <p className="mt-1">{selectedInquiry.preferredLanguage}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Interested in Mortgage Advice</h4>
                  <p className="mt-1">{selectedInquiry.interestedInMortgage ? 'Yes' : 'No'}</p>
                </div>

                {selectedInquiry.message && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Message</h4>
                    <div className="mt-1 p-3 bg-white border border-gray-200 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Property Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Property Information</h3>

                {selectedInquiry.property ? (
                  <>
                    {selectedInquiry.property.mainImage && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={getFullImageUrl(selectedInquiry.property.mainImage)}
                          alt={selectedInquiry.property.title || 'Property'}
                          className="w-full h-48 object-cover"
                          onError={(e) => e.currentTarget.src = '/placeholder.png'}
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Title</h4>
                      <p className="mt-1 font-medium">{selectedInquiry.property.title}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Price</h4>
                      <p className="mt-1 text-lg font-bold">
                        ${selectedInquiry.property.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Location</h4>
                      <p className="mt-1">{selectedInquiry.property.location || 'N/A'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Property Type</h4>
                      <p className="mt-1">{selectedInquiry.property.propertyType || 'N/A'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Status</h4>
                      <p className="mt-1">{selectedInquiry.property.status || 'N/A'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Bedrooms</h4>
                      <p className="mt-1">{selectedInquiry.property.bedrooms || 'N/A'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Bathrooms</h4>
                      <p className="mt-1">{selectedInquiry.property.bathrooms || 'N/A'}</p>
                    </div>

                    <div className="mt-6">
                      <a
                        href={`/properties/offplan/${selectedInquiry.propertyId}`}
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Property
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-md bg-white">
                    <p className="text-gray-600">
                      {selectedInquiry.propertyTitle ? (
                        <>
                          <span className="font-medium">{selectedInquiry.propertyTitle}</span>
                          <br />
                          <span className="text-sm">(Property ID: {selectedInquiry.propertyId})</span>
                          <br /><br />
                          <span className="text-sm">Detailed property information not available.</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Property ID: {selectedInquiry.propertyId}</span>
                          <br /><br />
                          <span className="text-sm">Detailed property information not available.</span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
