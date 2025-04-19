'use client';

import api from './api';

// Types
export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  inquiryId: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    role: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    role: string;
  };
  inquiry?: {
    id: string;
    property: {
      id: string;
      title: string;
      mainImage: string;
    };
  };
}

export interface Conversation {
  inquiry: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'new' | 'in-progress' | 'resolved';
    createdAt: string;
    updatedAt: string;
    property: {
      id: string;
      title: string;
      mainImage: string;
      agent?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar: string;
      };
    };
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
  };
  latestMessage?: Message;
  unreadCount: number;
}

// Send a new message
export const sendMessage = async (inquiryId: string, content: string, receiverId: string) => {
  try {
    const response = await api.post('/messages', {
      inquiryId,
      content,
      receiverId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for an inquiry
export const getInquiryMessages = async (inquiryId: string) => {
  try {
    const response = await api.get(`/messages/inquiry/${inquiryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for inquiry ${inquiryId}:`, error);
    throw error;
  }
};

// Get all user's conversations
export const getUserConversations = async () => {
  try {
    const response = await api.get('/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]) => {
  try {
    const response = await api.put('/messages/read', { messageIds });
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadMessageCount = async () => {
  try {
    const response = await api.get('/messages/unread');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    throw error;
  }
};
