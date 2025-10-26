"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import contentData from '../public/content/chatcontents.json';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Utility function for fallback responses
function getFallbackResponse(query: string): string {
  if (query.includes('funding') || query.includes('money')) {
    return "Based on your query, here are some funding opportunities:\n\n• Conference Travel: Up to $1,500 for RSOs + $150 per presenter (max $3,000)\n• Individual Presenters: Up to $400\n\nWould you like more details about any of these?";
  }
  if (query.includes('deadline')) {
    return "Deadlines vary by resource. For Conference Travel funding, applications are typically reviewed on a rolling basis.";
  }
  return "I'd be happy to help! You can ask me about:\n\n• Funding opportunities\n• Legal and healthcare resources\n• Conference travel support\n• Academic programs\n• Recreational activities";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = contentData.chat_quick_prompts;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hi! I'm here to help you discover UCF resources. Ask me about funding, services, or opportunities available to you.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Local fallback responses
  const handleSend = async (userInput: string = input) => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const endpoint = `http://localhost:8000/RAG?prompt=lawyer`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userInput.trim()
        }),
      });

      let botResponse: string;
      
      if (response.ok) {
        const data = await response.json();
        botResponse = data.response;
      } else {
        console.error('API call failed:', response.status);
        botResponse = getFallbackResponse(userInput.toLowerCase());
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Failed to fetch response:', err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: getFallbackResponse(userInput.toLowerCase()),
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-6 z-50 w-8 h-8 bg-blue-500 hover:bg-citrine text-onyx rounded-full shadow-lg hover:shadow-citrine flex items-center justify-center transition-all transform hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-14 right-6 z-50" style={{ transform: 'scale(0.80)', transformOrigin: 'bottom right' }}>
          <div className="w-80 max-w-[calc(100vw-3rem)] max-y-120 bg-black border border-knight-gray rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-onyx p-4 border-b border-knight-gray">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-citrine rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-onyx" />
                </div>
                <div>
                  <h3 className="font-semibold text-off-white">KnightSource Assistant</h3>
                  <p className="text-knight-gray text-xs">Here to help you find resources</p>
                </div>
              </div>
            </div>

            <div className="h-[530px] overflow-y-auto p-4 space-y-4 bg-graphite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-citrine text-onyx rounded-br-sm'
                        : 'bg-knight-gray/20 text-off-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {messages.length <= 1 && (
              <div className="p-4 border-t border-knight-gray bg-onyx space-y-2">
                <p className="text-knight-gray text-xs mb-2">Quick prompts:</p>
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left px-3 py-2 bg-graphite hover:bg-graphite text-knight-gray hover:text-off-white text-sm rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-knight-gray/20 text-off-white p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-knight-gray rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-knight-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-knight-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-knight-gray/20 bg-onyx">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about resources..."
                  className="flex-1 bg-graphite/50 text-off-white placeholder-knight-gray px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-citrine/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-citrine hover:bg-citrine/90 text-onyx rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-knight-gray text-xs mt-2 text-center">
                AI-powered. Responses may not be complete.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
