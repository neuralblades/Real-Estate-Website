'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getDevelopers, deleteDeveloper } from '@/services/developerService';

import { useToast } from '@/contexts/ToastContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface Developer {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  established?: string;
  headquarters?: string;
  featured: boolean;
  slug: string;
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDevelopers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await getDevelopers();
      setDevelopers(response.developers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching developers:', error);
      showToast('Failed to load developers', 'error');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDeveloper(deleteId);
      showToast('Developer deleted successfully', 'success');
      fetchDevelopers();
    } catch (error) {
      console.error('Error deleting developer:', error);
      showToast('Failed to delete developer', 'error');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Developers</h1>
          <Button
            href="/admin/developers/new"
            variant="primary"
            gradient={true}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Add Developer
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Developer
                </th>
                <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Established
                </th>
                <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Headquarters
                </th>
                <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Featured
                </th>
                <th scope="col" className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {developers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <p className="text-gray-600 mb-4">No developers found.</p>
                      <Button href="/admin/developers/new" variant="primary" size="sm">
                        Add Your First Developer
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                developers.map((developer) => (
                  <tr key={developer.id}>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {developer.logo ? (
                            <OptimizedImage
                              src={developer.logo}
                              alt={developer.name}
                              fill
                              className="object-contain"
                              objectFit="contain"
                              sizes="40px"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-teal-700 font-medium">{developer.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{developer.name}</div>
                          {developer.website && (
                            <div className="text-sm text-gray-500">
                              <a
                                href={developer.website.startsWith('http') ? developer.website : `https://${developer.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:underline"
                              >
                                {developer.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                      {developer.established || 'N/A'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                      {developer.headquarters || 'N/A'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {developer.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/developers/edit/${developer.id}`}
                          className="text-teal-600 hover:text-teal-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(developer.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <Link
                          href={`/developers/${developer.slug}`}
                          target="_blank"
                          className="text-teal-600 hover:text-teal-800"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Developer"
        message="Are you sure you want to delete this developer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
