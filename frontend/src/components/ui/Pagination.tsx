'use client';

import React from 'react';
import Link from 'next/link';
import Button from './Button';
import { ITEMS_PER_PAGE } from '@/config/constants';

export type PaginationVariant = 'buttons' | 'links' | 'minimal';
export type PaginationSize = 'sm' | 'md' | 'lg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: PaginationVariant;
  size?: PaginationSize;
  baseUrl?: string; // For URL-based pagination
  queryParams?: Record<string, string>; // Additional query params for URL-based pagination
  showPageInfo?: boolean; // Show "Page X of Y" text
  maxVisiblePages?: number; // Maximum number of page buttons to show
  className?: string;
  itemsPerPage?: number;
  totalItems?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'buttons',
  size = 'md',
  baseUrl,
  queryParams = {},
  showPageInfo = false,
  maxVisiblePages = 5,
  className = '',
  itemsPerPage = ITEMS_PER_PAGE,
  totalItems,
}: PaginationProps) => {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) return null;

  // Calculate the range of visible page numbers
  const getVisiblePageRange = () => {
    // Calculate how many pages to show on each side of the current page
    const sidePages = Math.floor((maxVisiblePages - 3) / 2); // -3 for first, last, and current page

    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    // Adjust if we're near the beginning
    if (currentPage - sidePages < 2) {
      endPage = Math.min(totalPages - 1, 1 + maxVisiblePages - 2);
    }

    // Adjust if we're near the end
    if (currentPage + sidePages > totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    return { startPage, endPage };
  };

  // Get the URL for a specific page
  const getPageUrl = (page: number) => {
    if (!baseUrl) return '#';

    const url = new URL(baseUrl, window.location.origin);

    // Add page parameter
    url.searchParams.set('page', page.toString());

    // Add other query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    return url.pathname + url.search;
  };

  // Render page numbers based on the variant
  const renderPageNumbers = () => {
    const { startPage, endPage } = getVisiblePageRange();
    const pages = [];

    // First page
    pages.push(renderPageButton(1));

    // Show ellipsis if needed
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-start" className="px-2 py-2 text-gray-700" aria-hidden="true">
          ...
        </span>
      );
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPageButton(i));
    }

    // Show ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-end" className="px-2 py-2 text-gray-700" aria-hidden="true">
          ...
        </span>
      );
    }

    // Last page (if not the first page)
    if (totalPages > 1) {
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  // Render a single page button/link
  const renderPageButton = (pageNumber: number) => {
    const isCurrentPage = pageNumber === currentPage;
    const key = `page-${pageNumber}`;

    if (variant === 'links' && baseUrl) {
      return (
        <Link
          key={key}
          href={getPageUrl(pageNumber)}
          className={`
            flex items-center justify-center rounded-md
            ${getSizeClasses()}
            ${isCurrentPage
              ? 'bg-teal-600 text-white font-medium'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}
          `}
          aria-current={isCurrentPage ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(pageNumber);
          }}
        >
          {pageNumber}
        </Link>
      );
    }

    return (
      <Button
        key={key}
        onClick={() => onPageChange(pageNumber)}
        variant={isCurrentPage ? 'primary' : 'outline'}
        size={size === 'lg' ? 'md' : 'sm'}
        gradient={false}
        aria-current={isCurrentPage ? 'page' : undefined}
      >
        {pageNumber}
      </Button>
    );
  };

  // Get size classes based on the size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-sm';
      case 'lg':
        return 'h-12 w-12 text-lg';
      case 'md':
      default:
        return 'h-10 w-10 text-base';
    }
  };

  // Render the pagination component based on the variant
  const renderPagination = () => {
    if (variant === 'minimal') {
      return (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size={size === 'lg' ? 'md' : 'sm'}
            gradient={false}
            aria-label="Previous page"
          >
            Previous
          </Button>

          {showPageInfo && (
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          )}

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size={size === 'lg' ? 'md' : 'sm'}
            gradient={false}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size={size === 'lg' ? 'md' : 'sm'}
          gradient={false}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {renderPageNumbers()}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size={size === 'lg' ? 'md' : 'sm'}
          gradient={false}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <nav
      className={`flex items-center justify-center ${className}`}
      aria-label="Pagination"
      role="navigation"
    >
      {renderPagination()}

      {/* Show total items info if provided */}
      {totalItems !== undefined && (
        <div className="text-sm text-gray-500 mt-2 text-center">
          Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} to{' '}
          {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} items
        </div>
      )}
    </nav>
  );
};

export default Pagination;
