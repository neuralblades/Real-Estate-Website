'use client';

import React, { useState, useEffect, Usable } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { getBlogPostBySlug, getBlogImageUrl, addBlogComment, BlogPost } from '@/services/blogService';

interface BlogPostDetailClientProps {
  slug: string;
}

const BlogPostDetailClient: React.FC<BlogPostDetailClientProps> = ({ slug }) => {
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        try {
          const response = await getBlogPostBySlug(slug);
          if (response && response.post) {
            setPost(response.post);
            setError(null);
          } else {
            setPost(null);
            setError('Blog post not found');
          }
        } catch (err) {
          console.error(`Error fetching blog post with slug ${slug}:`, err);
          setPost(null);
          setError('Failed to load blog post. The blog feature might not be fully set up yet.');
        }
      } catch (err) {
        console.error('Error in blog post detail component:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setCommentError('You must be logged in to comment');
      return;
    }

    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError(null);

      await addBlogComment(post!.id, commentContent);

      setCommentContent('');
      setCommentSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setCommentSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setCommentError('Failed to submit comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-3/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-800">
          <h2 className="mb-2 text-xl font-bold">Error Loading Article</h2>
          <p>{error || 'Blog post not found'}</p>
          <Link
            href="/blog"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="transition duration-300 hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="transition duration-300 hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="transition duration-300 hover:text-blue-600"
            >
              {post.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="overflow-hidden rounded-xl bg-white shadow-md">
              {/* Featured Image */}
              <div className="relative h-96 w-full">
                <Image
                  src={getBlogImageUrl(post.featuredImage)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                />
              </div>

              {/* Article Content */}
              <div className="p-8">
                {/* Category and Date */}
                <div className="mb-4 flex items-center justify-between">
                  <Link
                    href={`/blog?category=${encodeURIComponent(post.category)}`}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
                  >
                    {post.category}
                  </Link>
                  <time className="text-sm text-gray-500">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                </div>

                {/* Title */}
                <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  {post.title}
                </h1>

                {/* Content */}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="mb-3 text-lg font-bold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-lg font-bold">Share This Article</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                      className="flex items-center rounded-md bg-[#1DA1F2] px-4 py-2 text-white transition-opacity hover:opacity-90"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </button>
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="flex items-center rounded-md bg-[#4267B2] px-4 py-2 text-white transition-opacity hover:opacity-90"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank')}
                      className="flex items-center rounded-md bg-[#0A66C2] px-4 py-2 text-white transition-opacity hover:opacity-90"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 rounded-xl bg-white p-8 shadow-md">
              <h2 className="mb-6 text-2xl font-bold">Comments</h2>

              {/* Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="mb-4">
                    <label htmlFor="comment" className="mb-2 block font-medium text-gray-700">
                      Leave a Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Share your thoughts..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {commentError && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                      {commentError}
                    </div>
                  )}

                  {commentSuccess && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                      Your comment has been submitted and is pending approval.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={commentSubmitting}
                  >
                    {commentSubmitting ? 'Submitting...' : 'Submit Comment'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 rounded-md bg-blue-50 p-4 text-blue-800">
                  <p>
                    Please{' '}
                    <Link href="/login" className="font-medium text-blue-600 underline">
                      log in
                    </Link>{' '}
                    to leave a comment.
                  </p>
                </div>
              )}

              {/* Comments List */}
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center">
                        <div className="relative mr-3 h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={comment.user?.avatar || '/images/default-avatar.png'}
                            alt={comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

// Server component that passes the slug to the client component
export default function BlogPostDetailPage({ params }: { params: Usable<{ slug: string }> }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  return <BlogPostDetailClient slug={slug} />;
}
