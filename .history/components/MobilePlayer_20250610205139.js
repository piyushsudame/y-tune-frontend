import React from 'react';
import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const MobilePlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    isLoading, 
    togglePlayPause, 
    playNextTrack, 
    playPreviousTrack 
  } = usePlayer();

  if (!currentSong) {
    return null; // Don't show player if no song is loaded
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-purple-900/30 p-4 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image 
              src={currentSong?.image || "/demo-album.jpg"} 
              alt="Album cover" 
              fill 
              className="object-cover rounded-md"
            />
          </div>
          <div className="text-white">
            <h3 className="text-sm font-medium truncate max-w-[120px]">
              {isLoading ? "Loading..." : currentSong?.title || "No Song Playing"}
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[120px]">
              {currentSong?.artist || "Unknown Artist"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="text-white p-1"
            onClick={playPreviousTrack}
          >
            <SkipBack size={20} />
          </button>
          <button 
            className="text-white bg-purple-600 rounded-full p-2 w-10 h-10 flex items-center justify-center"
            onClick={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
          </button>
          <button 
            className="text-white p-1"
            onClick={playNextTrack}
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayer; 