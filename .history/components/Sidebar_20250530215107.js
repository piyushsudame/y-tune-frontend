import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-xl font-bold">Menu</h2>
            <button onClick={onClose} className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-4">
            <Link href="/player/downloads" className="block text-white hover:text-purple-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image src="/download.png" style={{ filter: "invert(1)" }} alt="Downloads" width={20} height={20} />
                </div>
                <span>Downloads</span>
              </div>
            </Link>
            
            <Link href="/player/chat" className="block text-white hover:text-purple-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image src="/chat.png" alt="Chat" width={20} height={20} />
                </div>
                <span>Chat</span>
              </div>
            </Link>
            
            <Link href="/player/liked" className="block text-white hover:text-purple-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image src="/liked music.png" alt="Liked Music" width={20} height={20} />
                </div>
                <span>Liked Music</span>
              </div>
            </Link>

            <Link href="/player/podcasts" className="block text-white hover:text-purple-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-xs">🎙️</div>
                </div>
                <span>Podcasts</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 