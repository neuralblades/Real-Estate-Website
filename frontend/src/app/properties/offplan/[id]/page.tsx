'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Auth context not needed for this component
import { getPropertyById, Property as BaseProperty } from '@/services/propertyService';

// Extended Property interface with headerImage, completionDate, and paymentPlan
interface Property extends BaseProperty {
  headerImage?: string;
  completionDate?: string;
  paymentPlan?: string;
}
import { getDeveloperById, Developer } from '@/services/developerService';
import { getFullImageUrl } from '@/utils/imageUtils';
import { Dialog, Transition } from '@headlessui/react';
import MapComponent from '@/components/Map';
import * as Tabs from '@headlessui/react';
import ContactFormPopup from '@/components/ContactFormPopup';

// Client component wrapper
function OffplanPropertyDetailClient({ propertyId }: { propertyId: string }) {
  // No auth needed for this component
  const [property, setProperty] = useState<Property | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Photo gallery modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Contact form popup states
  const [isContactFormOpen, setIsContactFormOpen] = useState<boolean>(false);
  const [contactFormType, setContactFormType] = useState<'brochure' | 'floorplan'>('brochure');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        // Validate ID before making the request
        if (!propertyId) {
          setError('Invalid property ID');
          setLoading(false);
          return;
        }

        // Fetch property data
        const response = await getPropertyById(propertyId);
        if (response.success && response.property) {
          const propertyData = response.property;

          // Check if it's an offplan property
          if (!propertyData.isOffplan) {
            setError('This is not an offplan property');
            setLoading(false);
            return;
          }

          setProperty(propertyData);

          // Fetch developer data if available
          if (propertyData.developer && propertyData.developer.id) {
            try {
              const devResponse = await getDeveloperById(propertyData.developer.id);
              if (devResponse.success && devResponse.developer) {
                setDeveloper(devResponse.developer);
              }
            } catch (err) {
              console.error('Error fetching developer details:', err);
            }
          }
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The property you are looking for does not exist or has been removed.'}</p>
        <Link href="/properties/offplan" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
          Browse All Offplan Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Full Width Header Image with Modern Design */}
      <div className="relative h-[90vh] w-full">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 transform transition-transform duration-1000 ease-out">
          <Image
            src={property.headerImage ? getFullImageUrl(property.headerImage) :
                 (property.images && property.images.length > 0 ? getFullImageUrl(property.images[0]) : '/images/default-property.jpg')}
            alt={property.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90"></div>
        </div>

        {/* Breadcrumbs with Frosted Glass Effect */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="container mx-auto">
            <nav className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm">
              <Link href="/" className="hover:text-blue-300 transition duration-300">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/properties/offplan" className="hover:text-blue-300 transition duration-300">Off Plan</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-blue-200">{property.title}</span>
            </nav>
          </div>
        </div>

        {/* Content with Modern Layout */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-24 relative z-10 text-white">
            <div className="max-w-5xl">
              {/* Property Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-full uppercase tracking-wider shadow-lg">
                  {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-medium rounded-full uppercase tracking-wider shadow-lg">
                  Offplan
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-400 to-blue-300 text-white text-sm font-medium rounded-full uppercase tracking-wider shadow-lg">
                  {property.propertyType}
                </span>
              </div>

              {/* Property Title with Animation */}
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{property.title}</h1>

              {/* Location with Icon */}
              <div className="flex items-center text-white/90 mb-6">
                <svg className="h-6 w-6 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xl">{property.location}</p>
              </div>

              {/* Developer Info with Modern Design */}
              {developer && (
                <div className="mb-10 flex items-center">
                  {developer.logo ? (
                    <div className="relative h-12 w-12 mr-4 rounded-full overflow-hidden border-2 border-blue-300 shadow-lg">
                      <Image
                        src={getFullImageUrl(developer.logo)}
                        alt={developer.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 mr-4 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {developer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-300 text-sm">Developed by</span>
                    <h3 className="text-2xl font-semibold">{developer.name}</h3>
                  </div>
                </div>
              )}

              {/* Property Highlights */}
              <div className="flex flex-wrap gap-8 mb-10 text-white">
                <div className="flex items-center">
                  <div className="bg-white/10 p-3 rounded-full mr-3">
                    <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">Bedrooms</span>
                    <p className="text-xl font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/10 p-3 rounded-full mr-3">
                    <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">Bathrooms</span>
                    <p className="text-xl font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/10 p-3 rounded-full mr-3">
                    <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">Area</span>
                    <p className="text-xl font-semibold">{property.area} sq ft</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons with Modern Design */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setIsGalleryOpen(true);
                    setCurrentPhotoIndex(0);
                  }}
                  className="px-8 py-4 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Gallery
                </button>
                <a
                  href="#inquiry-form"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-lg flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Register Interest
                </a>
                <button
                  onClick={() => {
                    setContactFormType('brochure');
                    setIsContactFormOpen(true);
                  }}
                  className="px-8 py-4 border border-white/50 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition duration-300 shadow-lg flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Header - Key Information */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="flex flex-col p-8 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-sm uppercase text-gray-500 mb-2 tracking-wider font-medium">STARTING PRICE</h3>
              <p className="text-4xl font-bold text-blue-900">AED {property.price.toLocaleString()}</p>
            </div>
            <div className="flex flex-col p-8 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-sm uppercase text-gray-500 mb-2 tracking-wider font-medium">HANDOVER</h3>
              <p className="text-4xl font-semibold text-blue-900">{property.yearBuilt}</p>
            </div>
            <div className="flex flex-col p-8 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-sm uppercase text-gray-500 mb-2 tracking-wider font-medium">PAYMENT PLAN</h3>
              <p className="text-4xl font-semibold text-blue-900">{property.paymentPlan || '70/30'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Project Details */}
          <div className="w-full lg:w-2/3">
            {/* Developer Info */}
            {developer && (
              <div className="flex items-center mb-8">
                {developer.logo && (
                  <div className="relative h-16 w-16 mr-4 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={getFullImageUrl(developer.logo)}
                      alt={developer.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Developed by</p>
                  <h3 className="text-xl font-semibold">{developer.name}</h3>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <Tabs.Tab.Group>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <Tabs.Tab.List className="flex overflow-x-auto scrollbar-hide">
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Details
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Gallery
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Floor Plans
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Amenities
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Payment Plans
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                    `py-4 px-6 text-sm font-medium outline-none transition-all duration-200 ${selected ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`
                  }>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Brochure
                    </div>
                  </Tabs.Tab>
                </Tabs.Tab.List>
              </div>

              <Tabs.Tab.Panels>
                {/* Details Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Project</h2>

                      {/* Property Description */}
                      <div className="prose max-w-none text-gray-700 mb-10 leading-relaxed">
                        {property.description}
                      </div>

                      {/* Property Specs */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-blue-50 rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Property Type</h3>
                          </div>
                          <p className="text-lg font-medium text-blue-900 capitalize">{property.propertyType}</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Bedrooms</h3>
                          </div>
                          <p className="text-lg font-medium text-blue-900">{property.bedrooms}</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Bathrooms</h3>
                          </div>
                          <p className="text-lg font-medium text-blue-900">{property.bathrooms}</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6 transform transition-transform duration-300 hover:scale-105">
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Area</h3>
                          </div>
                          <p className="text-lg font-medium text-blue-900">{property.area} sq ft</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {property.features && property.features.map((feature, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Gallery Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Property Gallery</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {property.images && property.images.map((image, index) => (
                          <div
                            key={index}
                            className="group relative h-64 cursor-pointer rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                            onClick={() => {
                              setIsGalleryOpen(true);
                              setCurrentPhotoIndex(index);
                            }}
                          >
                            <Image
                              src={getFullImageUrl(image)}
                              alt={`Property Image ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="p-4 w-full">
                                <span className="text-white font-medium">View Image {index + 1}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setIsGalleryOpen(true)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-flex items-center"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          View Full Gallery
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Floor Plans Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Floor Plans</h2>
                      <div className="bg-blue-50 rounded-xl p-8 text-center">
                        <div className="mb-6">
                          <svg className="h-16 w-16 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <h3 className="text-xl font-semibold text-blue-900 mb-2">Floor Plans Available Upon Request</h3>
                          <p className="text-gray-700 max-w-2xl mx-auto">Detailed floor plans for this property are available. Please contact our sales team or fill out the inquiry form to receive the complete floor plans package.</p>
                        </div>
                        <button
                          onClick={() => {
                            setContactFormType('floorplan');
                            setIsContactFormOpen(true);
                          }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-flex items-center"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Request Floor Plans
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Amenities Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {property.features && property.features.map((feature, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-3 rounded-full mr-3">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800">{feature}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Location Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
                      <div className="rounded-xl overflow-hidden mb-6">
                        <MapComponent
                          address={property.address || ''}
                          location={property.location || ''}
                          height="400px"
                          zoom={14}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-xl font-semibold mb-4">Property Address</h3>
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-700">{property.address}</p>
                              <p className="text-gray-700">{property.city}, {property.state} {property.zipCode}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-xl font-semibold mb-4">Neighborhood</h3>
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-700">{property.location}</p>
                              <p className="text-sm text-gray-500 mt-1">A prime location with excellent connectivity and amenities.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Payment Plans Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Payment Plans</h2>

                      <div className="bg-blue-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">{property.paymentPlan || '70/30'} Payment Plan</h3>
                        </div>

                        <div className="mt-6">
                          {property.paymentPlan === '60/40' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">During Construction (60%)</h4>
                                <ul className="space-y-3">
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">1</span>
                                    </div>
                                    <span>10% on booking</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">2</span>
                                    </div>
                                    <span>10% after 30 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">3</span>
                                    </div>
                                    <span>10% after 60 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">4</span>
                                    </div>
                                    <span>10% after 90 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">5</span>
                                    </div>
                                    <span>10% after 120 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">6</span>
                                    </div>
                                    <span>10% after 150 days</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">On Completion (40%)</h4>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-900 mb-2">40%</div>
                                    <p className="text-blue-800">Final payment upon handover</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : property.paymentPlan === '50/50' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">During Construction (50%)</h4>
                                <ul className="space-y-3">
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">1</span>
                                    </div>
                                    <span>10% on booking</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">2</span>
                                    </div>
                                    <span>10% after 30 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">3</span>
                                    </div>
                                    <span>10% after 60 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">4</span>
                                    </div>
                                    <span>10% after 90 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">5</span>
                                    </div>
                                    <span>10% after 120 days</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">On Completion (50%)</h4>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-900 mb-2">50%</div>
                                    <p className="text-blue-800">Final payment upon handover</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">During Construction (70%)</h4>
                                <ul className="space-y-3">
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">1</span>
                                    </div>
                                    <span>10% on booking</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">2</span>
                                    </div>
                                    <span>10% after 30 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">3</span>
                                    </div>
                                    <span>10% after 60 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">4</span>
                                    </div>
                                    <span>10% after 90 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">5</span>
                                    </div>
                                    <span>10% after 120 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">6</span>
                                    </div>
                                    <span>10% after 150 days</span>
                                  </li>
                                  <li className="flex items-center">
                                    <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-800 text-sm font-medium">7</span>
                                    </div>
                                    <span>10% after 180 days</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-blue-800">On Completion (30%)</h4>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-900 mb-2">30%</div>
                                    <p className="text-blue-800">Final payment upon handover</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold">Payment Plan Information</h3>
                        </div>
                        <p className="text-gray-700 ml-10">For more details about our payment plans or to discuss custom payment options, please contact our sales team.</p>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Brochure Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Brochure</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                          <div className="bg-blue-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center mb-4">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold">Complete Project Information</h3>
                            </div>
                            <p className="text-gray-700 ml-10">Our detailed brochure includes floor plans, payment schedules, amenities list, and more information about this exclusive development.</p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Request Your Copy</h3>
                            <p className="text-gray-700 mb-6">Fill out the form to receive the complete brochure for {property.title} directly to your email.</p>
                            <button
                              onClick={() => {
                                setContactFormType('brochure');
                                setIsContactFormOpen(true);
                              }}
                              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                            >
                              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download Brochure
                            </button>
                          </div>
                        </div>

                        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={property.headerImage ? getFullImageUrl(property.headerImage) :
                                (property.images && property.images.length > 0 ? getFullImageUrl(property.images[0]) : '/images/default-property.jpg')}
                            alt="Brochure Cover"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <div className="p-6 text-white">
                              <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                              <p className="text-sm opacity-90">{property.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Tab.Panel>
              </Tabs.Tab.Panels>
            </Tabs.Tab.Group>
          </div>

          {/* Right Column - Contact Information */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Interested in this property?</h3>
                <p className="text-gray-600">Contact us for more information</p>
              </div>

              {/* Agent Information */}
              {property.agent && (
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-gray-200">
                      <Image
                        src={property.agent.avatar ? getFullImageUrl(property.agent.avatar) : '/images/default-avatar.jpg'}
                        alt={`${property.agent.firstName} ${property.agent.lastName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.agent.firstName} {property.agent.lastName}</h4>
                      <p className="text-sm text-gray-600">Property Consultant</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <a href={`tel:${property.agent.phone}`} className="flex items-center text-gray-700 hover:text-blue-600">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      {property.agent.phone}
                    </a>
                    <a href={`mailto:${property.agent.email}`} className="flex items-center text-gray-700 hover:text-blue-600">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {property.agent.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div id="inquiry-form" className="p-6 scroll-mt-24">
                <h4 className="font-semibold text-gray-900 mb-4">Request Information</h4>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <Transition show={isGalleryOpen} as="div">
        <Dialog
          open={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          className="relative z-50"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden transition-all">
                {/* Close button */}
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Main Image */}
                <div className="relative h-[80vh] w-full">
                  {property.images && property.images.length > 0 && (
                    <Image
                      src={getFullImageUrl(property.images[currentPhotoIndex])}
                      alt={`Property Image ${currentPhotoIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                      unoptimized
                    />
                  )}

                  {/* Navigation Buttons - Positioned on sides */}
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-300"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-300"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Image Counter and Thumbnails */}
                <div className="bg-black/80 text-white p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-bold">
                      {property.title}
                    </Dialog.Title>
                    <span className="text-sm bg-black/50 px-3 py-1 rounded-full">
                      {currentPhotoIndex + 1} / {property.images.length}
                    </span>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-black/20">
                    {property.images && property.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 ${index === currentPhotoIndex ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <Image
                          src={getFullImageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Contact Form Popup */}
      <ContactFormPopup
        isOpen={isContactFormOpen}
        closeModal={() => setIsContactFormOpen(false)}
        title={contactFormType === 'brochure' ? 'Download the Brochure' : 'Request Floor Plans'}
        propertyTitle={property.title}
        propertyId={propertyId}
        requestType={contactFormType}
      />
    </div>
  );
}

// Server component that passes the ID to the client component
export default function OffplanPropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Properly unwrap params using React.use()
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  return <OffplanPropertyDetailClient propertyId={propertyId} />;
}
