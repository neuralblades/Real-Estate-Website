"use client";
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import SearchInput from '@/components/search/SearchInput';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import Pagination from '@/components/ui/Pagination';
import { getProperties, PropertyFilter, Property } from '@/services/propertyService';
import { ITEMS_PER_PAGE } from '@/config/constants';

export default function OffPlanPropertiesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filters, setFilters] = useState<PropertyFilter>({
    isOffplan: true,
    page: parseInt(searchParams.get('page') || '1', 10),
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    location: searchParams.get('location') || '',
    keyword: searchParams.get('keyword') || '',
  });

  // Fetch properties with current filters
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await getProperties(filters);
      if (response.success && response.properties.length > 0) {
        setProperties(response.properties);
        setTotalPages(response.pages);
        setCurrentPage(response.page);
        setTotalItems(response.total || response.properties.length);

        // Update URL with current filters for bookmarking and sharing
        updateUrlWithFilters(filters);
      } else {
        setProperties([]);
        setError('No off-plan properties found matching your criteria.');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Update URL with current filters without page reload
  const updateUrlWithFilters = (currentFilters: PropertyFilter) => {
    const params = new URLSearchParams();

    // Only add parameters that have values
    if (currentFilters.page && currentFilters.page > 1) params.set('page', currentFilters.page.toString());
    if (currentFilters.type) params.set('type', currentFilters.type);
    if (currentFilters.location) params.set('location', currentFilters.location);
    if (currentFilters.minPrice) params.set('minPrice', currentFilters.minPrice.toString());
    if (currentFilters.maxPrice) params.set('maxPrice', currentFilters.maxPrice.toString());
    if (currentFilters.bedrooms) params.set('bedrooms', currentFilters.bedrooms.toString());
    if (currentFilters.keyword) params.set('keyword', currentFilters.keyword);

    // Update URL without refreshing the page
    const newUrl = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: PropertyFilter) => {
    setFilters({ ...filters, ...newFilters, page: 1, isOffplan: true });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page, isOffplan: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProperties();
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 1, isOffplan: true });
    fetchProperties();
  };

  // Apply filters and fetch properties
  const applyFilters = () => {
    fetchProperties();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex text-gray-600 text-sm">
          <Link href="/" className="hover:text-blue-600 transition duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-blue-600 transition duration-300">Properties</Link>
          <span className="mx-2">/</span>
        </nav>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Off Plan Properties</h1>
        <p className="text-gray-600 mb-4">
        Discover our exclusive collection of off-plan properties in Dubai. Invest in the future with these upcoming developments offering modern designs and premium amenities.
        </p>
        <div className="flex space-x-4">
          <Button
            href="/properties"
            variant="outline"
            size="lg"
          >
            Ready Properties
          </Button>
          <Button
            href="/properties/offplan"
            variant="accent"
            size="lg"
          >
            Off Plan Properties
          </Button>
        </div>
      </div>
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col space-y-2">
            <div className="w-full">
              <SearchInput
                placeholder="Search by location, project name, or keyword..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            <AdvancedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
            />
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mb-8">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-600 mb-8">No off-plan properties found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                imageUrl={property.mainImage}
                featured={property.featured}
                isOffplan={true}
                agent={property.agent}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="buttons"
              size="md"
              baseUrl="/properties/offplan"
              queryParams={{
                type: filters.type || '',
                location: filters.location || '',
                keyword: filters.keyword || '',
                ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
                ...(filters.bedrooms && { bedrooms: filters.bedrooms.toString() }),
              }}
              showPageInfo={true}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              className="mb-8"
            />
          </div>
        )}
    </div>
  );
}
