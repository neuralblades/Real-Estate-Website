'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getBlogPosts, deleteBlogPost, BlogPost, getBlogImageUrl } from '@/services/blogService';
import Button from '@/components/ui/Button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminBlogPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      router.push('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        try {
          const response = await getBlogPosts({ limit: 100 });
          setPosts(response.posts || []);
          setError(null);
        } catch (err) {
          console.error('Error fetching blog posts:', err);
          setPosts([]);
          setError('Failed to load blog posts. The blog feature might not be fully set up yet.');
        }
      } catch (err) {
        console.error('Error in admin blog page component:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, isAdmin, router]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setDeleteConfirmation(id);
  };

  // Handle delete cancellation
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Handle delete post
  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await deleteBlogPost(id);
      setPosts(posts.filter(post => post.id !== id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error(`Error deleting blog post with ID ${id}:`, err);
      setError('Failed to delete blog post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
          <Button
            href="/admin/blog/add"
            variant="primary"
            gradient={true}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Post
          </Button>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Post
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Author
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Views
              </th>
              <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <p className="text-gray-600 mb-4">No blog posts found.</p>
                      <Button href="/admin/blog/add" variant="primary" size="sm">
                        Add Your First Post
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={getBlogImageUrl(post.featuredImage)}
                            alt={post.title}
                            fill
                            className="object-cover rounded-md"
                            sizes="40px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-teal-600">
                              {post.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.excerpt.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown'}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                      {post.viewCount}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      {deleteConfirmation === post.id ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleDelete(post.id)}
                            variant="primary"
                            size="sm"
                            isLoading={deleting}
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={cancelDelete}
                            variant="outline"
                            size="sm"
                            disabled={deleting}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="text-teal-600 hover:text-teal-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => confirmDelete(post.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPage;
