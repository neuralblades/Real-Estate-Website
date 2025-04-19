"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import { getPropertyById, getProperties } from '@/services/propertyService';
import { createInquiry } from '@/services/inquiryService';
import { use } from 'react';

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

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);

  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        // Validate ID before making the request
        const id = unwrappedParams.id;
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
                (p: any) => p.id !== response.property.id
              ).slice(0, 3);
              setSimilarProperties(filtered);
            }
          } catch (err) {
            console.error('Error fetching similar properties:', err);
            // Use fallback similar properties
            const fallbackSimilar = properties
              .filter(p => p.id !== unwrappedParams.id)
              .slice(0, 3);
            setSimilarProperties(fallbackSimilar);
          }
        } else {
          // If API fails, use fallback data
          const fallbackProperty = properties.find(p => p.id === unwrappedParams.id);
          if (fallbackProperty) {
            setProperty(fallbackProperty);
            const fallbackSimilar = properties
              .filter(p => p.id !== unwrappedParams.id)
              .slice(0, 3);
            setSimilarProperties(fallbackSimilar);
          } else {
            setError('Property not found');
          }
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        // Use fallback data
        const fallbackProperty = properties.find(p => p.id === unwrappedParams.id);
        if (fallbackProperty) {
          setProperty(fallbackProperty);
          const fallbackSimilar = properties
            .filter(p => p.id !== unwrappedParams.id)
            .slice(0, 3);
          setSimilarProperties(fallbackSimilar);
        } else {
          setError('Property not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [unwrappedParams.id]);

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
        property: unwrappedParams.id,
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-600 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
          Browse All Properties
        </Link>
      </div>
    );
  }

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

      {/* Property Title and Price */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{property.location}</p>
        <p className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
      </div>

      {/* Property Images */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 relative h-96">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative h-48">
              <Image
                src={image}
                alt={`${property.title} - Image ${index + 2}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Property Details and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          {/* Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-600">Bedrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bedrooms}</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">Bathrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bathrooms}</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="text-gray-600">Area</span>
                <span className="text-xl font-bold text-gray-900">{property.area} sqft</span>
              </div>

              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">Location</span>
                <span className="text-xl font-bold text-gray-900">{property.location.split(',')[0]}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">{property.description}</p>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {property.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Map will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Contact Form and Agent Info */}
        <div>
          {/* Agent Info */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Listed By</h2>
            <div className="flex items-center mb-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={property.agent?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={property.agent?.firstName ? `${property.agent.firstName} ${property.agent.lastName}` : 'Real Estate Agent'}
                  fill
                  sizes="(max-width: 768px) 100vw, 64px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {property.agent?.firstName ? `${property.agent.firstName} ${property.agent.lastName}` : 'Real Estate Agent'}
                </h3>
                <p className="text-gray-600">Real Estate Agent</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {property.agent?.phone || '(555) 123-4567'}
              </p>
              <p className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {property.agent?.email || 'agent@luxuryestates.com'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interested in this property?</h2>

            {formSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                <p>Thank you for your inquiry! We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{formError}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="I'm interested in this property and would like to schedule a viewing."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className={`w-full py-3 px-4 rounded-md font-medium transition duration-300 ${formSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {formSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties You May Like</h2>
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
              imageUrl={property.mainImage || property.imageUrl}
              featured={property.featured}
              agent={property.agent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
