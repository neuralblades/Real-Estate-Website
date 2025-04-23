import api from './api';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  specialties: string[];
  isLeadership: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberResponse {
  success: boolean;
  teamMembers: TeamMember[];
  message?: string;
}

export interface SingleTeamMemberResponse {
  success: boolean;
  teamMember: TeamMember;
  message?: string;
}

// Get all team members
export const getTeamMembers = async (): Promise<TeamMemberResponse> => {
  try {
    const response = await api.get('/team');
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return {
      success: false,
      teamMembers: [],
      message: 'Failed to fetch team members'
    };
  }
};

// Get leadership team
export const getLeadershipTeam = async (): Promise<TeamMemberResponse> => {
  try {
    const response = await api.get('/team/leadership');
    return response.data;
  } catch (error) {
    console.error('Error fetching leadership team:', error);
    return {
      success: false,
      teamMembers: [],
      message: 'Failed to fetch leadership team'
    };
  }
};

// Get team member by ID
export const getTeamMemberById = async (id: number): Promise<SingleTeamMemberResponse> => {
  try {
    const response = await api.get(`/team/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team member with ID ${id}:`, error);
    return {
      success: false,
      teamMember: {} as TeamMember,
      message: 'Failed to fetch team member'
    };
  }
};

// Create team member (admin only)
export const createTeamMember = async (formData: FormData): Promise<SingleTeamMemberResponse> => {
  try {
    const response = await api.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating team member:', error);
    return {
      success: false,
      teamMember: {} as TeamMember,
      message: 'Failed to create team member'
    };
  }
};

// Update team member (admin only)
export const updateTeamMember = async (id: number, formData: FormData): Promise<SingleTeamMemberResponse> => {
  try {
    const response = await api.put(`/team/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating team member with ID ${id}:`, error);
    return {
      success: false,
      teamMember: {} as TeamMember,
      message: 'Failed to update team member'
    };
  }
};

// Delete team member (admin only)
export const deleteTeamMember = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    return {
      success: false,
      message: 'Failed to delete team member'
    };
  }
};
