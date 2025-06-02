'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This file manages Spotify authentication state and user data
  const value = {
    spotifyToken,
    setSpotifyToken,
    userProfile,
    setUserProfile,
    isLoading,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}; 