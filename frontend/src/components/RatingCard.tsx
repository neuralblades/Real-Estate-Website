'use client';

import React from 'react';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar, FaDirections } from 'react-icons/fa';

interface RatingCardProps {
  companyName: string;
  address: string;
  rating: number;
  reviewCount: number;
  mapUrl?: string;
  className?: string;
}

const RatingCard: React.FC<RatingCardProps> = ({
  companyName,
  address,
  rating,
  reviewCount,
  mapUrl = "https://maps.app.goo.gl/UHzGvVcsndKg5afE9",
  className = "",
}) => {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-[#a49650]" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#a49650]" />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-[#a49650]" />);
    }

    return stars;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{companyName}</h3>
        <p className="text-sm text-gray-600 mb-3">{address}</p>

        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900 mr-2">{rating.toFixed(1)}</span>
          <div className="flex items-center">
            {renderStars()}
          </div>
          <span className="text-sm text-gray-600 ml-2">{reviewCount} reviews</span>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <Link
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium"
          >
            <FaDirections className="mr-2 text-teal-700" size={16} />
            <span>Directions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
