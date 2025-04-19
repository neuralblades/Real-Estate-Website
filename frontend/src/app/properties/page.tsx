"use client";

import { useState, useEffect, FormEvent } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import { getProperties, PropertyFilter } from '@/services/propertyService';

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
  const [properties, setProperties] = useState<any[]>(fallbackProperties);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter states
  const [filters, setFilters] = useState<PropertyFilter>({
    page: 1,
    type: '',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
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
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'location':
        setFilters({ ...filters, location: value, page: 1 });
        break;
      case 'property-type':
        setFilters({ ...filters, type: value, page: 1 });
        break;
      case 'price-range':
        if (value === '') {
          setFilters({ ...filters, minPrice: undefined, maxPrice: undefined, page: 1 });
        } else {
          const [min, max] = value.split('-').map(Number);
          setFilters({ ...filters, minPrice: min, maxPrice: max, page: 1 });
        }
        break;
      case 'bedrooms':
        setFilters({ ...filters, bedrooms: value ? Number(value) : undefined, page: 1 });
        break;
      default:
        break;
    }
  };

  // Apply filters
  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
    fetchProperties();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse Properties</h1>
        <p className="text-gray-600">
          Explore our collection of premium properties in the most desirable locations.
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={applyFilters} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
              Location
            </label>
            <select
              id="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">Any Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Miami">Miami</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          <div>
            <label htmlFor="property-type" className="block text-gray-700 text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              id="property-type"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Any Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="price-range" className="block text-gray-700 text-sm font-medium mb-2">
              Price Range
            </label>
            <select
              id="price-range"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFilterChange}
            >
              <option value="">Any Price</option>
              <option value="0-500000">$0 - $500,000</option>
              <option value="500000-1000000">$500,000 - $1,000,000</option>
              <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
              <option value="2000000-10000000">$2,000,000+</option>
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-medium mb-2">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.bedrooms || ''}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Apply Filters
          </button>
        </div>
      </form>

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
