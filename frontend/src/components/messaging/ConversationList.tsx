'use client';

import React from 'react';
import Image from 'next/image';
import { Conversation } from '@/services/messageService';
import { getFullImageUrl } from '@/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}) => {
  return (
    <div className="border-r border-gray-200 w-full md:w-1/3 lg:w-1/4 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No conversations yet.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const { inquiry, latestMessage, unreadCount } = conversation;
            const isAgent = inquiry.property.agent?.id === currentUserId;
            
            // Determine who to show (if user is agent, show the inquirer, otherwise show the agent)
            const otherPerson = isAgent
              ? { 
                  name: inquiry.name,
                  avatar: inquiry.user?.avatar || '/images/ai-agent.jpg',
                }
              : {
                  name: `${inquiry.property.agent?.firstName || ''} ${inquiry.property.agent?.lastName || ''}`,
                  avatar: inquiry.property.agent?.avatar || '/images/ai-agent.jpg',
                };
            
            return (
              <li
                key={inquiry.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedConversationId === inquiry.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center p-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={getFullImageUrl(otherPerson.avatar)}
                      alt={otherPerson.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      unoptimized
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherPerson.name}
                      </h3>
                      {latestMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {latestMessage ? latestMessage.content : inquiry.message}
                      </p>
                      
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {inquiry.property.title}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
