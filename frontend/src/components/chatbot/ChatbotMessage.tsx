'use client';

import React from 'react';
import Image from 'next/image';
import { getFullImageUrl } from '@/utils/imageUtils';

export type MessageType = 'user' | 'bot' | 'agent';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface ChatbotMessageProps {
  message: ChatMessage;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#f3ecd3]">
            {message.type === 'agent' && message.sender?.avatar ? (
              <Image
                src={getFullImageUrl(message.sender.avatar)}
                alt={message.sender?.name || 'Agent'}
                fill
                className="object-cover"
                sizes="32px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-900 text-white text-xs font-bold">
                {message.type === 'agent' ? 'A' : 'AI'}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? 'bg-gradient-to-r from-gray-500 to-gray-900 text-white' : message.type === 'agent' ? 'bg-[#efeadb] text-gray-800' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2 ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
        {message.type === 'agent' && message.sender && (
          <div className="text-xs font-semibold text-[#a59969] mb-1">
            {message.sender.name}
          </div>
        )}
        <p className="text-sm">{message.content}</p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-900 text-white text-xs font-bold">
              YOU
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotMessage;
