"use client"
import React, { useState } from 'react';
import Player from '@/components/Player';
import { Menu, Home, Library, MessageCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-[90vh] max-h-[90vh] w-full flex flex-col overflow-hidden relative">
            {/* Main content area */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
                {children}
            </div>

            {/* Floating Player */}
            <div className="absolute bottom-16 left-0 right-0 z-50">
                <Player />
            </div>

            {/* Bottom Navigation Bar */}
            <div className="h-16 bg-[#1a1a2e] border-t border-gray-800 fixed bottom-0 left-0 right-0 z-40">
                <div className="flex items-center justify-around h-full">
                    <Link href="/player" className="flex flex-col items-center text-white/70 hover:text-white">
                        <Home size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link href="/player/library" className="flex flex-col items-center text-white/70 hover:text-white">
                        <Library size={24} />
                        <span className="text-xs mt-1">Library</span>
                    </Link>
                    <Link href="/player/chat" className="flex flex-col items-center text-white/70 hover:text-white">
                        <MessageCircle size={24} />
                        <span className="text-xs mt-1">Chat</span>
                    </Link>
                    <button 
                        onClick={toggleSidebar}
                        className="flex flex-col items-center text-white/70 hover:text-white"
                    >
                        <Menu size={24} />
                        <span className="text-xs mt-1">More</span>
                    </button>
                </div>
            </div>

            {/* Slide-out Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-full w-64 bg-[#1a1a2e] transform transition-transform duration-300 ease-in-out z-50 ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white text-lg font-semibold">Menu</h2>
                        <button 
                            onClick={toggleSidebar}
                            className="text-white/70 hover:text-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                    <nav className="space-y-4">
                        <Link href="/player/explore" className="flex items-center text-white/70 hover:text-white">
                            <span>Explore</span>
                        </Link>
                        <Link href="/player/podcasts" className="flex items-center text-white/70 hover:text-white">
                            <span>Podcasts</span>
                        </Link>
                        <Link href="/player/liked" className="flex items-center text-white/70 hover:text-white">
                            <span>Liked</span>
                        </Link>
                        <Link href="/player/downloads" className="flex items-center text-white/70 hover:text-white">
                            <span>Downloads</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Overlay when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}