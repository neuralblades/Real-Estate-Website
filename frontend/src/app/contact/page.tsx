"use client";

import { useState, FormEvent } from 'react';
import { submitContactForm } from '@/services/contactService';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import GoogleMap from '@/components/maps/GoogleMap';
import RatingCard from '@/components/RatingCard';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    // Debug: Log the form data
    console.log('Submitting form data:', formData);

    try {
      // Create the form data object
      const formDataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

      // Submit the form
      const response = await submitContactForm(formDataToSubmit);

      // Debug: Log the response
      console.log('Form submission response:', response);

      if (response.success) {
        // Manually add the form to localStorage to ensure it's saved
        const storedForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
        const newForm = {
          ...formDataToSubmit,
          id: `contact-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'new'
        };

        storedForms.push(newForm);
        localStorage.setItem('contactForms', JSON.stringify(storedForms));

        // Debug: Check localStorage after submission
        console.log('Forms in localStorage after manual update:', storedForms);

        setFormSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setFormError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setFormError('Failed to submit form. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white bg-gradient-to-r from-gray-500 to-gray-900 py-32">
        <Image src="/images/banner.webp" alt="Contact Us" fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Contact Us</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#a49650] to-[#877b42] mx-auto mb-8"></div>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              We&apos;re here to help you with any questions or inquiries about our properties or services.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information and Form */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <div className="inline-block px-3 py-1 text-sm font-semibold text-white bg-[#a49650] rounded-full mb-4">Get In Touch</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gray-500 to-gray-800 mb-8"></div>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Whether you&apos;re looking to buy, sell, or rent a property, our team of experts is ready to assist you. Fill out the form or contact us directly using the information below.
              </p>

              <div className="space-y-8">
                <div className="flex items-start p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border-l-4 border-[#a49650]">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-gray-900 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Address</h3>
                    <p className="text-gray-700 mt-2">
                      Concord Tower - 2902<br />
                      Al Sufouh - Dubai Media City<br />
                      Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border-l-4 border-[#a49650]">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-gray-900 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-700 mt-2">
                      +971 4 123 4567<br />
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border-l-4 border-[#a49650]">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-500 to-gray-900 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Email</h3>
                    <p className="text-gray-700 mt-2">
                      <a href="mailto:info@platinumsquare.ae" className="hover:text-teal-600 transition-colors">info@platinumsquare.ae</a><br />
                      <a href="mailto:sales@platinumsquare.ae" className="hover:text-teal-600 transition-colors">sales@platinumsquare.ae</a><br />
                      <a href="mailto:support@platinumsquare.ae" className="hover:text-teal-600 transition-colors">support@platinumsquare.ae</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#a49650] hover:text-white text-[#a49650]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#a49650] hover:text-white text-[#a49650]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#a49650] hover:text-white text-[#a49650]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#a49650] hover:text-white text-[#a49650]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="inline-block px-3 py-1 text-sm font-semibold text-white bg-[#a49650] rounded-full mb-4">Send Message</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#a49650] to-[#877b42] mb-8"></div>

              {formSuccess ? (
                <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-700 p-6 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-bold text-lg">Thank you for your message!</p>
                  </div>
                  <p className="ml-9">We have received your inquiry and will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-6">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="font-medium">{formError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="John"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="Property Inquiry"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    gradient={true}
                    fullWidth={true}
                    size="lg"
                    className="font-medium shadow-lg"
                    isLoading={formSubmitting}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-white bg-[#a49650] rounded-full mb-4">Visit Us</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Location</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed">
              We&apos;re conveniently located in the heart of the city. Feel free to visit us during business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-2 rounded-xl shadow-lg overflow-hidden">
              <div className="relative overflow-hidden rounded-lg">
                <GoogleMap
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                  center={{ lat: 25.0978143, lng: 55.1587698 }}
                  zoom={14}
                  markerTitle="Platinum Square Real Estate"
                  height="500px"
                  className="z-0"
                />
                <div className="absolute inset-0 pointer-events-none border-4 border-white rounded-lg z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-teal-800/5 z-20 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <RatingCard
                companyName="Platinum Square Real Estate"
                address="Concord Tower - 2902 - Al Sufouh - Dubai Media City - Dubai"
                rating={5.0}
                reviewCount={21}
                mapUrl="https://maps.app.goo.gl/UHzGvVcsndKg5afE9"
                className="h-auto"
              />

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Business Hours</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">Open 24 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Open 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
