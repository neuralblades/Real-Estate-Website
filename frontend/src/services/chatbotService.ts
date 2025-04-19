'use client';

import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chatbot/ChatbotMessage';
import { createInquiry } from './inquiryService';
import { Property } from './propertyService';

// Predefined responses
const GREETING_RESPONSES = [
  "Hello! Welcome to Luxury Estates. How can I help you today?",
  "Hi there! I'm your real estate assistant. What are you looking for?",
  "Welcome to Luxury Estates! I can help you find your dream property. What are you interested in?"
];

const FALLBACK_RESPONSES = [
  "I'm not sure I understand. Could you rephrase that?",
  "I'm still learning. Can you try asking in a different way?",
  "I didn't quite catch that. Would you like to speak with a real agent instead?"
];

// Keywords for intent recognition
const INTENTS = {
  PROPERTY_SEARCH: ['find', 'search', 'looking for', 'property', 'house', 'apartment', 'condo', 'buy', 'rent', 'purchase', 'want to buy', 'interested in buying', 'looking to buy'],
  PRICE_INQUIRY: ['price', 'cost', 'how much', 'afford', 'budget', 'expensive', 'cheap', 'pricing', 'worth', 'value'],
  LOCATION_INQUIRY: ['where', 'location', 'area', 'neighborhood', 'city', 'near', 'close to', 'address', 'located'],
  AGENT_CONTACT: ['agent', 'speak', 'talk', 'contact', 'call', 'message', 'human', 'person', 'representative', 'sales'],
  VIEWING_REQUEST: ['view', 'visit', 'tour', 'see', 'schedule', 'appointment', 'showing', 'look at', 'check out', 'inspect'],
  GREETING: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'],
  HELP: ['help', 'assist', 'support', 'guide', 'information', 'info', 'what can you do', 'how does this work'],
  THANKS: ['thanks', 'thank you', 'appreciate', 'grateful', 'thx', 'ty'],
  BUY_INTENT: ['want to buy', 'interested in buying', 'looking to buy', 'purchase', 'make an offer', 'buy this', 'buy it', 'get this property'],
  SELL_INTENT: ['want to sell', 'interested in selling', 'looking to sell', 'sell my', 'sell a property', 'list my home', 'put my house on the market'],
  VIEW_LISTINGS: ['show listings', 'available listings', 'show available', 'view listings', 'see properties', 'show properties', 'show me properties', 'what do you have'],
};

// Generate a bot message
export const generateBotMessage = (content: string): ChatMessage => {
  return {
    id: uuidv4(),
    type: 'bot',
    content,
    timestamp: new Date(),
  };
};

// Generate a user message
export const generateUserMessage = (content: string): ChatMessage => {
  return {
    id: uuidv4(),
    type: 'user',
    content,
    timestamp: new Date(),
  };
};

// Generate an agent message
export const generateAgentMessage = (content: string, agentName: string, agentAvatar?: string): ChatMessage => {
  return {
    id: uuidv4(),
    type: 'agent',
    content,
    timestamp: new Date(),
    sender: {
      name: agentName,
      avatar: agentAvatar,
    },
  };
};

// Get a random greeting response
export const getGreetingResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * GREETING_RESPONSES.length);
  return GREETING_RESPONSES[randomIndex];
};

// Get a random fallback response
export const getFallbackResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[randomIndex];
};

