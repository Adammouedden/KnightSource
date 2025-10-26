"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import contentData from '../public/content/chatcontents.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  paragraphs?: string[];
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

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call RAG
    try {
      const endpoint = `http://localhost:8000/RAG?prompt=${encodeURIComponent(text)}`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });

      console.error("res", res);

      let botText: string;
      if (res.ok) {
        // assume the service returns plain text
        botText = await res.text();
      } else {
        // fallback to local generator if remote fails
        console.error('RAG request failed', res.status, await res.text());
        botText = generateResponse(text.toLowerCase());
      }

      console.log("botText", botText);

      // Handle responses that may be JSON-wrapped or contain escaped newlines
      let parsedText = botText;
      try {
        const maybeJson = JSON.parse(botText);
        if (typeof maybeJson === 'string') {
          parsedText = maybeJson;
        } else if (maybeJson?.response) {
          parsedText = maybeJson.response;
        } else if (maybeJson?.answer) {
          parsedText = maybeJson.answer;
        }
      } catch (e) {
        // not JSON — keep original
      }

      // Convert escaped newlines and HTML breaks to real newlines
      parsedText = parsedText.replace(/\\n/g, '\n').replace(/<br\s*\/?>/gi, '\n');

      // Split into paragraphs on one or more blank lines (double newlines)
      const paragraphs = parsedText
        .split(/\n{2,}/)
        .map((p) => p.replace(/\n+/g, ' ').trim())
        .filter(Boolean);

      console.log("paragraphs", paragraphs);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: parsedText,
        paragraphs,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('RAG request error', err);
      const fallbackText = generateResponse(text.toLowerCase());
      const paragraphs = fallbackText.split(/\n+/).map((p) => p.trim()).filter(Boolean);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackText,
        paragraphs,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (query: string): string => {
    if (query.includes('funding') || query.includes('money') || query.includes('qualify')) {
      return "Based on your query, here are some funding opportunities:\n\n• Conference Travel: Up to $1,500 for RSOs + $150 per presenter (max $3,000)\n• Individual Presenters: Up to $400\n\nWould you like more details about any of these?";
    }

    if (query.includes('deadline') || query.includes('when')) {
      return "Deadlines vary by resource. For Conference Travel funding, applications are typically reviewed on a rolling basis. I recommend checking the specific resource page for exact deadlines.";
    }

    if (query.includes('legal') || query.includes('healthcare')) {
      return "I can help you with both legal and healthcare resources:\n\n• Legal: Various legal services and support available through UCF\n• Healthcare: Student health services and wellness programs\n\nWhich would you like to explore first?";
    }

    if (query.includes('rso') || query.includes('organization')) {
      return "RSOs have access to special funding and resources! Key opportunities include:\n\n• Conference Travel: $1,500 base + $150 per presenter\n• Various academic and recreational programs\n\nWhat type of RSO activity are you planning?";
    }

    if (query.includes('research') || query.includes('presentation') || query.includes('conference')) {
      return "Great! For conference presentations:\n\n• RSOs: $1,500 + $150 per presenter (max $3,000)\n• Individual students: up to $400\n\nThis covers research presentations, art shows, posters, and performances. Would you like to start an application?";
    }

    return "I'd be happy to help! You can ask me about:\n\n• Funding opportunities\n• Legal and healthcare resources\n• Conference travel support\n• Academic programs\n• Recreational activities\n\nWhat would you like to know more about?";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-6 z-50 w-11 h-11 bg-blue-500 hover:bg-citrine text-onyx rounded-full shadow-lg hover:shadow-citrine flex items-center justify-center transition-all transform hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-6 z-50" style={{ transform: 'scale(0.80)', transformOrigin: 'bottom right' }}>
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
                    {message.paragraphs ? (
                      message.paragraphs.map((para, idx) => (
                        <p key={idx} className="text-sm leading-relaxed mb-2">{para}</p>
                      ))
                    ) : (
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    )}
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
                  <div className="bg-knight-gray/20 text-off-white p-3 rounded-2xl rounded-bl-sm max-w-[60%]">
                    <div className="flex items-center">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 bg-white rounded-full" style={{ animation: 'typing-bounce 1s ease-in-out infinite' }} />
                        <div className="w-2 h-2 bg-white rounded-full" style={{ animation: 'typing-bounce 1s ease-in-out infinite', animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-white rounded-full" style={{ animation: 'typing-bounce 1s ease-in-out infinite', animationDelay: '0.2s' }} />
                      </div>
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
