'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getFullImageUrl } from '@/utils/imageUtils';

interface DeveloperCardProps {
  id: string;
  name: string;
  logo?: string;
  slug: string;
  featured?: boolean;
}

const DeveloperCard = ({
  id,
  name,
  logo,
  slug,
  featured = false,
}: DeveloperCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl ${featured ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'}`}>
      <Link href={`/developers/${slug}`}>
        <div className="relative h-48 w-full">
          {logo ? (
            <Image
              src={getFullImageUrl(logo)}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-2xl font-bold text-gray-400">{name.charAt(0)}</span>
            </div>
          )}
          {featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
          <div className="flex justify-between items-center mt-4">
            <span className="text-blue-600 font-medium">View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DeveloperCard;
