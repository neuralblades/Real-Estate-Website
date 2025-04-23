'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getTeamMemberById, updateTeamMember, TeamMember } from '@/services/teamService';
import Button from '@/components/ui/Button';
// import AdminLayout from '@/components/admin/AdminLayout';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';

interface EditTeamMemberPageProps {
  params: {
    id: string;
  };
}

export default function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    isLeadership: false,
    order: 0,
    linkedin: '',
    twitter: '',
    instagram: '',
  });

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await getTeamMemberById(Number(id));
        if (response.success) {
          const { teamMember } = response;
          setFormData({
            name: teamMember.name,
            role: teamMember.role,
            bio: teamMember.bio || '',
            email: teamMember.email || '',
            phone: teamMember.phone || '',
            isLeadership: teamMember.isLeadership,
            order: teamMember.order,
            linkedin: teamMember.social?.linkedin || '',
            twitter: teamMember.social?.twitter || '',
            instagram: teamMember.social?.instagram || '',
          });

          setSpecialties(teamMember.specialties || []);
          setImagePreview(teamMember.image || null);
        } else {
          setError('Failed to fetch team member details');
        }
      } catch (err) {
        setError('An error occurred while fetching team member details');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('role', formData.role);
      submitFormData.append('bio', formData.bio);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('isLeadership', String(formData.isLeadership));
      submitFormData.append('order', String(formData.order));

      // Add social media links
      const social = {
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        instagram: formData.instagram,
      };
      submitFormData.append('social', JSON.stringify(social));

      // Add specialties
      submitFormData.append('specialties', JSON.stringify(specialties));

      // Add image if available
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const response = await updateTeamMember(Number(id), submitFormData);

      if (response.success) {
        setSuccess('Team member updated successfully!');
        setTimeout(() => {
          router.push('/admin/team');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update team member');
      }
    } catch (err) {
      setError('An error occurred while updating the team member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/admin/team')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Team Member</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  Profile Image
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Current Image
                  </label>
                  {imagePreview ? (
                    <div className="relative h-40 w-40 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Current"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Upload New Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep the current image.
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  Social Media
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
              Specialties
            </h2>

            <div className="mb-4 flex">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700"
              >
                <FaPlus />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-gray-800 text-sm">{specialty}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {specialties.length === 0 && (
                <p className="text-gray-500 text-sm">No specialties added yet.</p>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
              Additional Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isLeadership"
                    checked={formData.isLeadership}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Leadership Team Member</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers will be displayed first.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => router.push('/admin/team')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              gradient={true}
              isLoading={loading}
            >
              Update Team Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
