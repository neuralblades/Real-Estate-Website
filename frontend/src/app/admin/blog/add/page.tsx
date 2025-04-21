'use client';

import React from 'react';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const AddBlogPostPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // Redirect if not admin
  React.useEffect(() => {
    if (user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Blog Post</h1>
      </div>
      
      <BlogPostForm />
    </div>
  );
};

export default AddBlogPostPage;