// Detect intent from user message
export const detectIntent = (message: string, conversationState?: ChatbotConversationState): string | null => {
  const lowerMessage = message.toLowerCase();

  // Check for greetings first to prevent misinterpretation
  if (/^(hi|hello|hey|hi there|hello there|greetings)$/i.test(message.trim()) ||
      /^(good morning|good afternoon|good evening)$/i.test(message.trim())) {
    return 'GREETING';
  }

  // Check for view listings intent
  if (/^(show|view|see|display|list)\s+(available\s+)?(listing|listings|properties|homes|houses|apartments)$/i.test(message.trim()) ||
      /^(show|view|see)\s+me\s+(available\s+)?(listing|listings|properties|homes|houses|apartments)$/i.test(message.trim())) {
    return 'VIEW_LISTINGS';
  }

  // Check for buy/sell intent (higher priority)
  if (/^(want to buy|interested in buying|looking to buy|buy this|buy it|purchase)$/i.test(message.trim()) ||
      /^i (want|would like) to (buy|purchase)/i.test(message.trim())) {
    return 'BUY_INTENT';
  }

  if (/^(want to sell|interested in selling|looking to sell|sell my|sell a property)$/i.test(message.trim()) ||
      /^i (want|would like) to sell/i.test(message.trim())) {
    return 'SELL_INTENT';
  }

  // Check for single-word property type inputs
  if (/^(apartment|house|condo|villa|penthouse|studio|flat|loft)$/i.test(message.trim())) {
    return 'PROPERTY_TYPE';
  }

  // Check for bedroom count inputs or apartment descriptions
  // Also check for single digit/number responses which are likely bedroom counts in context
  if (/^\d+\s*(bed|bedroom|br)s?$/i.test(message.trim()) ||
      /^(one|two|three|four|five)\s*(bed|bedroom|br)s?$/i.test(message.trim()) ||
      /^\d+\s*(bed|bedroom)\s*(apartment|house|condo|villa|flat)/i.test(message.trim()) ||
      /^[1-9][0-9]?$/i.test(message.trim())) { // Match single digits or numbers up to 99
    return 'BEDROOM_COUNT';
  }

  // Check for phone numbers
  if (/^\+?[0-9\s\(\)\-\.]{7,}$/.test(message.trim())) {
    return 'PHONE_PROVIDED';
  }

  // Check for email addresses
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(message)) {
    return 'EMAIL_PROVIDED';
  }

  // ONLY check for name inputs if we're EXPLICITLY in name collection mode
  // This should ONLY happen after we've asked for a name following a buy/sell/contact intent
  if (conversationState?.explicitlyAskedForName && !conversationState.userName) {
    // Even then, apply strict filtering to avoid false positives
    if (message.trim().length < 20 && message.trim().length > 1 &&
        !/[@#$%^&*(),.?":{}|<>]/.test(message) &&
        !/^(yes|no|maybe|ok|okay|sure|thanks|thank you|hi|hello|hey|there|greetings)$/i.test(message.trim()) &&
        !/\b(hi|hello|hey|there|greetings)\b/i.test(message.trim()) &&
        !/\d+\s*(bed|bedroom|bath|bathroom|sqft|sq ft|square foot|apartment|house|condo|villa)s?/i.test(message.trim()) &&
        !/^\d+$/i.test(message.trim()) && // Exclude inputs that are just numbers
        !/\d/.test(message.trim())) { // Exclude inputs containing any digits
      return 'NAME_PROVIDED';
    }
  }

  // Check for standard intents using keywords
  for (const [intent, keywords] of Object.entries(INTENTS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return intent;
      }
    }
  }

  return null;
};

// Define conversation state type
export interface ChatbotConversationState {
  collectingUserInfo: boolean;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  propertyInterest?: string;
  propertyType?: string;
  bedroomCount?: string;
  stage: 'greeting' | 'collecting_info' | 'inquiry_submitted' | 'general';
  explicitlyAskedForName?: boolean;
}

