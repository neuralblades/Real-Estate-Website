'use client';

import { useState, useEffect } from 'react';
import { getDevelopers } from '@/services/developerService';
import DeveloperCard from '@/components/developers/DeveloperCard';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const response = await getDevelopers();
        setDevelopers(response.developers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching developers:', err);
        setError('Failed to load developers. Please try again later.');
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Real Estate Developers"
        subtitle="Explore top real estate developers in Dubai & UAE"
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {developers.map((developer: any) => (
            <DeveloperCard
              key={developer.id}
              id={developer.id}
              name={developer.name}
              logo={developer.logo}
              slug={developer.slug}
              featured={developer.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
