"use client"
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! What music are you listening to?", sender: "other", timestamp: "10:30 AM" },
    { id: 2, text: "I'm enjoying some lo-fi beats while coding.", sender: "user", timestamp: "10:32 AM" },
    { id: 3, text: "Nice! Have you checked out the new playlist I shared?", sender: "other", timestamp: "10:33 AM" },
    { id: 4, text: "Not yet, but I'll add it to my queue!", sender: "user", timestamp: "10:35 AM" },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: currentTime
      }
    ]);
    
    setNewMessage("");
    
    // Simulate a response (remove in production)
    setTimeout(() => {
      const responses = [
        "That sounds great!",
        "Have you heard this artist before?",
        "I can recommend similar tracks if you'd like.",
        "What genre are you in the mood for today?",
        "Check out the trending playlist - it's fire! 🔥"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: randomResponse,
          sender: "other",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3">
          <span className="text-white text-sm">🎵</span>
        </div>
        <div>
          <h3 className="text-white font-medium">Music Buddy</h3>
          <p className="text-white/60 text-xs">Online</p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'bg-white/10 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-white/70' : 'text-white/50'
              }`}>{message.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex items-center">
        <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex items-center px-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-transparent text-white w-full py-3 focus:outline-none text-sm"
          />
          <button 
            type="button"
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            <span className="text-xl">😊</span>
          </button>
        </div>
        <button 
          type="submit"
          className="ml-2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white"
          disabled={newMessage.trim() === ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}

export default ChatWindow
