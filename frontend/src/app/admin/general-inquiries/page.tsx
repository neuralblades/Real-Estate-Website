'use client';

import React, { useEffect, useState } from 'react';
import { getGeneralInquiries } from '@/services/inquiryService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface GeneralInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyType?: string;
  bedroomCount?: string;
  propertyInterest?: string;
  message?: string;
  createdAt: string;
  status: string;
}

export default function GeneralInquiriesPage() {
  const [inquiries, setInquiries] = useState<GeneralInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication first
    if (!user) {
      router.push('/auth/login?redirect=/admin/general-inquiries');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    const fetchInquiries = async () => {
      try {
        const data = getGeneralInquiries();
        setInquiries(data);
      } catch (error) {
        console.error('Error fetching general inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
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
        const storedInquiries = JSON.parse(localStorage.getItem('generalInquiries') || '[]');
        console.log('Directly retrieved from localStorage:', storedInquiries);
        setInquiries(storedInquiries);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Fallback to the service function
      const data = getGeneralInquiries();
      setInquiries(data);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Chatbot Inquiries</h1>
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                // Debug function to directly check localStorage
                if (typeof window !== 'undefined') {
                  const rawData = localStorage.getItem('generalInquiries');
                  console.log('Raw localStorage data:', rawData);
                  alert('Check console for localStorage data');
                }
              }}
              variant="outline"
              size="sm"
            >
              Debug
            </Button>
            <Button
              onClick={() => {
                // Add a test submission directly to localStorage
                if (typeof window !== 'undefined') {
                  const testInquiry = {
                    id: `chatbot-${Date.now()}`,
                    name: 'Test User',
                    phone: '(555) 123-4567',
                    email: 'test@example.com',
                    propertyType: 'Apartment',
                    bedroomCount: '2',
                    propertyInterest: 'Buy',
                    message: 'This is a test chatbot inquiry added directly to localStorage.',
                    createdAt: new Date().toISOString(),
                    status: 'new'
                  };

                  // Get existing inquiries
                  const existingInquiries = JSON.parse(localStorage.getItem('generalInquiries') || '[]');

                  // Add the test inquiry
                  existingInquiries.push(testInquiry);

                  // Save back to localStorage
                  localStorage.setItem('generalInquiries', JSON.stringify(existingInquiries));

                  // Refresh the display
                  setInquiries(existingInquiries);

                  alert('Test inquiry added. Check the table below.');
                }
              }}
              variant="secondary"
              size="sm"
            >
              Add Test
            </Button>
            <Button
              onClick={() => {
                // Clear all inquiries from localStorage
                if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all chatbot inquiries?')) {
                  localStorage.removeItem('generalInquiries');
                  setInquiries([]);
                  alert('All chatbot inquiries have been cleared.');
                }
              }}
              variant="danger"
              size="sm"
            >
              Clear All
            </Button>
            <Button
              onClick={handleRefresh}
              variant="primary"
              size="sm"
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No chatbot inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Interest</th>
                  <th className="py-3 px-4 text-left">Property Type</th>
                  <th className="py-3 px-4 text-left">Bedrooms</th>
                  <th className="py-3 px-4 text-left">Message</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(inquiry.createdAt)}</td>
                    <td className="py-3 px-4">{inquiry.name}</td>
                    <td className="py-3 px-4">{inquiry.phone}</td>
                    <td className="py-3 px-4">{inquiry.propertyInterest || 'N/A'}</td>
                    <td className="py-3 px-4">{inquiry.propertyType || 'N/A'}</td>
                    <td className="py-3 px-4">{inquiry.bedroomCount || 'N/A'}</td>
                    <td className="py-3 px-4">{inquiry.message || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        inquiry.status === 'new'
                          ? 'bg-teal-100 text-teal-800'
                          : inquiry.status === 'in-progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inquiry.status}
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
