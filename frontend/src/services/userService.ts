'use client';

import api from './api';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  avatar?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

// Register a new user
export const registerUser = async (userData: RegisterData) => {
  try {
    const response = await api.post('/users', userData);

    // Save token to localStorage
    if (response.data.user.token) {
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    // Normal login flow
    const response = await api.post('/users/login', credentials);

    // Save token to localStorage
    if (response.data.user.token) {
      localStorage.setItem('token', response.data.user.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // Check if token is the test token (which is invalid)
  if (token === 'test-admin-token') {
    console.log('Removing invalid test admin token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }

  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData: FormData) => {
  try {
    const response = await api.put('/users/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.user.token) {
        localStorage.setItem('token', response.data.user.token);
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Save property to favorites
export const saveProperty = async (propertyId: string) => {
  try {
    const response = await api.post(`/users/save-property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error saving property ${propertyId}:`, error);
    throw error;
  }
};

// Remove property from favorites
export const removeSavedProperty = async (propertyId: string) => {
  try {
    const response = await api.delete(`/users/save-property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing property ${propertyId} from saved:`, error);
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post(`/users/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Admin Functions

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create new user (admin only)
export const createUser = async (userData: FormData) => {
  try {
    const response = await api.post('/users/admin', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId: string, userData: FormData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};
