"use client";

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
  { value: '0-500000', label: '$0 - $500,000' },
  { value: '500000-1000000', label: '$500,000 - $1,000,000' },
  { value: '1000000-2000000', label: '$1,000,000 - $2,000,000' },
  { value: '2000000-10000000', label: '$2,000,000+' },
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
      keyword: filters.keyword, // Preserve search keyword
    });
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <svg
            className={`ml-1 h-5 w-5 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onApplyFilters(); }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
              Location
            </label>
            <select
              id="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={filters.location || ''}
              onChange={handleFilterChange}
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label htmlFor="property-type" className="block text-gray-700 text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              id="property-type"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={filters.type || ''}
              onChange={handleFilterChange}
            >
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
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
              {priceRanges.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional filters that show when expanded */}
          {isExpanded && (
            <>
              {/* Bedrooms Filter */}
              <div>
                <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-medium mb-2">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={filters.bedrooms?.toString() || ''}
                  onChange={handleFilterChange}
                >
                  {bedroomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={filters.bathrooms?.toString() || ''}
                  onChange={handleFilterChange}
                >
                  {bathroomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={filters.status || ''}
                  onChange={handleFilterChange}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedFilters;
