"use client";

import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Let us help you discover the perfect property that matches your lifestyle and preferences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/properties" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100 transition duration-300">
            Browse Properties
          </Link>
          <Link href="/contact" className="px-8 py-3 bg-blue-700 text-white font-bold rounded-md border border-blue-500 hover:bg-blue-800 transition duration-300">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
