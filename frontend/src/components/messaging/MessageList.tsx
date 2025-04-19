'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Message } from '@/services/messageService';
import { getFullImageUrl } from '@/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto max-h-[500px]">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          const sender = message.sender;
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-3' : 'mr-3'}`}>
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={getFullImageUrl(sender?.avatar || '/images/ai-agent.jpg')}
                      alt={sender ? `${sender.firstName} ${sender.lastName}` : 'User'}
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Message content */}
                <div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      isCurrentUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
