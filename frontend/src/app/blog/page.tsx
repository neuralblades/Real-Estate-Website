'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Pagination from '@/components/ui/Pagination';
import { getBlogPosts, BlogPost, BlogFilter } from '@/services/blogService';

const BlogPage: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  // Get filter params from URL
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const filters: BlogFilter = {
          page,
          limit: 9,
          category,
          tag,
          search,
          status: 'published'
        };

        try {
          const response = await getBlogPosts(filters);

          setPosts(response.posts || []);
          setTotalPages(response.totalPages || 1);
          setCurrentPage(response.currentPage || 1);
          setHasMore(response.hasMore || false);
          setTotalPosts(response.count || 0);
          setError(null);
        } catch (err) {
          console.error('Error fetching blog posts:', err);
          // Set default values
          setPosts([]);
          setTotalPages(1);
          setCurrentPage(1);
          setHasMore(false);
          setTotalPosts(0);
          setError('Failed to load blog posts. The blog feature might not be fully set up yet.');
        }
      } catch (err) {
        console.error('Error in blog page component:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, category, tag, search]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Update URL with new page number
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    if (search) params.set('search', search);

    // Update URL without refreshing the page
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update current page state
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition duration-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Blog</span>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Category: {category}</span>
              </>
            )}
            {tag && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Tag: {tag}</span>
              </>
            )}
            {search && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Search: {search}</span>
              </>
            )}
          </nav>
        </div>

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            {category ? `${category} Articles` :
             tag ? `Articles Tagged "${tag}"` :
             search ? `Search Results for "${search}"` :
             'Our Blog'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {category ? `Browse our latest articles in the ${category} category` :
             tag ? `Browse articles related to ${tag}` :
             search ? `Found ${totalPosts} articles matching your search` :
             'Insights, tips, and news from the real estate world'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-80 animate-pulse rounded-xl bg-gray-200"></div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-800">
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-md">
                <h3 className="mb-2 text-xl font-bold">No Articles Found</h3>
                <p className="mb-4 text-gray-600">
                  {search
                    ? `We couldn't find any articles matching "${search}"`
                    : category
                    ? `No articles found in the ${category} category`
                    : tag
                    ? `No articles found with the tag "${tag}"`
                    : 'No articles have been published yet'}
                </p>
                <Link
                  href="/blog"
                  className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  View All Articles
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      variant="links"
                      size="md"
                      baseUrl="/blog"
                      queryParams={{
                        ...(category && { category }),
                        ...(tag && { tag }),
                        ...(search && { search })
                      }}
                      showPageInfo={true}
                      totalItems={totalPosts}
                      itemsPerPage={9} // Matches the limit in the filter
                      className="mb-8"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar currentCategory={category} currentTag={tag} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
