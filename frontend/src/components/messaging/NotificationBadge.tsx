'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUnreadMessageCount } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadMessageCount();
        if (response.success) {
          setUnreadCount(response.unreadCount);
        }
      } catch (err) {
        console.error('Error fetching unread message count:', err);
      }
    };

    // Fetch initially
    fetchUnreadCount();

    // Set up interval to check for new messages
    const intervalId = setInterval(fetchUnreadCount, 15000); // Check every 15 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  if (!user || unreadCount === 0) {
    return (
      <Link href="/messages" className={`text-gray-600 hover:text-blue-600 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </Link>
    );
  }

  return (
    <Link href="/messages" className={`relative text-gray-600 hover:text-blue-600 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-medium text-white">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </Link>
  );
};

export default NotificationBadge;
