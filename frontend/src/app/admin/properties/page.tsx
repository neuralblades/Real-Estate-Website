'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getProperties, deleteProperty } from '@/services/propertyService';
import Button from '@/components/ui/Button';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '@/components/ui/Pagination';
import { ITEMS_PER_PAGE } from '@/config/constants';
import OptimizedImage from '@/components/ui/OptimizedImage';
import useDataFetching from '@/hooks/useDataFetching';

// Define Property interface to avoid using 'any'
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  mainImage?: string;
  propertyType: string;
  status: string;
  featured: boolean;
  isOffplan?: boolean;
  createdAt: string;
}

export default function AdminPropertiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Create a cache key based on filters
  const cacheKey = useMemo(() => {
    return `properties-${currentPage}-${searchTerm}-${filterType}-${filterStatus}`;
  }, [currentPage, searchTerm, filterType, filterStatus]);

  // Create a fetch function
  const fetchPropertiesFunction = useCallback(async () => {
    const response = await getProperties({
      page: currentPage,
      keyword: searchTerm,
      type: filterType,
      status: filterStatus,
    });

    if (response.success) {
      setTotalItems(response.total || 0);
      return {
        properties: response.properties,
        pages: response.pages,
        page: response.page,
        total: response.total
      };
    } else {
      throw new Error('Failed to fetch properties');
    }
  }, [currentPage, searchTerm, filterType, filterStatus]);

  // Use our custom hook for data fetching with caching
  const { data, loading, error, refetch } = useDataFetching(
    fetchPropertiesFunction,
    cacheKey,
    { cacheTime: 2 * 60 * 1000 } // 2 minutes cache
  );

  // Extract properties and pagination info from data
  const properties = data?.properties || [];
  const totalPages = data?.pages || 1;

  // Handle page change with smooth scrolling
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  }, [totalPages]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleDeleteClick = useCallback((property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);

    try {
      const response = await deleteProperty(propertyToDelete.id);

      if (response.success) {
        // Close the modal first
        setShowDeleteModal(false);
        // Then refetch the data to update the list
        await refetch();
      } else {
        // Show the specific error message from the server if available
        const errorMessage = response.message || 'Failed to delete property';

        // Show a more user-friendly message in the UI
        if (errorMessage.includes('related')) {
          // The backend already provides a user-friendly message for constraint errors
          console.error(errorMessage);
        } else if (errorMessage.includes('foreign key constraint')) {
          console.error('This property cannot be deleted because it has related records. Please contact the administrator.');
        }

        setShowDeleteModal(false); // Close the modal to show the error message
      }
    } catch (error: any) {
      console.error('Error deleting property:', error);
      setShowDeleteModal(false); // Close the modal to show the error message
    } finally {
      setIsDeleting(false);
    }
  }, [propertyToDelete, refetch]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with Add Property Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Properties Management</h1>
          <div className="flex space-x-4">
            <Button
              href="/admin/properties/add-offplan"
              variant="accent"
              gradient={true}
              className="flex items-center"
            >
              <FaPlus className="mr-2" /> Add Offplan Property
            </Button>
            <Button
              href="/admin/properties/add"
              variant="primary"
              gradient={true}
              className="flex items-center"
            >
              <FaPlus className="mr-2" /> Add Regular Property
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Property Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No properties found.</p>
            <Button href="/admin/properties/add" variant="primary" size="sm">
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Property
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Featured
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date Added
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 relative">
                          <OptimizedImage
                            src={property.mainImage || ''}
                            alt={property.title}
                            fill
                            sizes="40px"
                            className="object-cover rounded-md"
                            placeholder="blur"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">AED {property.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.propertyType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'for-sale' ? 'bg-teal-100 text-teal-800' :
                        property.status === 'for-rent' ? 'bg-blue-100 text-blue-800' :
                        property.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {property.isOffplan ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          Off Plan
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {property.featured ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {property.isOffplan ? (
                          <Link
                            href={`/admin/properties/edit-offplan/${property.id}`}
                            className="text-teal-600 hover:text-teal-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/properties/edit/${property.id}`}
                            className="text-teal-600 hover:text-teal-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteClick(property)}
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
        )}
      </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="buttons"
              size="md"
              showPageInfo={true}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              className="mb-8"
            />
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the property &quot;{propertyToDelete?.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="primary"
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
