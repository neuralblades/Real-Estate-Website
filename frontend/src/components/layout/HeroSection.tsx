"use client";

import Link from 'next/link';

const HeroSection = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-2">
                  Location
                </label>
                <select
                  id="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Location</option>
                  <option value="new-york">New York</option>
                  <option value="los-angeles">Los Angeles</option>
                  <option value="miami">Miami</option>
                  <option value="chicago">Chicago</option>
                </select>
              </div>

              <div>
                <label htmlFor="property-type" className="block text-gray-700 text-sm font-medium mb-2">
                  Property Type
                </label>
                <select
                  id="property-type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label htmlFor="price-range" className="block text-gray-700 text-sm font-medium mb-2">
                  Price Range
                </label>
                <select
                  id="price-range"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Price</option>
                  <option value="0-500000">$0 - $500,000</option>
                  <option value="500000-1000000">$500,000 - $1,000,000</option>
                  <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
                  <option value="2000000+">$2,000,000+</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/properties" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-300 inline-block text-center">
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
