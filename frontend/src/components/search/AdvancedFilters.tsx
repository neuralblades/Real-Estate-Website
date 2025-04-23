"use client";
import Button from '@/components/ui/Button';
import React, { useState } from 'react';
import { PropertyFilter } from '@/services/propertyService';

interface AdvancedFiltersProps {
  filters: PropertyFilter;
  onFilterChange: (filters: PropertyFilter) => void;
  onApplyFilters: () => void;
  className?: string;
}

// Property type options
const propertyTypes = [
  { value: '', label: 'Any Type' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
];

// Status options
const statusOptions = [
  { value: '', label: 'Any Status' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
];

// Price range options
const priceRanges = [
  { value: '', label: 'Any Price' },
  { value: '0-500000', label: 'AED 0 - 500,000' },
  { value: '500000-1000000', label: 'AED 500,000 - 1,000,000' },
  { value: '1000000-2000000', label: 'AED 1,000,000 - 2,000,000' },
  { value: '2000000-10000000', label: 'AED 2,000,000+' },
];

// Bedroom options
const bedroomOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
];

// Bathroom options
const bathroomOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
];

// Location options (can be expanded or fetched from API)
const locationOptions = [
  { value: '', label: 'Any Location' },
  { value: 'New York', label: 'New York' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Miami', label: 'Miami' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'Seattle', label: 'Seattle' },
  { value: 'Boston', label: 'Boston' },
  { value: 'Dallas', label: 'Dallas' },
];

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'location':
        onFilterChange({ ...filters, location: value, page: 1 });
        break;
      case 'property-type':
        onFilterChange({ ...filters, type: value, page: 1 });
        break;
      case 'status':
        onFilterChange({ ...filters, status: value, page: 1 });
        break;
      case 'price-range':
        if (value === '') {
          onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined, page: 1 });
        } else {
          const [min, max] = value.split('-').map(Number);
          onFilterChange({ ...filters, minPrice: min, maxPrice: max, page: 1 });
        }
        break;
      case 'bedrooms':
        onFilterChange({ ...filters, bedrooms: value ? Number(value) : undefined, page: 1 });
        break;
      case 'bathrooms':
        onFilterChange({ ...filters, bathrooms: value ? Number(value) : undefined, page: 1 });
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    onFilterChange({
      page: 1,
      type: '',
      status: '',
      location: '',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      yearBuilt: undefined,
      keyword: filters.keyword, // Preserve search keyword
    });
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); onApplyFilters(); }}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Type Filter */}
          <div className="min-w-[150px]">
            <select
              id="property-type"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 appearance-none bg-white"
              value={filters.type || ''}
              onChange={handleFilterChange}
            >
              <option value="">Property Type</option>
              {propertyTypes.map((option) => (
                option.value && (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="min-w-[120px]">
            <select
              id="price-range"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 appearance-none bg-white"
              value={
                filters.minPrice !== undefined && filters.maxPrice !== undefined
                  ? `${filters.minPrice}-${filters.maxPrice}`
                  : ''
              }
              onChange={handleFilterChange}
            >
              <option value="">Price</option>
              {priceRanges.map((option) => (
                option.value && (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              ))}
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div className="min-w-[100px]">
            <select
              id="bedrooms"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 appearance-none bg-white"
              value={filters.bedrooms?.toString() || ''}
              onChange={handleFilterChange}
            >
              <option value="">Beds</option>
              {bedroomOptions.map((option) => (
                option.value && (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[100px]">
            <select
              id="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 appearance-none bg-white"
              value={filters.status || ''}
              onChange={handleFilterChange}
            >
              <option value="">Status</option>
              {statusOptions.map((option) => (
                option.value && (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              ))}
            </select>
          </div>

          {/* Filters Button */}
          <div className="min-w-[100px]">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-center"
            >
              <span>Filters</span>
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Search Button */}
          <div className="min-w-[100px]">
            <Button
              type="submit"
              variant="primary"
            >
              <span>Search</span>
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>

        </div>

        {/* Additional filters that show when expanded */}
        {isExpanded && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Location Filter */}
              <div>
                <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
                  Location
                </label>
                <select
                  id="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  value={filters.location || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Location</option>
                  {locationOptions.map((option) => (
                    option.value && (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  ))}
                </select>
              </div>

              {/* Bathrooms Filter */}
              <div>
                <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-medium mb-2">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  value={filters.bathrooms?.toString() || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  {bathroomOptions.map((option) => (
                    option.value && (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  ))}
                </select>
              </div>

              {/* Year Built Filter */}
              <div>
                <label htmlFor="year-built" className="block text-gray-700 text-sm font-medium mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  id="year-built"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  placeholder="e.g. 2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.yearBuilt || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    onFilterChange({ ...filters, yearBuilt: value, page: 1 });
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 mr-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedFilters;
