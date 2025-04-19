"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/search/SearchInput';
import { PropertyFilter } from '@/services/propertyService';

const HeroSection = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<PropertyFilter>({
    location: '',
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'location':
        setFilters({ ...filters, location: value });
        break;
      case 'property-type':
        setFilters({ ...filters, type: value });
        break;
      case 'price-range':
        if (value === '') {
          setFilters({ ...filters, minPrice: undefined, maxPrice: undefined });
        } else {
          const [min, max] = value.split('-').map(Number);
          setFilters({ ...filters, minPrice: min, maxPrice: max });
        }
        break;
      default:
        break;
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters.location) queryParams.append('location', filters.location);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());

    // Navigate to properties page with filters
    router.push(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-white/5"></div>
        <div className="absolute top-0 right-0 w-full h-1/2 bg-white/5 transform -skew-y-6"></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Luxury Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover exclusive properties in the most desirable locations worldwide.
          </p>

          {/* Search Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
            <form onSubmit={handleSearch}>
              {/* Search Input with Autocomplete */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-gray-700 text-sm font-medium mb-2">
                  Search Properties
                </label>
                <SearchInput
                  placeholder="Enter location, property name, or keywords..."
                  className="text-gray-700 placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
                    Location
                  </label>
                  <select
                    id="location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Location</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Miami">Miami</option>
                    <option value="Chicago">Chicago</option>
                    <option value="San Francisco">San Francisco</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="property-type" className="block text-gray-700 text-sm font-medium mb-2">
                    Property Type
                  </label>
                  <select
                    id="property-type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={
                      filters.minPrice !== undefined && filters.maxPrice !== undefined
                        ? `${filters.minPrice}-${filters.maxPrice}`
                        : ''
                    }
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Price</option>
                    <option value="0-500000">$0 - $500,000</option>
                    <option value="500000-1000000">$500,000 - $1,000,000</option>
                    <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
                    <option value="2000000-10000000">$2,000,000+</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-300 inline-block text-center"
                >
                  Search Properties
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
