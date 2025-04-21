'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getRecentBlogPosts,
  getBlogCategories,
  getBlogTags,
  BlogPost,
  getBlogImageUrl
} from '@/services/blogService';

interface BlogSidebarProps {
  currentCategory?: string;
  currentTag?: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ currentCategory, currentTag }) => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setLoading(true);

        try {
          // Fetch data in parallel with error handling for each request
          const [recentResponse, categoriesResponse, tagsResponse] = await Promise.all([
            getRecentBlogPosts(5).catch(() => ({ posts: [] })),
            getBlogCategories().catch(() => ({ categories: [] })),
            getBlogTags().catch(() => ({ tags: [] }))
          ]);

          setRecentPosts(recentResponse.posts || []);
          setCategories(categoriesResponse.categories || []);
          setTags(tagsResponse.tags || []);
        } catch (error) {
          console.error('Error fetching blog sidebar data:', error);
          // Set empty arrays as fallback
          setRecentPosts([]);
          setCategories([]);
          setTags([]);
        }
      } catch (error) {
        console.error('Error in blog sidebar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg bg-gray-100 p-6">
          <h3 className="mb-4 text-lg font-bold">Recent Posts</h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex animate-pulse space-x-3">
                <div className="h-16 w-16 rounded bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-bold">Search</h3>
        <form action="/blog" method="get">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search articles..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-bold">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex space-x-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={getBlogImageUrl(post.featuredImage)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-bold">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className={`flex items-center justify-between ${
                    currentCategory === category
                      ? 'font-medium text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span>{category}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {recentPosts.filter((post) => post.category === category).length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-bold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  currentTag === tag.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name} ({tag.count})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="rounded-lg bg-blue-50 p-6 shadow-md">
        <h3 className="mb-2 text-lg font-bold text-blue-900">Subscribe to Our Newsletter</h3>
        <p className="mb-4 text-sm text-blue-800">
          Get the latest real estate news and updates delivered to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full rounded-md border border-blue-200 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;
