'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Always keep sidebar open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Check if user is authenticated and is an admin
    if (!user || !isAdmin) {
      router.push('/auth/login?redirect=/admin/dashboard');
    }
  }, [user, isAdmin, loading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold">Real Estate Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">RE</h1>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {isSidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-8">
          <div className="px-4 mb-6">
            <div className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src="/images/admin-avatar.png"
                  alt="Admin"
                  fill
                  sizes="(max-width: 768px) 100vw, 40px"
                  className="object-cover"
                />
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              )}
            </div>
          </div>
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/dashboard' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/properties"
                className={`flex items-center py-3 px-4 ${
                  pathname.startsWith('/admin/properties') ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Properties</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/developers"
                className={`flex items-center py-3 px-4 ${
                  pathname.startsWith('/admin/developers') ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Developers</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={`flex items-center py-3 px-4 ${
                  pathname.startsWith('/admin/users') ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Users</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/inquiries"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/inquiries' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Property Inquiries</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/general-inquiries"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/general-inquiries' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Chatbot Inquiries</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/contact-submissions"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/contact-submissions' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Contact Submissions</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/offplan-inquiries"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/offplan-inquiries' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Offplan Inquiries</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/document-requests"
                className={`flex items-center py-3 px-4 ${
                  pathname === '/admin/document-requests' ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Document Requests</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/blog"
                className={`flex items-center py-3 px-4 ${
                  pathname.startsWith('/admin/blog') ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Blog Posts</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/team"
                className={`flex items-center py-3 px-4 ${
                  pathname.startsWith('/admin/team') ? 'bg-blue-700' : 'hover:bg-gray-800'
                } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {isSidebarOpen && <span className="ml-3">Team Members</span>}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/auth/login');
            }}
            className={`flex items-center py-2 px-4 text-red-400 hover:bg-gray-800 rounded ${
              isSidebarOpen ? 'justify-start w-full' : 'justify-center'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {pathname === '/admin/dashboard' && 'Dashboard'}
                {pathname.startsWith('/admin/properties') && 'Properties Management'}
                {pathname.startsWith('/admin/developers') && 'Developers Management'}
                {pathname.startsWith('/admin/users') && 'User Management'}
                {pathname === '/admin/inquiries' && 'Property Inquiries'}
                {pathname === '/admin/general-inquiries' && 'Chatbot Inquiries'}
                {pathname === '/admin/contact-submissions' && 'Contact Submissions'}
                {pathname === '/admin/offplan-inquiries' && 'Offplan Inquiries'}
                {pathname === '/admin/document-requests' && 'Document Requests'}
                {pathname.startsWith('/admin/blog') && 'Blog Management'}
                {pathname.startsWith('/admin/team') && 'Team Management'}
              </h2>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
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
