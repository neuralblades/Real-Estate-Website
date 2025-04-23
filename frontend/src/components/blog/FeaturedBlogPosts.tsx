'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import { getFeaturedBlogPosts, BlogPost } from '@/services/blogService';

const FeaturedBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        try {
          const response = await getFeaturedBlogPosts(3);
          setPosts(response.posts || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching featured blog posts:', err);
          // Don't show error to user, just set empty posts
          setPosts([]);
          setError(null);
        }
      } catch (err) {
        console.error('Error in featured blog posts component:', err);
        setError('Failed to load featured blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-xl bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
          <Link
            href="/blog"
            className="rounded-md bg-gradient-to-r from-gray-500 to-gray-900 px-4 py-2 text-sm font-medium text-white shadow:lg transition-colors hover:bg-blue-700"
          >
            View All Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogPosts;
