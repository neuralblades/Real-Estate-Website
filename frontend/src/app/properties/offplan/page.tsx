"use client";
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import SearchInput from '@/components/search/SearchInput';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import { getProperties, PropertyFilter, Property } from '@/services/propertyService';

export default function OffPlanPropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<PropertyFilter>({
    isOffplan: true,
    page: 1,
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    location: searchParams.get('location') || '',
    keyword: searchParams.get('keyword') || '',
  });

  // Fetch properties with current filters
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await getProperties(filters);
      if (response.success && response.properties.length > 0) {
        setProperties(response.properties);
        setTotalPages(response.pages);
        setCurrentPage(response.page);
      } else {
        setProperties([]);
        setError('No off-plan properties found matching your criteria.');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters({ ...filters, ...newFilters, page: 1, isOffplan: true });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page, isOffplan: true });
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 1, isOffplan: true });
  };

  // Apply filters and fetch properties
  const applyFilters = () => {
    fetchProperties();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex text-gray-600 text-sm">
          <Link href="/" className="hover:text-blue-600 transition duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-blue-600 transition duration-300">Properties</Link>
          <span className="mx-2">/</span>
        </nav>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Off Plan Properties</h1>
        <p className="text-gray-600 mb-4">
        Discover our exclusive collection of off-plan properties in Dubai. Invest in the future with these upcoming developments offering modern designs and premium amenities.
        </p>
        <div className="flex space-x-4">
          <Button
            href="/properties"
            variant="outline"
            size="lg"
          >
            Ready Properties
          </Button>
          <Button
            href="/properties/offplan"
            variant="accent"
            size="lg"
          >
            Off Plan Properties
          </Button>
        </div>
      </div>
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col space-y-2">
            <div className="w-full">
              <SearchInput
                placeholder="Search by location, project name, or keyword..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            <AdvancedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
            />
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mb-8">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-600 mb-8">No off-plan properties found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                imageUrl={property.mainImage}
                featured={property.featured}
                isOffplan={true}
                agent={property.agent}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md mr-2 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md mx-1 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ml-2 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
    </div>
  );
}
