'use client';

import React, { useState, useEffect } from 'react';
import {
  getUserConversations,
  getInquiryMessages,
  sendMessage,
  markMessagesAsRead,
  Conversation,
  Message
} from '@/services/messageService';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationHeader from './ConversationHeader';

interface MessagingProps {
  currentUserId: string;
  initialInquiryId?: string;
}

const Messaging: React.FC<MessagingProps> = ({ currentUserId, initialInquiryId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations and periodically refresh
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const isInitialLoad = loading;
        if (isInitialLoad) {
          setLoading(true);
        }

        const response = await getUserConversations();
        if (response.success) {
          setConversations(response.conversations);

          // If initialInquiryId is provided, select that conversation (only on initial load)
          if (isInitialLoad) {
            if (initialInquiryId) {
              const initialConversation = response.conversations.find(
                (conv: Conversation) => conv.inquiry.id === initialInquiryId
              );
              if (initialConversation) {
                setSelectedConversation(initialConversation);
              }
            } else if (response.conversations.length > 0) {
              // Otherwise select the first conversation
              setSelectedConversation(response.conversations[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        if (loading) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchConversations();

    // Set up interval to refresh conversations
    const intervalId = setInterval(fetchConversations, 20000); // Refresh every 20 seconds

    return () => clearInterval(intervalId);
  }, [initialInquiryId, loading]);

  // Fetch messages when selected conversation changes and periodically refresh
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const response = await getInquiryMessages(selectedConversation.inquiry.id);
        if (response.success) {
          setMessages(response.messages);

          // Mark unread messages as read
          const unreadMessageIds = response.messages
            .filter((msg: Message) => !msg.isRead && msg.receiverId === currentUserId)
            .map((msg: Message) => msg.id);

          if (unreadMessageIds.length > 0) {
            await markMessagesAsRead(unreadMessageIds);

            // Update unread count in conversations
            setConversations(prevConversations =>
              prevConversations.map(conv =>
                conv.inquiry.id === selectedConversation.inquiry.id
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up interval to refresh messages
    const intervalId = setInterval(fetchMessages, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [selectedConversation, currentUserId]);

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    try {
      setSendingMessage(true);

      // Determine receiver ID (if user is agent, send to inquirer, otherwise send to agent)
      const isAgent = selectedConversation.inquiry.property.agent?.id === currentUserId;
      const receiverId = isAgent
        ? selectedConversation.inquiry.user?.id || ''
        : selectedConversation.inquiry.property.agent?.id || '';

      if (!receiverId) {
        setError('Cannot determine message recipient.');
        return;
      }

      const response = await sendMessage(
        selectedConversation.inquiry.id,
        content,
        receiverId
      );

      if (response.success) {
        // Add new message to the list
        setMessages(prevMessages => [...prevMessages, response.message]);

        // Update the conversation with the latest message
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.inquiry.id === selectedConversation.inquiry.id
              ? {
                  ...conv,
                  latestMessage: response.message,
                  inquiry: {
                    ...conv.inquiry,
                    status: 'in-progress'
                  }
                }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Loading state
  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a49650]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.inquiry.id || null}
          onSelectConversation={handleSelectConversation}
          currentUserId={currentUserId}
        />

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <ConversationHeader
                conversation={selectedConversation}
                currentUserId={currentUserId}
              />

              {/* Messages */}
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
              />

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sendingMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <p className="mb-2">Select a conversation to start messaging</p>
                {conversations.length === 0 && (
                  <p className="text-sm">
                    No conversations yet. Start by inquiring about a property.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
