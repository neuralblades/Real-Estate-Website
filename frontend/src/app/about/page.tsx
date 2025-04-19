"use client";

import Image from 'next/image';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Jennifer Smith',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      bio: 'With over 15 years of experience in luxury real estate, Jennifer founded Luxury Estates with a vision to provide exceptional service to clients seeking premium properties.',
    },
    {
      name: 'Michael Johnson',
      role: 'Chief Operating Officer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Michael oversees the day-to-day operations of Luxury Estates, ensuring that our clients receive the highest level of service and attention to detail.',
    },
    {
      name: 'Sarah Williams',
      role: 'Head of Sales',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Sarah leads our sales team with her extensive knowledge of the luxury real estate market and her commitment to helping clients find their perfect property.',
    },
    {
      name: 'David Chen',
      role: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'David brings creative vision and strategic thinking to our marketing efforts, ensuring that our properties receive maximum exposure to potential buyers.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Luxury Estates</h1>
            <p className="text-xl text-blue-100">
              We are dedicated to providing exceptional service and finding the perfect property for our clients.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded in 2010, Luxury Estates has established itself as a leader in the luxury real estate market. Our journey began with a simple mission: to provide exceptional service to clients seeking premium properties in the most desirable locations.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Over the years, we have built a reputation for our attention to detail, market knowledge, and commitment to client satisfaction. Our team of experienced professionals is dedicated to understanding the unique needs and preferences of each client, ensuring a personalized and seamless experience.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, Luxury Estates continues to grow and evolve, but our core values remain the same. We are passionate about real estate and committed to helping our clients find their dream properties or make successful investments.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
                alt="Luxury Estates Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-700">
                We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from the properties we represent to the service we provide to our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Client-Focused</h3>
              <p className="text-gray-700">
                We put our clients' needs first, providing personalized service and tailored solutions to meet their unique requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team of experts is ready to help you find the perfect property that meets your needs and exceeds your expectations.
          </p>
          <a
            href="/contact"
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100 transition duration-300"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
