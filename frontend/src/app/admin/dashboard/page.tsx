'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProperties } from '@/services/propertyService';
import { getAllInquiries } from '@/services/inquiryService';
import { getAllUsers } from '@/services/userService';
import { getAllOffplanInquiries } from '@/services/offplanInquiryService';

// Dashboard Stat Card Component
const StatCard = ({ title, value, icon, bgColor }: { title: string; value: number; icon: React.ReactNode; bgColor: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`rounded-full p-3 mr-4 ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    inquiries: 0,
    offplanInquiries: 0,
    featuredProperties: 0,
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentOffplanInquiries, setRecentOffplanInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch properties
        const propertiesResponse = await getProperties();
        if (propertiesResponse.success) {
          setStats(prev => ({
            ...prev,
            properties: propertiesResponse.total || propertiesResponse.properties.length,
            featuredProperties: propertiesResponse.properties.filter((p: any) => p.featured).length,
          }));

          // Get 5 most recent properties
          const sortedProperties = [...propertiesResponse.properties].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentProperties(sortedProperties.slice(0, 5));
        }

        // Fetch inquiries
        const inquiriesResponse = await getAllInquiries();
        if (inquiriesResponse.success) {
          setStats(prev => ({
            ...prev,
            inquiries: inquiriesResponse.inquiries.length,
          }));

          // Get 5 most recent inquiries
          const sortedInquiries = [...inquiriesResponse.inquiries].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentInquiries(sortedInquiries.slice(0, 5));
        }

        // Fetch users
        const usersResponse = await getAllUsers();
        if (usersResponse.success) {
          setStats(prev => ({
            ...prev,
            users: usersResponse.users.length,
          }));
        }

        // Fetch offplan inquiries
        const offplanInquiriesResponse = await getAllOffplanInquiries();
        if (offplanInquiriesResponse.success) {
          setStats(prev => ({
            ...prev,
            offplanInquiries: offplanInquiriesResponse.inquiries.length,
          }));

          // Get 5 most recent offplan inquiries
          const sortedOffplanInquiries = [...offplanInquiriesResponse.inquiries].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentOffplanInquiries(sortedOffplanInquiries.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.properties}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Featured Properties"
          value={stats.featuredProperties}
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          bgColor="bg-green-100"
        />
        <StatCard
          title="Property Inquiries"
          value={stats.inquiries}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          bgColor="bg-purple-100"
        />
        <StatCard
          title="Offplan Inquiries"
          value={stats.offplanInquiries}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          bgColor="bg-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="p-4">
            {recentProperties.length > 0 ? (
              <div className="divide-y">
                {recentProperties.map((property) => (
                  <div key={property.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{property.title}</h3>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">AED {property.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No properties found</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="p-4">
            {recentInquiries.length > 0 ? (
              <div className="divide-y">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="py-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{inquiry.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status || 'new'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No inquiries found</p>
            )}
          </div>
        </div>

        {/* Recent Offplan Inquiries */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Offplan Inquiries</h2>
            <Link href="/admin/offplan-inquiries" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="p-4">
            {recentOffplanInquiries.length > 0 ? (
              <div className="divide-y">
                {recentOffplanInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="py-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{inquiry.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status || 'new'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No offplan inquiries found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
