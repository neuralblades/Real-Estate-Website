"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getFeaturedProperties, Property } from '@/services/propertyService';

type PropertyStatus = 'sale' | 'rent' | 'offplan';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<PropertyStatus>('sale');

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      try {
        const response = await getFeaturedProperties();
        console.log('Featured properties response:', response);
        if (response.success && response.properties && response.properties.length > 0) {
          // Filter properties based on the active filter
          let filteredProperties = [...(response.properties || [])];

          if (activeFilter === 'sale') {
            filteredProperties = filteredProperties.filter(p => p.status === 'for-sale' && !p.isOffplan);
          } else if (activeFilter === 'rent') {
            filteredProperties = filteredProperties.filter(p => p.status === 'for-rent');
          } else if (activeFilter === 'offplan') {
            filteredProperties = filteredProperties.filter(p => p.isOffplan === true);
          }

          // Sort properties by createdAt date (newest first) and take only the latest 3
          const latestProperties = filteredProperties
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);

          setProperties(latestProperties);
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, [activeFilter]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our handpicked selection of premium properties in the most sought-after locations.
          </p>

          <div className="flex justify-center gap-4 mb-8 max-w-md mx-auto">
            <button
              onClick={() => setActiveFilter('sale')}
              className={`px-6 py-2 rounded-md border ${activeFilter === 'sale'
                ? 'border-gray-900 bg-gradient-to-r from-gray-500 to-gray-900 text-white font-medium shadow-lg'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              For Sale
            </button>
            <button
              onClick={() => setActiveFilter('rent')}
              className={`px-6 py-2 rounded-md border ${activeFilter === 'rent'
                ? 'border-gray-900 bg-gradient-to-r from-gray-500 to-gray-900 text-white font-medium shadow-lg'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              For Rent
            </button>
            <button
              onClick={() => setActiveFilter('offplan')}
              className={`px-6 py-2 rounded-md border ${activeFilter === 'offplan'
                ? 'border-gray-900 bg-gradient-to-r from-gray-500 to-gray-900 text-white font-medium shadow-lg'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Off Plan
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
          </div>
        ) : error ? (
          <div className="text-center text-gray-800 mb-8 p-4 bg-gray-100 rounded-md">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-800 mb-8 p-4 bg-gray-100 rounded-md">
            No featured properties available at the moment.
          </div>
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
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href={activeFilter === 'offplan' ? '/properties/offplan' : `/properties?status=${activeFilter === 'sale' ? 'for-sale' : 'for-rent'}`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-900 text-white hover:from-gray-900 hover:to-gray-500 transition duration-300 font-medium shadow-lg rounded-md"
          >
            {activeFilter === 'sale' && 'View All Properties For Sale'}
            {activeFilter === 'rent' && 'View All Properties For Rent'}
            {activeFilter === 'offplan' && 'View All Off Plan Properties'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
