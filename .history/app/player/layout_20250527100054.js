"use client"
import React, { useState } from 'react';
import Leftbar from '@/components/Leftbar';
import Player from '@/components/Player';
import FriendsActivity from '@/components/FriendsActivity';
import ChatWindow from '@/components/ChatWindow';

export default function Layout({ children }) {
    // State to toggle between ChatWindow and FriendsActivity
    const [showChat, setShowChat] = useState(false);

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden">
            {/* Main content area - takes up all space except player height */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar - fixed width */}
                <div className="w-64 h-full overflow-hidden">
                    <Leftbar />
                </div>

                {/* Main content - flexible width */}
                <div className="flex-1 h-full overflow-auto p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
                    {children}
                </div>

                {/* Right sidebar - toggleable between Chat and Friends */}
                <div className="w-72 h-full overflow-hidden relative">
                    {/* Toggle buttons */}
                    <div className="absolute top-2 right-2 z-10 flex space-x-2">
                        <button 
                            onClick={() => setShowChat(false)}
                            className={`px-3 py-1 rounded-full text-xs ${!showChat 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                        >
                            Friends
                        </button>
                        <button 
                            onClick={() => setShowChat(true)}
                            className={`px-3 py-1 rounded-full text-xs ${showChat 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                        >
                            Chat
                        </button>
                    </div>

                    {/* Content panels */}
                    <div className={`h-full transition-opacity duration-300 ${showChat ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                        <ChatWindow />
                    </div>
                    <div className={`h-full transition-opacity duration-300 ${!showChat ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                        <FriendsActivity />
                    </div>
                </div>
            </div>

            {/* Player - fixed height at bottom */}
            <div className="h-24">
                <Player />
            </div>
        </div>
    );
}