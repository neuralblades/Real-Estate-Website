"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { getFeaturedProperties, Property } from '@/services/propertyService';

// Fallback data for featured properties
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
];

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>(fallbackProperties as unknown as Property[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await getFeaturedProperties();
        if (response.success && response.properties.length > 0) {
          setProperties(response.properties);
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties in the most sought-after locations.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mb-8">{error}</div>
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
            href="/properties"
            className="inline-block px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-900 text-white hover:from-gray-900 hover:to-gray-500 transition duration-300 font-medium rounded-md"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
