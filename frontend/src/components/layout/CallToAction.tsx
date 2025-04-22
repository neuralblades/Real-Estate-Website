"use client";

import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#e9ddb0] to-[#d5bf6a] text-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
        <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
          Let us help you discover the perfect property that matches your lifestyle and preferences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/properties" className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-900 text-white font-bold rounded-md hover:from-gray-900 hover:to-black transition duration-300">
            Browse Properties
          </Link>
          <Link href="/contact" className="px-8 py-3 bg-white text-gray-900 font-bold rounded-md border border-gray-300 hover:bg-gray-100 transition duration-300">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
