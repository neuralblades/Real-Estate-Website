"use client";

import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-500 to-gray-900 text-white py-32">
        <Image src="/images/banner.webp" alt="About Us" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">About Our Company</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#a49650] to-[#877b42] mx-auto mb-8"></div>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              We are dedicated to providing exceptional service and finding the perfect property for our clients.
            </p>
            <Button
              href="/team"
              variant="accent"
              size="lg"
              gradient={true}
              className="font-medium shadow-lg"
            >
              Meet Our Team
            </Button>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">Our Journey</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-teal-800 mb-8"></div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Founded in 2010, our company has established itself as a leader in the luxury real estate market. Our journey began with a simple mission: to provide exceptional service to clients seeking premium properties in the most desirable locations.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Over the years, we have built a reputation for our attention to detail, market knowledge, and commitment to client satisfaction. Our team of experienced professionals is dedicated to understanding the unique needs and preferences of each client, ensuring a personalized and seamless experience.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, our company continues to grow and evolve, but our core values remain the same. We are passionate about real estate and committed to helping our clients find their dream properties or make successful investments.
              </p>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 z-10 rounded-lg"></div>
                <Image
                  src="/images/offplan-header.webp"
                  alt="Our Office"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#a49650]/10 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-teal-600/10 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">What We Stand For</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-teal-800 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed">
              These principles guide everything we do and define how we serve our clients and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-600 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Integrity</h3>
              <p className="text-gray-700 text-center">
                We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#a49650] hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#a49650]/20 flex items-center justify-center">
                  <svg className="h-8 w-8 text-[#a49650]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Excellence</h3>
              <p className="text-gray-700 text-center">
                We strive for excellence in everything we do, from the properties we represent to the service we provide to our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#a08f7d] hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#a08f7d]/20 flex items-center justify-center">
                  <svg className="h-8 w-8 text-[#a08f7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Client-Focused</h3>
              <p className="text-gray-700 text-center">
                We put our clients' needs first, providing personalized service and tailored solutions to meet their unique requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-[#a49650]">500+</div>
              <p className="text-gray-200 font-medium">Properties Sold</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-[#a49650]">98%</div>
              <p className="text-gray-200 font-medium">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-[#a49650]">15+</div>
              <p className="text-gray-200 font-medium">Years Experience</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-[#a49650]">24</div>
              <p className="text-gray-200 font-medium">Expert Agents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">Our Experts</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-teal-800 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed mb-8">
              Meet the experienced professionals who lead our company to success.
            </p>
            <Button
              href="/team"
              variant="mj"
              size="md"
              gradient={true}
              className="font-medium"
            >
              View All Team Members
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#e9ddb0] to-[#a49650] text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Our team of experts is ready to help you find the perfect property that meets your needs and exceeds your expectations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              href="/properties"
              variant="primary"
              size="lg"
              gradient={true}
              className="font-bold shadow-lg"
            >
              Browse Properties
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-white font-bold shadow-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
