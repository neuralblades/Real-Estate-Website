'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Conversation } from '@/services/messageService';
import { getFullImageUrl } from '@/utils/imageUtils';

interface ConversationHeaderProps {
  conversation: Conversation;
  currentUserId: string;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation, currentUserId }) => {
  const { inquiry } = conversation;
  const isAgent = inquiry.property.agent?.id === currentUserId;
  
  // Determine who to show (if user is agent, show the inquirer, otherwise show the agent)
  const otherPerson = isAgent
    ? { 
        name: inquiry.name,
        avatar: inquiry.user?.avatar || '/images/ai-agent.jpg',
        email: inquiry.email,
        phone: inquiry.phone,
      }
    : {
        name: `${inquiry.property.agent?.firstName || ''} ${inquiry.property.agent?.lastName || ''}`,
        avatar: inquiry.property.agent?.avatar || '/images/ai-agent.jpg',
        email: '',
        phone: '',
      };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image
            src={getFullImageUrl(otherPerson.avatar)}
            alt={otherPerson.name}
            fill
            className="object-cover"
            sizes="40px"
            unoptimized
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900">{otherPerson.name}</h3>
          <div className="flex items-center text-xs text-gray-500">
            <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
              inquiry.status === 'new' ? 'bg-green-500' : 
              inquiry.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></span>
            <span className="capitalize">{inquiry.status}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Link
          href={`/properties/${inquiry.property.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span className="hidden sm:inline">View Property</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ConversationHeader;
