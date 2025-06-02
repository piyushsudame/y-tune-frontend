'use client';

import { useState } from 'react';

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // This file handles music playback controls and current track display
  return (
    <div className="fixed bottom-0 w-full bg-black border-t border-gray-800 p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* Track info will go here */}
          <div className="text-white">
            {currentTrack ? currentTrack.name : 'No track selected'}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-green-500"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
} 