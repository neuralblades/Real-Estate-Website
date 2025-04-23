"use client";

import Button from '@/components/ui/Button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#e9ddb0] to-[#a49650] text-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
        <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
          Let us help you discover the perfect property that matches your lifestyle and preferences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            href="/properties"
            variant="primary"
            size="lg"
          >
            Browse Properties
          </Button>
          <Button
            href="/contact"
            variant="wht"
            size="lg"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
