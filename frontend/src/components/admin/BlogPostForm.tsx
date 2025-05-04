'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createBlogPost, updateBlogPost, getBlogPostById } from '@/services/blogService';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface BlogPostFormProps {
  postId?: string;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ postId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Real Estate',
    tags: '',
    status: 'draft',
    featuredImage: null as File | null
  });

  // Fetch post data if editing
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await getBlogPostById(postId);
          const post = response.post;

          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            tags: post.tags.join(', '),
            status: post.status,
            featuredImage: null
          });

          if (post.featuredImage) {
            // Use the direct URL to the backend for preview
            setImagePreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/blog/${post.featuredImage}`);
          }

          setError(null);
        } catch (err) {
          console.error(`Error fetching blog post with ID ${postId}:`, err);
          setError('Failed to load blog post');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [postId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, featuredImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create or edit a blog post');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create FormData object
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('category', formData.category);

      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      submitData.append('tags', JSON.stringify(tagsArray));

      submitData.append('status', formData.status);

      if (formData.featuredImage) {
        submitData.append('featuredImage', formData.featuredImage);
      }

      if (postId) {
        // Update existing post
        await updateBlogPost(postId, submitData);
        setSuccess('Blog post updated successfully');
      } else {
        // Create new post
        await createBlogPost(submitData);
        setSuccess('Blog post created successfully');

        // Reset form after successful creation
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          category: 'Real Estate',
          tags: '',
          status: 'draft',
          featuredImage: null
        });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

      // Redirect to blog post list after a delay
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (err) {
      console.error('Error submitting blog post:', err);
      setError('Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md">
          <p>{success}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post title"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={15}
          value={formData.content}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your post content here..."
          required
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          HTML is supported for formatting.
        </p>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of the post (shown in listings)"
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          If left empty, an excerpt will be generated from the content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Real Estate">Real Estate</option>
            <option value="Market Trends">Market Trends</option>
            <option value="Buying Tips">Buying Tips</option>
            <option value="Selling Tips">Selling Tips</option>
            <option value="Home Improvement">Home Improvement</option>
            <option value="Investment">Investment</option>
            <option value="Luxury Properties">Luxury Properties</option>
            <option value="News">News</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags separated by commas"
          />
        </div>
      </div>

      <div>
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image
        </label>
        <input
          type="file"
          id="featuredImage"
          name="featuredImage"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/jpeg,image/png,image/webp"
        />
        <p className="mt-1 text-sm text-gray-500">
          Recommended size: 1200 x 800 pixels. Max file size: 5MB.
        </p>

        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
            <div className="relative h-48 w-full md:w-1/2 overflow-hidden rounded-md">
              <OptimizedImage
                src={imagePreview}
                alt="Featured image preview"
                fill
                className="object-cover"
                objectFit="cover"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default BlogPostForm;
