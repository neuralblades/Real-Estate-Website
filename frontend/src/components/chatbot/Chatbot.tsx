'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ChatbotMessage, { ChatMessage } from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import {
  generateBotMessage,
  generateUserMessage,
  generateAgentMessage,
  getGreetingResponse,
  detectIntent,
  generateResponse,
  submitInquiry,
  ChatbotConversationState
} from '@/services/chatbotService';
import { createGeneralInquiry } from '@/services/inquiryService';
import { Property } from '@/services/propertyService';
import { useAuth } from '@/contexts/AuthContext';

interface ChatbotProps {
  currentProperty?: Property;
  onRequestAgent?: () => void;
}

// Using the ChatbotConversationState interface from chatbotService

const Chatbot: React.FC<ChatbotProps> = ({ currentProperty, onRequestAgent }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [conversationState, setConversationState] = useState<ChatbotConversationState>({
    collectingUserInfo: false,
    stage: 'greeting',
    explicitlyAskedForName: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize chatbot with greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = generateBotMessage(getGreetingResponse());
      setMessages([greeting]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle user message
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = generateUserMessage(content);
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Detect intent and generate response
    const intent = detectIntent(content, conversationState);

    // Update conversation state based on intent
    const updatedState = { ...conversationState };

    // Only set collecting user info if user explicitly wants to contact agent, buy, or sell
    if (intent === 'AGENT_CONTACT' || intent === 'BUY_INTENT' || intent === 'SELL_INTENT' || intent === 'VIEW_LISTINGS') {
      updatedState.collectingUserInfo = true;
      updatedState.stage = 'collecting_info';
      updatedState.explicitlyAskedForName = true; // Mark that we've explicitly asked for name
      if (intent === 'BUY_INTENT' && currentProperty) {
        updatedState.propertyInterest = currentProperty.title;
      }
    }

    // Only process as name if we're explicitly collecting user info AND have explicitly asked for name
    else if (intent === 'NAME_PROVIDED' && updatedState.collectingUserInfo && updatedState.explicitlyAskedForName && !updatedState.userName) {
      updatedState.userName = content;
      // After collecting the name, we no longer need to ask for it
      updatedState.explicitlyAskedForName = false;
    }

    // Process phone numbers only if we're collecting info and have a name
    else if (intent === 'PHONE_PROVIDED' && updatedState.collectingUserInfo && updatedState.userName && !updatedState.userPhone) {
      updatedState.userPhone = content;

      // Submit inquiry immediately after getting phone number
      if (updatedState.userName && updatedState.userPhone) {
        // If we have a specific property, submit inquiry for that property
        if (currentProperty) {
          submitInquiry(
            currentProperty.id,
            updatedState.userName,
            'email_not_provided@placeholder.com', // placeholder email
            `Chatbot inquiry for ${currentProperty.title || 'property'}. Phone: ${content}. Interest: ${updatedState.propertyInterest || 'General inquiry'}`
          ).catch(err => console.error('Error submitting inquiry:', err));
        }
        // Otherwise submit a general inquiry
        else {
          // Submit to our general inquiry service
          createGeneralInquiry({
            name: updatedState.userName,
            phone: content,
            propertyType: updatedState.propertyType,
            bedroomCount: updatedState.bedroomCount,
            propertyInterest: updatedState.propertyInterest || 'General inquiry',
            message: `Client interested in: ${updatedState.propertyInterest || updatedState.propertyType || updatedState.bedroomCount + ' bedroom property' || 'real estate'}`
          }).catch(err => console.error('Error submitting general inquiry:', err));
        }

        updatedState.stage = 'inquiry_submitted';
      }
    }

    // Process emails only if we're collecting info and have a name and phone
    else if (intent === 'EMAIL_PROVIDED' && updatedState.collectingUserInfo && updatedState.userName && updatedState.userPhone && !updatedState.userEmail) {
      updatedState.userEmail = content;

      // If we have name, phone, and email, submit inquiry
      if (updatedState.userName && updatedState.userPhone && currentProperty) {
        // Submit inquiry in the background
        submitInquiry(
          currentProperty.id,
          updatedState.userName,
          content, // email
          `Chatbot inquiry for ${currentProperty.title}. Phone: ${updatedState.userPhone}`
        ).catch(err => console.error('Error submitting inquiry:', err));

        updatedState.stage = 'inquiry_submitted';
      }
    } else if (intent === 'PROPERTY_TYPE') {
      updatedState.propertyType = content;
    } else if (intent === 'BEDROOM_COUNT') {
      updatedState.bedroomCount = content;
    }

    setConversationState(updatedState);

    // Simulate typing delay
    setTimeout(() => {
      // Generate bot response
      // Store property type and bedroom count in state
      if (intent === 'PROPERTY_TYPE') {
        updatedState.propertyType = content.trim();
      }
      else if (intent === 'BEDROOM_COUNT') {
        // Store the bedroom count in the state
        updatedState.bedroomCount = content.trim();
      }

      const responseContent = generateResponse(intent, content, updatedState, currentProperty);
      const botResponse = generateBotMessage(responseContent);

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // If inquiry was submitted, add agent message
      if (updatedState.stage === 'inquiry_submitted' && currentProperty?.agent) {
        setTimeout(() => {
          setIsTyping(true);

          setTimeout(() => {
            const agentName = `${currentProperty.agent?.firstName || ''} ${currentProperty.agent?.lastName || ''}`.trim();
            const agentMessage = generateAgentMessage(
              `Hello ${updatedState.userName}, I'm ${agentName}, the listing agent for this property. I'll contact you shortly at ${updatedState.userPhone} and ${updatedState.userEmail} to discuss your interest in ${currentProperty.title}.`,
              agentName,
              currentProperty.agent?.avatar
            );

            setMessages(prev => [...prev, agentMessage]);
            setIsTyping(false);
          }, 1500);
        }, 1000);
      }

      // If agent contact is requested and we have a callback
      if (intent === 'AGENT_CONTACT' && onRequestAgent) {
        setTimeout(() => {
          onRequestAgent();
        }, 1000);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-gray-500 to-gray-900 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-500 to-gray-900 text-white p-4">
            <h3 className="font-bold">Luxury Estates Assistant</h3>
            <p className="text-xs text-gray-300">Ask me anything about properties</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <ChatbotMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src="/images/ai-agent.jpg"
                      alt="Chatbot"
                      className="h-full w-full object-cover"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatbotInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            placeholder={user ? "Type your message..." : "Type your message or log in to contact an agent"}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
