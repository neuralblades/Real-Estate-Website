'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Messaging from '@/components/messaging/Messaging';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get('inquiry');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    if (!loading && user) {
      setIsAuthorized(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access your messages.
          </p>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Messages</h1>
        <p className="text-gray-600">
          Communicate with agents and inquirers about properties.
        </p>
      </div>

      {user && (
        <Messaging 
          currentUserId={user.id} 
          initialInquiryId={inquiryId || undefined}
        />
      )}
    </div>
  );
}
