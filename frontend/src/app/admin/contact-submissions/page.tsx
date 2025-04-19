'use client';

import React, { useEffect, useState } from 'react';
import { getContactForms } from '@/services/contactService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ContactForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function ContactSubmissionsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication first
    if (!user) {
      router.push('/auth/login?redirect=/admin/contact-submissions');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    // Fetch data
    const fetchForms = () => {
      try {
        // Directly access localStorage to get the latest data
        if (typeof window !== 'undefined') {
          // First try to get data directly from localStorage
          const storedForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
          console.log('Initial load - forms in localStorage:', storedForms);

          // If we have forms in localStorage, use them
          if (storedForms.length > 0) {
            setForms(storedForms);
          } else {
            // Otherwise, use the service function which will provide test data
            const data = getContactForms();
            console.log('Using service function data:', data);
            setForms(data);
          }
        }
      } catch (error) {
        console.error('Error fetching contact forms:', error);
        // Fallback to the service function
        const data = getContactForms();
        setForms(data);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user, isAdmin, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to manually refresh the data
  const handleRefresh = () => {
    setLoading(true);

    // Directly access localStorage to get the latest data
    try {
      if (typeof window !== 'undefined') {
        const storedForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
        console.log('Directly retrieved from localStorage:', storedForms);
        setForms(storedForms);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Fallback to the service function
      const data = getContactForms();
      setForms(data);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Debug function to directly check localStorage
                if (typeof window !== 'undefined') {
                  const rawData = localStorage.getItem('contactForms');
                  console.log('Raw localStorage data:', rawData);
                  alert('Check console for localStorage data');
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Debug
            </button>
            <button
              onClick={() => {
                // Add a test submission directly to localStorage
                if (typeof window !== 'undefined') {
                  const testSubmission = {
                    id: `test-${Date.now()}`,
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    phone: '(555) 123-4567',
                    subject: 'Test Submission',
                    message: 'This is a test submission added directly to localStorage.',
                    createdAt: new Date().toISOString(),
                    status: 'new'
                  };

                  // Get existing forms
                  const existingForms = JSON.parse(localStorage.getItem('contactForms') || '[]');

                  // Add the test submission
                  existingForms.push(testSubmission);

                  // Save back to localStorage
                  localStorage.setItem('contactForms', JSON.stringify(existingForms));

                  // Refresh the display
                  setForms(existingForms);

                  alert('Test submission added. Check the table below.');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Add Test
            </button>
            <button
              onClick={() => {
                // Clear all contact forms from localStorage
                if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all contact form submissions?')) {
                  localStorage.removeItem('contactForms');
                  setForms([]);
                  alert('All contact form submissions have been cleared.');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p>No contact form submissions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-left">Message</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(form.createdAt)}</td>
                    <td className="py-3 px-4">{`${form.firstName} ${form.lastName}`}</td>
                    <td className="py-3 px-4">{form.phone}</td>
                    <td className="py-3 px-4">{form.email}</td>
                    <td className="py-3 px-4">{form.subject}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">{form.message}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        form.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : form.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {form.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