// Generate response based on intent and conversation state
export const generateResponse = (intent: string | null, message: string, conversationState?: ChatbotConversationState, currentProperty?: Property): string => {
  if (!intent) {
    return getFallbackResponse();
  }

  // Handle user information collection flow
  if (conversationState?.collectingUserInfo) {
    if (intent === 'NAME_PROVIDED' && !conversationState.userName) {
      return `Thanks, ${message}! Could you please provide your phone number? This is important for the agent to contact you directly.`;
    }

    if (intent === 'PHONE_PROVIDED' && !conversationState.userPhone) {
      return `Thank you! Now, could you also provide your email address so the agent can send you property details?`;
    }

    if (intent === 'EMAIL_PROVIDED' && !conversationState.userEmail) {
      return `Great! An agent will contact you at ${conversationState.userPhone} and ${message} soon regarding ${conversationState.propertyInterest || 'your property inquiry'}. Is there anything specific you'd like to know in the meantime?`;
    }
  }

  switch (intent) {
    case 'GREETING':
      if (currentProperty) {
        return `Welcome to Luxury Estates! You're currently viewing ${currentProperty.title}. This beautiful property is priced at $${currentProperty.price.toLocaleString()} and located in ${currentProperty.location}. How can I help you with this property today?`;
      }
      return getGreetingResponse();

    case 'HELP':
      if (currentProperty) {
        return `I can help you with information about this property, answer questions about its price, location, or features, connect you with the listing agent, or schedule a viewing. What would you like to know?`;
      }
      return "I can help you find properties, answer questions about prices and locations, connect you with an agent, or schedule a viewing. What would you like to know?";

    case 'THANKS':
      return "You're welcome! Is there anything else I can help you with?";

    case 'PROPERTY_SEARCH':
      return "I can help you find the perfect property. What type of property are you looking for? And do you have a specific location or budget in mind?";

    case 'BUY_INTENT':
      if (currentProperty) {
        return `Great! Could you please provide your name and phone number? An agent will contact you shortly about ${currentProperty.title}.`;
      }
      return "I'd be happy to help you find a property to buy. Could you please provide your name and phone number so an agent can contact you?";

    case 'SELL_INTENT':
      return "Great! Could you please provide your name and phone number? A listing agent will contact you shortly to discuss selling your property.";

    case 'PROPERTY_TYPE':
      return `Great! ${message.trim()} properties are popular choices. How many bedrooms are you looking for?`;

    case 'BEDROOM_COUNT':
      // Handle single digit responses differently
      if (/^[1-9]$/.test(message.trim())) {
        return `I can help you find ${message.trim()} bedroom properties. Are you interested in a specific location or do you have a budget in mind? I can also show you our available listings if you'd like.`;
      }
      return `I can help you find ${message.trim()} properties. Are you interested in a specific location or do you have a budget in mind? I can also show you our available listings if you'd like.`;

    case 'VIEW_LISTINGS':
      if (conversationState?.bedroomCount) {
        return `Here are our available ${conversationState.bedroomCount} bedroom properties. You can view more details by clicking on any property that interests you. Would you like to speak with an agent about any of these properties?`;
      } else if (conversationState?.propertyType) {
        return `Here are our available ${conversationState.propertyType} properties. You can view more details by clicking on any property that interests you. Would you like to speak with an agent about any of these properties?`;
      }
      return `Here are our available properties. You can view more details by clicking on any property that interests you. Would you like to speak with an agent about any of these properties?`;

    case 'PRICE_INQUIRY':
      if (currentProperty) {
        return `This property is listed at $${currentProperty.price.toLocaleString()}. ${currentProperty.status === 'For Sale' ? 'It\'s currently on the market and available for purchase.' : 'It\'s currently available for rent.'} Would you like to schedule a viewing or speak with an agent about financing options?`;
      }
      return "Our properties range from affordable to luxury. What's your budget range so I can help you find something suitable?";

    case 'LOCATION_INQUIRY':
      if (currentProperty) {
        return `This property is located in ${currentProperty.location}. It's a great area with ${Math.random() > 0.5 ? 'excellent schools and shopping nearby' : 'parks and restaurants within walking distance'}. Would you like to know more about the neighborhood?`;
      }
      return "We have properties in various prime locations. Is there a specific area or city you're interested in?";

    case 'AGENT_CONTACT':
      if (currentProperty) {
        return `I'd be happy to connect you with ${currentProperty.agent?.firstName || 'the listing agent'} who can tell you more about this property. Please provide your name, and they will contact you shortly.`;
      }
      return "I'd be happy to connect you with one of our experienced agents. Please provide your name, and an agent will contact you shortly.";

    case 'NAME_PROVIDED':
      return `Thank you! Could you please provide your phone number? This is important for the agent to contact you directly.`;

    case 'PHONE_PROVIDED':
      return `Thank you! An agent will contact you shortly at this number.`;

    case 'EMAIL_PROVIDED':
      return `Thank you! An agent will contact you at ${message} soon. Is there anything specific about properties you'd like to know while you wait?`;

    case 'VIEWING_REQUEST':
      if (currentProperty) {
        return `I can help you schedule a viewing for ${currentProperty.title}. When would be a good time for you? Our agents are available 7 days a week.`;
      }
      return "I'd be happy to arrange a property viewing for you. Could you specify which property you're interested in seeing?";

    default:
      return getFallbackResponse();
  }
};

// Submit an inquiry from the chatbot
export const submitInquiry = async (propertyId: string, name: string, email: string, message: string) => {
  try {
    const response = await createInquiry({
      property: propertyId,
      name,
      email,
      message,
    });

    return response;
  } catch (error) {
    console.error('Error submitting inquiry from chatbot:', error);
    throw error;
  }
};
