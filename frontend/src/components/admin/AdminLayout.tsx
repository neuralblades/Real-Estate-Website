'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Check if user is authenticated and is an admin
    if (!user || !isAdmin) {
      router.push('/auth/login?redirect=/admin/dashboard');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || (!user && !loading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Real Estate Admin</h1>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/properties"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Properties</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/developers"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Developers</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/inquiries"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Property Inquiries</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/contact-submissions"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Contact Submissions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/blog"
                className="flex items-center py-3 px-4 hover:bg-gray-800"
              >
                <span className="ml-3">Blog Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/team"
                className="flex items-center py-3 px-4 bg-blue-700"
              >
                <span className="ml-3">Team Members</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Team Management</h2>
            <div className="flex items-center">
              <Link href="/" className="ml-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800">
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
