'use client';

import React from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { BlogPost } from '@/services/blogService';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'default' }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Truncate excerpt for compact variant
  const truncateExcerpt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (variant === 'featured') {
    return (
      <div className="group relative h-full overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <OptimizedImage
            src={post.featuredImage || '/placeholder.png'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false} // Set to false to ensure fade-in effect
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2 flex items-center space-x-2">
            <span className="rounded-full bg-[#a49650] shadow-lg px-3 py-1 text-xs font-medium">{post.category}</span>
            <span className="text-sm opacity-80">{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block group-hover:text-blue-300 transition-colors duration-500">
            <h3 className="mb-2 text-xl font-bold leading-tight transition-all duration-500">{post.title}</h3>
          </Link>

          <p className="mb-4 text-sm opacity-90">{truncateExcerpt(post.excerpt, 120)}</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-start space-x-4 group">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          <OptimizedImage
            src={post.featuredImage || '/placeholder.png'}
            alt={post.title}
            fill
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 will-change-transform"
            objectFit="cover"
            sizes="64px"
            priority={false} // Set to false to ensure fade-in effect
          />
        </div>

        <div className="flex-grow">
          <Link href={`/blog/${post.slug}`} className="block hover:text-blue-600 transition-colors duration-500">
            <h4 className="mb-1 font-medium leading-tight transition-all duration-500">{post.title}</h4>
          </Link>
          <p className="text-xs text-gray-500">{formatDate(post.publishedAt || post.createdAt)}</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <OptimizedImage
          src={post.featuredImage || '/placeholder.png'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false} // Set to false to ensure fade-in effect
        />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">{post.category}</span>
          <span className="text-xs text-gray-500">{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block hover:text-blue-600 transition-colors duration-500">
          <h3 className="mb-2 text-xl font-bold leading-tight transition-all duration-500">{post.title}</h3>
        </Link>

        <p className="mb-4 text-gray-600">{truncateExcerpt(post.excerpt, 150)}</p>
      </div>
    </div>
  );
};

export default BlogCard;
