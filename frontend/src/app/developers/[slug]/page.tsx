'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getDeveloperBySlug, getDeveloperPropertiesBySlug } from '@/services/developerService';
import PropertyCard from '@/components/properties/PropertyCard';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { getFullImageUrl } from '@/utils/imageUtils';

export default function DeveloperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [developer, setDeveloper] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        setLoading(true);
        const response = await getDeveloperPropertiesBySlug(resolvedParams.slug, currentPage);
        setDeveloper(response.developer);
        setProperties(response.properties);
        setTotalPages(response.pages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching developer data:', err);
        setError('Failed to load developer information. Please try again later.');
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, [resolvedParams.slug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!developer) return <ErrorDisplay message="Developer not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {developer.logo && (
            <div className="relative w-48 h-48 flex-shrink-0">
              <Image
                src={getFullImageUrl(developer.logo)}
                alt={developer.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{developer.name}</h1>
            {developer.description && (
              <p className="text-gray-600 mb-4">{developer.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {developer.established && (
                <div>
                  <span className="font-semibold text-gray-700">Established:</span> {developer.established}
                </div>
              )}
              {developer.headquarters && (
                <div>
                  <span className="font-semibold text-gray-700">Headquarters:</span> {developer.headquarters}
                </div>
              )}
              {developer.website && (
                <div>
                  <span className="font-semibold text-gray-700">Website:</span>{' '}
                  <a
                    href={developer.website.startsWith('http') ? developer.website : `https://${developer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {developer.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Properties by {developer.name}</h2>

      {properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No properties found for this developer.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
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
                isOffplan={property.isOffplan}
                agent={property.agent}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
