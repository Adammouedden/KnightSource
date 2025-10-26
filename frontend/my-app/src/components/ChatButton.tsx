"use client"; // This component needs to be a client component for onClick

import { MessageSquare } from 'lucide-react';

export default function ChatButton() {
  const handleChatClick = () => {
    // Add your chatbot logic here
    console.log("Chatbot opened!");
  };

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-50"
      aria-label="Open chat"
    >
      <MessageSquare size={28} />
    </button>
  );
}