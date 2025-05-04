'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllInquiries, updateInquiryStatus } from '@/services/inquiryService';
import Pagination from '@/components/ui/Pagination';
import { ITEMS_PER_PAGE } from '@/config/constants';
import Button from '@/components/ui/Button';
import { FaSearch, FaEye, FaTimes } from 'react-icons/fa';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredInquiries, setFilteredInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await getAllInquiries();
      if (response.success) {
        setInquiries(response.inquiries);
        setFilteredInquiries(response.inquiries);
      } else {
        setError('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError('An error occurred while fetching inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    let filtered = [...inquiries];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    // Apply search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        inquiry =>
          inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inquiry.property?.title && inquiry.property.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredInquiries(filtered);

    // Calculate total pages based on filtered inquiries
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, inquiries]);

  // Get paginated inquiries
  const getPaginatedInquiries = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredInquiries.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await updateInquiryStatus(inquiryId, newStatus);
      if (response.success) {
        // Update inquiry in the list
        const updatedInquiries = inquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        );
        setInquiries(updatedInquiries);

        // Also update the selected inquiry if it's the one being changed
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      } else {
        setError('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      setError('An error occurred while updating inquiry status');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inquiries Management</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inquiries..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Inquiry
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Property
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedInquiries().map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.property ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 relative">
                            {inquiry.property.mainImage ? (
                              <Image
                                src={inquiry.property.mainImage}
                                alt={inquiry.property.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 40px"
                                className="object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-900">{inquiry.property.title}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Property not found</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status || 'new'}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          inquiry.status === 'new' ? 'bg-teal-100 border-teal-300 text-teal-800' :
                          inquiry.status === 'in-progress' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                          'bg-emerald-100 border-emerald-300 text-emerald-800'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-teal-600 hover:text-teal-800"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="minimal"
              size="md"
              showPageInfo={true}
              totalItems={filteredInquiries.length}
              itemsPerPage={ITEMS_PER_PAGE}
              className="mb-8"
            />
          </div>
        )}

      {/* Inquiry Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Inquiry Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inquiry Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Inquiry Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <select
                      value={selectedInquiry.status || 'new'}
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                      className={`mt-1 text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        selectedInquiry.status === 'new' ? 'bg-teal-100 border-teal-300 text-teal-800' :
                        selectedInquiry.status === 'in-progress' ? 'bg-amber-100 border-amber-300 text-amber-800' :
                        'bg-emerald-100 border-emerald-300 text-emerald-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.phone || '-'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Property Information</h4>
                {selectedInquiry.property ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-4 relative h-40 w-full">
                      {selectedInquiry.property.mainImage ? (
                        <Image
                          src={selectedInquiry.property.mainImage}
                          alt={selectedInquiry.property.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Title</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.property.title}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="mt-1 text-sm text-gray-900">
                        AED {selectedInquiry.property.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.property.location}</p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/properties/${selectedInquiry.property.id}`}
                        className="text-sm text-teal-600 hover:text-teal-800"
                        target="_blank"
                      >
                        View Property
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Property not found</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
