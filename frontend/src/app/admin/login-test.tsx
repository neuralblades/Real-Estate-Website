'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginTest() {
  const router = useRouter();

  useEffect(() => {
    // Create a test admin user in localStorage
    const testAdminUser = {
      id: 'admin-test-id',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin', // This is important for isAdmin check
      token: 'test-token-for-admin'
    };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(testAdminUser));
    localStorage.setItem('token', testAdminUser.token);

    // Also set the token in the API service
    console.log('Setting test admin token in localStorage');

    // Wait a moment for localStorage to update
    setTimeout(() => {
      router.push('/admin/document-requests');
    }, 500);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Creating Test Admin User...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
