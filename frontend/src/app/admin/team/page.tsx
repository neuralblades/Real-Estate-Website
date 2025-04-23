'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getTeamMembers, deleteTeamMember, TeamMember } from '@/services/teamService';
import Button from '@/components/ui/Button';
import { FaEdit, FaTrash, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
// import AdminLayout from '@/components/admin/AdminLayout';

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTeamMembers();
      if (response.success) {
        setTeamMembers(response.teamMembers);
      } else {
        setError(response.message || 'Failed to fetch team members');
      }
    } catch (err) {
      setError('An error occurred while fetching team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteTeamMember(memberToDelete.id);
      if (response.success) {
        setTeamMembers(teamMembers.filter(m => m.id !== memberToDelete.id));
        setShowDeleteModal(false);
      } else {
        setError(response.message || 'Failed to delete team member');
      }
    } catch (err) {
      setError('An error occurred while deleting the team member');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddMember = () => {
    router.push('/admin/team/add');
  };

  const handleEditMember = (id: number) => {
    router.push(`/admin/team/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
          <Button
            onClick={handleAddMember}
            variant="primary"
            gradient={true}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Add Team Member
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No team members found.</p>
            <Button onClick={handleAddMember} variant="primary" size="sm">
              Add Your First Team Member
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Leadership</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden relative">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-gray-600">{member.role}</td>
                    <td className="py-3 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3 px-4">
                      {member.isLeadership ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.order}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMember(member.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(member)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete {memberToDelete?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="primary"
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
