"use client";

import React, { useState, useEffect, Usable } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/properties/PropertyCard';
import { getPropertyById, getProperties, Property } from '@/services/propertyService';
import { createInquiry } from '@/services/inquiryService';
import { getFullImageUrl } from '@/utils/imageUtils';
import { Dialog, Transition } from '@headlessui/react';
import MapComponent from '@/components/Map';
import Chatbot from '@/components/chatbot/Chatbot';

// Mock data for properties
const properties = [
  {
    id: '1',
    title: 'Luxury Penthouse with Ocean View',
    price: 2500000,
    location: 'Miami Beach, FL',
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    description: `This stunning penthouse offers breathtaking ocean views from every room. The open floor plan features floor-to-ceiling windows, a gourmet kitchen with top-of-the-line appliances, and a spacious living area perfect for entertaining. The master suite includes a luxurious bathroom with a soaking tub and a walk-in closet. Two additional bedrooms provide ample space for family or guests. The large private terrace is ideal for outdoor dining and relaxation while enjoying the panoramic views of the Atlantic Ocean. Building amenities include a fitness center, swimming pool, concierge service, and 24-hour security.`,
    features: [
      'Ocean Views',
      'Private Terrace',
      'Floor-to-ceiling Windows',
      'Gourmet Kitchen',
      'Marble Bathrooms',
      'Walk-in Closets',
      'Central Air Conditioning',
      'In-unit Laundry',
      'Concierge Service',
      'Swimming Pool',
      'Fitness Center',
      '24-hour Security',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7f34b5e0f01?q=80&w=2070&auto=format&fit=crop',
    ],
    agent: {
      name: 'Jennifer Smith',
      phone: '+1 (305) 555-1234',
      email: 'jennifer@luxuryestates.com',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
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
    description: `This modern architectural masterpiece offers the perfect blend of luxury and comfort. The open-concept design features high ceilings, natural light, and seamless indoor-outdoor living. The gourmet kitchen is equipped with custom cabinetry and professional-grade appliances. The spacious primary suite includes a spa-like bathroom and a private balcony. Four additional bedrooms provide ample space for family and guests. The backyard oasis features a private pool, spa, and outdoor kitchen, perfect for entertaining. Located in a prestigious neighborhood, this property offers privacy and convenience with proximity to high-end shopping, dining, and entertainment.`,
    features: [
      'Private Pool',
      'Outdoor Kitchen',
      'High Ceilings',
      'Smart Home Technology',
      'Custom Cabinetry',
      'Professional-grade Appliances',
      'Home Theater',
      'Wine Cellar',
      'Spa-like Bathrooms',
      'Private Balcony',
      'Landscaped Garden',
      '3-Car Garage',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
    ],
    agent: {
      name: 'Michael Johnson',
      phone: '+1 (310) 555-5678',
      email: 'michael@luxuryestates.com',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    featured: true,
  },
];

// Create a client component wrapper
function PropertyDetailClient({ propertyId }: { propertyId: string }) {
  // Use the ID directly
  const id = propertyId;

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Photo gallery modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I\'m interested in this property and would like to schedule a viewing.'
  });
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auth context for user info
  const { user } = useAuth();

  // Remove global chatbot when on property page to use the property-specific one
  useEffect(() => {
    const globalChatbot = document.querySelector('.global-chatbot');
    if (globalChatbot) {
      globalChatbot.classList.add('hidden');
    }

    return () => {
      const globalChatbot = document.querySelector('.global-chatbot');
      if (globalChatbot) {
        globalChatbot.classList.remove('hidden');
      }
    };
  }, []);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        // Validate ID before making the request
        if (!id || isNaN(Number(id))) {
          setError('Invalid property ID');
          setLoading(false);
          return;
        }

        // Try to fetch from API
        const response = await getPropertyById(id);
        if (response.success && response.property) {
          setProperty(response.property);

          // Fetch similar properties
          try {
            const similarResponse = await getProperties({
              type: response.property.propertyType,
              bedrooms: response.property.bedrooms
            });
            if (similarResponse.success && similarResponse.properties.length > 0) {
              // Filter out the current property
              const filtered = similarResponse.properties.filter(
                (p: { id: string }) => p.id !== response.property.id
              ).slice(0, 3);
              setSimilarProperties(filtered);
            }
          } catch (err) {
            console.error('Error fetching similar properties:', err);
            // Use fallback similar properties
            const fallbackSimilar = properties
              .filter(p => p.id !== id)
              .slice(0, 3);
            setSimilarProperties(fallbackSimilar as unknown as Property[]);
          }
        } else {
          // If API fails, use fallback data
          const fallbackProperty = properties.find(p => p.id === id);
          if (fallbackProperty) {
            setProperty(fallbackProperty as unknown as Property);
            const fallbackSimilar = properties
              .filter(p => p.id !== id)
              .slice(0, 3);
            setSimilarProperties(fallbackSimilar as unknown as Property[]);
          } else {
            setError('Property not found');
          }
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        // Use fallback data
        const fallbackProperty = properties.find(p => p.id === id);
        if (fallbackProperty) {
          setProperty(fallbackProperty as unknown as Property);
          const fallbackSimilar = properties
            .filter(p => p.id !== id)
            .slice(0, 3);
          setSimilarProperties(fallbackSimilar as unknown as Property[]);
        } else {
          setError('Property not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const response = await createInquiry({
        property: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      if (response.success) {
        setFormSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: 'I\'m interested in this property and would like to schedule a viewing.'
        });
      } else {
        setFormError('Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setFormError('Failed to submit inquiry. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a49650]"></div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties" className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-md hover:shadow-lg transition duration-300">
          Browse All Properties
        </Link>
      </div>
    );
  }

  // Property details content starts here

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex text-gray-600 text-sm">
          <Link href="/" className="hover:text-blue-600 transition duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-blue-600 transition duration-300">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{property.title}</span>
        </nav>
      </div>

      {/* Property Images */}
      <div className="mb-12">
        <div className="grid grid-cols-12 gap-4">
          {/* Main large image (left side) */}
          <div className="col-span-12 md:col-span-8 relative h-[500px]">
            <Image
              src={getFullImageUrl(property.images[0])}
              alt={property.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
              unoptimized
            />
          </div>

          {/* Right side column with two images */}
          <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-4">
            {/* Top right image */}
            <div className="relative h-[240px]">
              <Image
                src={getFullImageUrl(property.images[1] || property.images[0])}
                alt={`${property.title} - Image 2`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>

            {/* Bottom right image */}
            <div className="relative h-[240px]">
              <Image
                src={getFullImageUrl(property.images[2] || property.images[0])}
                alt={`${property.title} - Image 3`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          </div>

          {/* View all photos button */}
          <div className="col-span-12 flex justify-start mt-2">
            <button
              onClick={() => {
                setCurrentPhotoIndex(0);
                setIsGalleryOpen(true);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View all {property.images.length} photos
            </button>
          </div>
        </div>
      </div>

      {/* Property Details and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Property Details */}
        <div className="lg:col-span-2">
          {/* Overview */}
          {/* Property Title and Price */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">
              {property.status === 'for-sale' ? 'For Sale' : property.status === 'for-rent' ? 'For Rent' : property.status}
            </div>
            <p className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-4">AED {property.price.toLocaleString()}</p>
            <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">{property.title}</h1>
            <p className="text-gray-600 text-lg flex items-center">
              <svg className="h-5 w-5 mr-2 text-[#a08f7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-600 font-medium">Bedrooms</span>
                <span className="text-xl font-bold text-gray-900 mt-1">{property.bedrooms}</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 font-medium">Bathrooms</span>
                <span className="text-xl font-bold text-gray-900 mt-1">{property.bathrooms}</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="text-gray-600 font-medium">Area</span>
                <span className="text-xl font-bold text-gray-900 mt-1">{property.area} sqft</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 font-medium">Location</span>
                <span className="text-xl font-bold text-gray-900 mt-1">{property.location.split(',')[0]}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {property.isOffplan && (
                <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                  <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-600 font-medium">Type</span>
                  <span className="mt-1 text-md font-semibold bg-teal-100 text-teal-800 px-3 py-1 rounded-full">Off Plan</span>
                </div>
              )}

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 font-medium">Status</span>
                <span className="text-xl font-bold text-gray-900 capitalize mt-1">{property.status.replace('-', ' ')}</span>
              </div>

              {property.yearBuilt && (
                <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                  <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600 font-medium">Year Built</span>
                  <span className="text-xl font-bold text-gray-900 mt-1">{property.yearBuilt}</span>
                </div>
              )}

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-100">
                <svg className="h-8 w-8 text-teal-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-600 font-medium">Property Type</span>
                <span className="text-xl font-bold text-gray-900 capitalize mt-1">{property.propertyType}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </span>
              Description
            </h3>
            <div
              className="text-gray-700 mb-8 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border border-gray-100"
              style={{
                display: 'block',
                lineHeight: '1.8',
              }}
            >
              {property.description}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {property.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-300">
                  <svg className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Location
            </h2>
            <div className="rounded-lg overflow-hidden mb-6 border border-gray-100">
              <MapComponent
                address={property.address || ''}
                location={property.location || ''}
                height="400px"
                zoom={14}
              />
            </div>
            <div className="mt-6 text-gray-700 bg-gray-50 p-5 rounded-lg border border-gray-100">
              {property.address && (
                <p className="mb-3 flex items-start">
                  <svg className="h-5 w-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span><strong className="font-semibold">Address:</strong> {property.address}</span>
                </p>
              )}
              {property.location && (
                <p className="flex items-start">
                  <svg className="h-5 w-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span><strong className="font-semibold">Neighborhood:</strong> {property.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form and Agent Info - Fixed on scroll */}
        <div className="lg:sticky lg:top-15 lg:self-start h-fit">
          <div className="space-y-8">
          {/* Developer Info (if available) */}
          {property.developer && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                  <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                Developer
              </h2>
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {property.developer.logo ? (
                  <div className="relative h-16 w-16 overflow-hidden mr-4 rounded-lg border border-gray-200">
                    <Image
                      src={getFullImageUrl(property.developer.logo)}
                      alt={property.developer.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 64px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-16 w-16 bg-teal-100 mr-4 rounded-lg">
                    <span className="text-2xl font-bold text-teal-600">{property.developer.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{property.developer.name}</h3>
                </div>
              </div>
              <Link
                href={`/developers/${property.developer.slug}`}
                className="flex items-center text-teal-600 hover:text-teal-800 transition duration-300 font-medium bg-teal-50 p-3 rounded-lg justify-center"
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {/* Agent Info */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Listed By
            </h2>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 mb-5">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-teal-100">
                <Image
                  src={getFullImageUrl(property.agent?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg')}
                  alt={property.agent?.firstName ? `${property.agent.firstName} ${property.agent.lastName}` : 'Real Estate Agent'}
                  fill
                  sizes="(max-width: 768px) 100vw, 64px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {property.agent?.firstName ? `${property.agent.firstName} ${property.agent.lastName}` : 'Real Estate Agent'}
                </h3>
                <p className="text-gray-600">Real Estate Agent</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <svg className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">{property.agent?.phone || '(555) 123-4567'}</span>
              </p>
              <p className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <svg className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{property.agent?.email || 'agent@luxuryestates.com'}</span>
              </p>

              {/* Direct Message Button - Only show if user is logged in */}
              {user && property.agent && (
                <Link
                  href={`/messages?inquiry=${property.id}`}
                  className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-lg flex items-center justify-center transition duration-300 hover:shadow-lg"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message Agent
                </Link>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
              Interested in this property?
            </h2>

            {formSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg mb-4 flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Thank you for your inquiry! We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-4 flex items-center">
                    <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>{formError}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="I'm interested in this property and would like to schedule a viewing."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition duration-300 ${formSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg'}`}
                >
                  {formSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          Similar Properties You May Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              imageUrl={property.mainImage || ''}
              featured={property.featured}
              agent={property.agent}
            />
          ))}
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
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          {/* Full-screen container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-black p-6 shadow-xl transition-all">
                  <div className="relative">
                    {/* Close button */}
                    <button
                      onClick={() => setIsGalleryOpen(false)}
                      className="absolute right-0 top-0 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Main image */}
                    <div className="relative h-[70vh] w-full">
                      <Image
                        src={getFullImageUrl(property.images[currentPhotoIndex])}
                        alt={`${property.title} - Image ${currentPhotoIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        unoptimized
                      />
                    </div>

                    {/* Navigation buttons */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                        className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 ml-2"
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                        className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 mr-2"
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                      {currentPhotoIndex + 1} / {property.images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                    {property.images.map((image: string, index: number) => (
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
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Property-specific chatbot */}
      <Chatbot currentProperty={property} />
    </div>
  );
}


// Server component that passes the ID to the client component
export default function PropertyDetailPage({ params }: { params: Usable<{ id: string }> }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const propertyId = unwrappedParams.id;
  return <PropertyDetailClient propertyId={propertyId} />;
}
