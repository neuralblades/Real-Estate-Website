'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ButtonDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Button Component Demo</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="accent">Accent Button</Button>
          <Button variant="mj">majeed</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Gradient vs Solid</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" gradient={true} className="shadow-md">Gradient Primary</Button>
          <Button variant="primary" gradient={false}>Solid Primary</Button>
          <Button variant="secondary" gradient={true} className="shadow-md">Gradient Secondary</Button>
          <Button variant="secondary" gradient={false}>Solid Secondary</Button>
          <Button variant="accent" gradient={true} className="shadow-md">Gradient Accent</Button>
          <Button variant="accent" gradient={false}>Solid Accent</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Full Width Button</h2>
        <div className="max-w-md">
          <Button fullWidth>Full Width Button</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Link Button</h2>
        <div className="flex flex-wrap gap-4">
          <Button href="/">Home Link</Button>
          <Button href="/properties" variant="secondary">Properties Link</Button>
          <Button href="/contact" variant="accent">Contact Link</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Button</Button>
          <Button isLoading={isLoading} onClick={handleLoadingClick}>
            {isLoading ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New
          </Button>
          <Button variant="secondary">
            <span>Next</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Call to Action Example</h2>
        <div className="p-8 bg-gradient-to-r from-[#e9ddb0] to-[#a49650] rounded-lg text-center">
          <h3 className="text-xl font-bold mb-4">Ready to Find Your Dream Property?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              gradient={true}
              className="font-bold shadow-lg"
            >
              Browse Properties
            </Button>
            <Button
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
