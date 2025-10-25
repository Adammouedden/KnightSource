"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('knightsource-chat');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('knightsource-chat', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await mockLLMResponse(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}

async function mockLLMResponse(userMessage: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('legal')) {
    return "UCF offers free legal services through Student Legal Services! You can get help with contracts, landlord-tenant issues, and more. Would you like me to share the contact information?";
  }

  if (lowerMessage.includes('health') || lowerMessage.includes('medical')) {
    return "UCF's Student Health Services provides affordable medical care, mental health counseling, and pharmacy services. Most services are free or low-cost for students. What specific health service are you interested in?";
  }

  if (lowerMessage.includes('tutor') || lowerMessage.includes('academic')) {
    return "UCF offers free tutoring services through the Student Academic Resource Center (SARC). You can get help with most subjects, and it's completely free! Want to know how to schedule a session?";
  }

  if (lowerMessage.includes('conference') || lowerMessage.includes('travel')) {
    return "UCF provides travel grants for students attending academic conferences. You could get funding for registration, flights, and hotels. I can guide you through the application process!";
  }

  if (lowerMessage.includes('gym') || lowerMessage.includes('fitness') || lowerMessage.includes('recreation')) {
    return "The Recreation and Wellness Center is included in your tuition! You get access to fitness equipment, group classes, pools, and outdoor adventure programs. It's worth hundreds of dollars per year!";
  }

  return "I'm here to help you discover UCF resources and benefits! You can ask me about legal services, healthcare, academic support, conference funding, or recreation facilities. What would you like to know more about?";
}
