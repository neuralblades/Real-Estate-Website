"use client";

import Image from 'next/image';
import { getFullImageUrl } from '@/utils/imageUtils';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Homeowner',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      quote: 'Working with Luxury Estates was an absolute pleasure. They found us our dream home in record time and made the entire process smooth and stress-free.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Investor',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      quote: "As an investor, I appreciate their market knowledge and attention to detail. They&apos;ve helped me secure multiple high-performing properties over the years.",
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'First-time Buyer',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      quote: "Being a first-time buyer was intimidating, but the team at Luxury Estates guided me through every step. I couldn&apos;t be happier with my new apartment!",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about their experience with Luxury Estates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={getFullImageUrl(testimonial.image)}
                    alt={testimonial.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>

              <div className="mt-4 flex text-[#a49650]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
