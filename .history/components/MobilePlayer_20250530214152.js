import React from 'react';
import Image from 'next/image';

const MobilePlayer = () => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-purple-900/30 p-4 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image src="/default-album.png" alt="Album cover" fill className="object-cover rounded-md"/>
          </div>
          <div className="text-white">
            <h3 className="text-sm font-medium">Song Title</h3>
            <p className="text-xs text-gray-400">Artist Name</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
            </svg>
          </button>
          <button className="text-white">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayer; 