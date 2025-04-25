"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use the auth context instead of local state
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-black to-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Image src={"/images/logo.svg"} alt="Luxury Estates" width={200} height={200} className="object-contain"/>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Home
          </Link>
          <Link href="/properties" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Properties
          </Link>
          <Link href="/properties/offplan" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Off Plan
          </Link>
          <Link href="/developers" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Developers
          </Link>
          <Link href="/blog" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Blog
          </Link>
          <Link href="/about" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            About
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-[#a49650] transition duration-300">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <div className="relative">
              <div className="flex items-center space-x-4">

                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition duration-300"
                >
                  <span>{user.firstName}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/saved-properties"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Saved Properties
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user.role === 'agent' && (
                    <Link
                      href="/agent/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Agent Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-2 text-[#a49650] border border-[#a49650] rounded hover:bg-[#a49650] hover:text-white transition duration-300">
                Login
              </Link>
              <Link href="/auth/register" className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded hover:from-gray-900 hover:to-gray-700 transition duration-300">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-md">
          <nav className="flex flex-col space-y-3 pb-3">
            <Link href="/" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Properties
            </Link>
            <Link href="/properties/offplan" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Off Plan
            </Link>
            <Link href="/developers" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Developers
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
                    Profile
                  </Link>
                  <Link href="/messages" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
                    Messages
                  </Link>
                  <Link href="/saved-properties" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
                    Saved Properties
                  </Link>

                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
                      Admin Dashboard
                    </Link>
                  )}

                  {user.role === 'agent' && (
                    <Link href="/agent/dashboard" className="text-gray-700 hover:text-[#c2a124] transition duration-300">
                      Agent Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-800 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2 text-center text-[#c2a124] border border-[#c2a124] rounded hover:bg-[#c2a124] hover:text-white transition duration-300">
                    Login
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 text-center bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded hover:from-gray-900 hover:to-black transition duration-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
