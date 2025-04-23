"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getFullImageUrl, handleImageError } from '@/utils/imageUtils';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  featured?: boolean;
  isOffplan?: boolean;
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  featured = false,
  isOffplan = false,
}: PropertyCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl ${featured ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'}`}>
      <Link href={isOffplan ? `/properties/offplan/${id}` : `/properties/${id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={getFullImageUrl(imageUrl)}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            onError={handleImageError}
          />
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {featured && (
              <div className="bg-gradient-to-r from-gray-500 to-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
            {isOffplan && (
              <div className="bg-gradient-to-r from-gray-500 to-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Off Plan
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={isOffplan ? `/properties/offplan/${id}` : `/properties/${id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-[#a49650] transition duration-300">{title}</h3>
        </Link>

        <p className="text-gray-600 mb-2 flex items-center">
          <svg className="h-5 w-5 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        <p className="text-2xl font-bold text-[#a49650] mb-4">AED {price.toLocaleString()}</p>

        <div className="flex justify-between text-gray-600 border-t pt-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>

          <div className="flex items-center">
            <svg className="h-5 w-5 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>

          <div className="flex items-center">
            <svg className="h-5 w-5 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            <span>{area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
