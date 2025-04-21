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
      {/* Hero Section - Full Width Header Image */}
      <div className="relative h-[80vh] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={property.headerImage ? getFullImageUrl(property.headerImage) :
                 (property.images && property.images.length > 0 ? getFullImageUrl(property.images[0]) : '/images/default-property.jpg')}
            alt={property.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600/50 via-gray-900/70 to-black/90"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-16 relative z-10 text-white">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{property.title}</h1>
              <p className="text-xl mb-8">{property.location}</p>

              {developer && (
                <div className="mb-6 flex items-center mb-20">
                  <span className="text-xl">by</span>
                  <span className="text-2xl font-semibold ml-2">{developer.name}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setIsGalleryOpen(true);
                    setCurrentPhotoIndex(0);
                  }}
                  className="px-8 py-4 bg-white text-blue-900 font-medium rounded-md hover:bg-gray-100 transition duration-300"
                >
                  View Gallery
                </button>
                <a
                  href="#inquiry-form"
                  className="px-8 py-4 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition duration-300"
                >
                  Register Interest
                </a>
                <a
                  href="#inquiry-form"
                  className="px-8 py-4 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition duration-300"
                >
                  Download Brochure
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="container mx-auto">
            <nav className="flex text-white text-sm">
              <Link href="/" className="hover:text-gray-300 transition duration-300">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/properties/offplan" className="hover:text-gray-300 transition duration-300">Off Plan</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-300">{property.title}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Project Header */}
      <div className="container mx-auto px-4 py-8">
        <div >
          {/* Left Column - Project Details */}
          <div className="width-full">
            <div className="mb-8">
              {/* Project Overview */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-sm uppercase text-gray-500 mb-1">STARTING PRICE</h3>
                    <p className="text-4xl font-bold text-blue-900">AED {property.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm uppercase text-gray-500 mb-1">HANDOVER</h3>
                    <p className="text-4xl font-semibold">{property.yearBuilt}</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm uppercase text-gray-500 mb-1">PAYMENT PLAN</h3>
                    <p className="text-4xl font-semibold">{property.paymentPlan || '70/30'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs.Tab.Group>
              <Tabs.Tab.List className="flex space-x-1 border-b border-gray-200 mb-8">
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Details
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Gallery
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Floor Plans
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Amenities
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Location
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Payment Plans
                </Tabs.Tab>
                <Tabs.Tab className={({ selected }: { selected: boolean }) =>
                  `py-3 px-5 text-sm font-medium outline-none ${selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`
                }>
                  Brochure
                </Tabs.Tab>
              </Tabs.Tab.List>

              <Tabs.Tab.Panels>
                {/* Details Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="font-medium text-gray-900 capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <span className="font-medium text-gray-900">{property.bedrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <span className="font-medium text-gray-900">{property.bathrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                        <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="text-sm text-gray-500">Area</span>
                        <span className="font-medium text-gray-900">{property.area} sq ft</span>
                      </div>
                    </div>

                    <div
                      className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap"
                      style={{
                        display: 'block',
                        lineHeight: '1.6',
                      }}
                    >
                      {property.description}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {property.features && property.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tabs.Tab.Panel>

                {/* Gallery Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.images && property.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-48 cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => {
                            setIsGalleryOpen(true);
                            setCurrentPhotoIndex(index);
                          }}
                        >
                          <Image
                            src={getFullImageUrl(image)}
                            alt={`Property Image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Floor Plans Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Floor Plans</h2>
                    <p className="text-gray-600 mb-4">Contact us for detailed floor plans of this property.</p>
                  </div>
                </Tabs.Tab.Panel>

                {/* Amenities Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {property.features && property.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700 p-2">
                          <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tabs.Tab.Panel>

                {/* Location Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                    <MapComponent
                      address={property.address || ''}
                      location={property.location || ''}
                      height="400px"
                      zoom={14}
                    />
                    <div className="mt-4 text-gray-700">
                      {property.address && (
                        <p className="mb-1"><strong>Address:</strong> {property.address}</p>
                      )}
                      {property.location && (
                        <p><strong>Neighborhood:</strong> {property.location}</p>
                      )}
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Payment Plans Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Plans</h2>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{property.paymentPlan || '70/30'} Payment Plan</h3>
                      {property.paymentPlan === '60/40' ? (
                        <ul className="list-disc pl-5 space-y-2">
                          <li>10% on booking</li>
                          <li>10% after 30 days</li>
                          <li>10% after 60 days</li>
                          <li>10% after 90 days</li>
                          <li>10% after 120 days</li>
                          <li>10% after 150 days</li>
                          <li>40% on completion</li>
                        </ul>
                      ) : property.paymentPlan === '50/50' ? (
                        <ul className="list-disc pl-5 space-y-2">
                          <li>10% on booking</li>
                          <li>10% after 30 days</li>
                          <li>10% after 60 days</li>
                          <li>10% after 90 days</li>
                          <li>10% after 120 days</li>
                          <li>50% on completion</li>
                        </ul>
                      ) : (
                        <ul className="list-disc pl-5 space-y-2">
                          <li>10% on booking</li>
                          <li>10% after 30 days</li>
                          <li>10% after 60 days</li>
                          <li>10% after 90 days</li>
                          <li>10% after 120 days</li>
                          <li>10% after 150 days</li>
                          <li>10% after 180 days</li>
                          <li>30% on completion</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </Tabs.Tab.Panel>

                {/* Brochure Tab */}
                <Tabs.Tab.Panel>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Brochure</h2>
                    <p className="text-gray-600 mb-4">Fill out the contact form to receive the detailed brochure for this property.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
                      Request Brochure
                    </button>
                  </div>
                </Tabs.Tab.Panel>
              </Tabs.Tab.Panels>
            </Tabs.Tab.Group>
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
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    {property.title} - Photo Gallery
                  </Dialog.Title>
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                  {/* Main Image */}
                  <div className="relative h-96 w-full mb-4">
                    {property.images && property.images.length > 0 && (
                      <Image
                        src={getFullImageUrl(property.images[currentPhotoIndex])}
                        alt={`Property Image ${currentPhotoIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-gray-600">
                      {currentPhotoIndex + 1} of {property.images.length}
                    </span>
                    <button
                      onClick={() => setCurrentPhotoIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnails */}
                  <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                    {property.images && property.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded ${index === currentPhotoIndex ? 'ring-2 ring-blue-500' : ''}`}
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
                </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
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
