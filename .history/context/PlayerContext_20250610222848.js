'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSpotify } from './SpotifyContext';
import { getStreamUrl } from '@/lib/music';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { currentSong, streamUrl, isLoading } = useSpotify();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);


  console.log()
  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle stream URL changes
  useEffect(() => {
    if (streamUrl && audioRef.current) {
      audioRef.current.src = streamUrl;
      audioRef.current.load();

      if (currentSong) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  }, [streamUrl, currentSong]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Play next song in queue if available
      if (queue.length > 0) {
        playNextTrack();
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [queue]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current || !streamUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const seekTo = (position) => {
    if (!audioRef.current || !duration) return;
    
    const seekPosition = (position / 100) * duration;
    audioRef.current.currentTime = seekPosition;
    setCurrentTime(seekPosition);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const addToQueue = (track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNextTrack = async () => {
    if (queue.length === 0) return;
    
    // Add current song to history
    if (currentSong) {
      setHistory(prev => [currentSong, ...prev].slice(0, 20)); // Keep last 20 songs
    }
    
    // Get next song from queue
    const nextTrack = queue[0];
    setQueue(prevQueue => prevQueue.slice(1));
    
    // Play the next track
    // This would typically call your Spotify context's play function
    // For now, we'll just log it
    console.log("Playing next track:", nextTrack);
  };

  const playPreviousTrack = () => {
    if (history.length === 0) return;
    
    // Get the most recent song from history
    const previousTrack = history[0];
    setHistory(prev => prev.slice(1));
    
    // Add current song to the front of the queue
    if (currentSong) {
      setQueue(prev => [currentSong, ...prev]);
    }
    
    // Play the previous track
    // This would typically call your Spotify context's play function
    console.log("Playing previous track:", previousTrack);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      queue,
      history,
      streamUrl,
      togglePlayPause,
      seekTo,
      handleVolumeChange,
      addToQueue,
      clearQueue,
      playNextTrack,
      playPreviousTrack,
      formatTime
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}