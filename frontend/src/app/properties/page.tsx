"use client";
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/properties/PropertyCard';
import SearchInput from '@/components/search/SearchInput';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import Link from 'next/link';
import { getProperties, PropertyFilter, Property } from '@/services/propertyService';

// Fallback data for properties
const fallbackProperties = [
  {
    id: '1',
    title: 'Luxury Penthouse with Ocean View',
    price: 2500000,
    location: 'Miami Beach, FL',
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Modern Villa with Private Pool',
    price: 1800000,
    location: 'Beverly Hills, CA',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '3',
    title: 'Elegant Apartment in Downtown',
    price: 950000,
    location: 'New York, NY',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '4',
    title: 'Waterfront Home with Private Dock',
    price: 3200000,
    location: 'Naples, FL',
    bedrooms: 4,
    bathrooms: 3,
    area: 3600,
    mainImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Contemporary Townhouse',
    price: 780000,
    location: 'Seattle, WA',
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    mainImage: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Historic Brownstone',
    price: 1450000,
    location: 'Boston, MA',
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    mainImage: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>(fallbackProperties as unknown as Property[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter states
  const [filters, setFilters] = useState<PropertyFilter>({
    page: 1,
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minArea: searchParams.get('minArea') ? Number(searchParams.get('minArea')) : undefined,
    maxArea: searchParams.get('maxArea') ? Number(searchParams.get('maxArea')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    yearBuilt: searchParams.get('yearBuilt') ? Number(searchParams.get('yearBuilt')) : undefined,
    keyword: searchParams.get('keyword') || '',
    isOffplan: false, // Explicitly exclude offplan properties
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
        // If API returns empty, keep using fallback data
        console.log('No properties returned from API, using fallback data');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      // Keep using fallback data
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
    // Always maintain isOffplan: false to exclude offplan properties
    setFilters({ ...newFilters, isOffplan: false });
  };

  // Apply filters
  const applyFilters = () => {
    fetchProperties();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page, isOffplan: false });
    fetchProperties();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex text-gray-600 text-sm">
          <Link href="/" className="hover:text-[#a49650] transition duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-[#a49650] transition duration-300">Properties</Link>
          <span className="mx-2">/</span>
        </nav>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse Properties</h1>
        <p className="text-gray-600 mb-4">
          Explore our collection of premium properties in the most desirable locations.
        </p>
        <div className="flex space-x-4">
          <Button
            href="/properties"
            variant="accent"
            size="lg"
          >
            Ready Properties
          </Button>
          <Button
            href="/properties/offplan"
            variant="outline"
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
            placeholder="Area, project or community"
            initialValue={filters.keyword || ''}
            onSearch={(query) => setFilters({ ...filters, keyword: query, page: 1, isOffplan: false })}
            className="py-2 text-gray-700 placeholder-gray-500"
          />
        </div>
        <div className="w-full">
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            className=""
          />
        </div>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mb-8">{error}</div>
      ) : properties.length === 0 ? (
        <div className="text-center text-gray-600 mb-8">No properties found matching your criteria.</div>
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
              agent={property.agent}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first page, last page, current page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md ${currentPage === page ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === 2 && currentPage > 3) ||
                (page === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                // Show ellipsis
                return <span key={page} className="px-4 py-2 text-gray-700">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
