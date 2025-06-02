'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);

  const loginToSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to initiate Spotify login:', error);
    }
  };

  const handleSpotifyCallback = async (code) => {
    try {
      const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
      const data = await response.json();
      
      if (data.access_token) {
        setSpotifyToken(data.access_token);
        setIsSpotifyAuthenticated(true);
        // Store token in cookies
        Cookies.set('spotify_token', data.access_token, { expires: 7 });
      }
    } catch (error) {
      console.error('Failed to complete Spotify authentication:', error);
    }
  };

  useEffect(() => {
    // Check for token in cookies on mount
    const token = Cookies.get('spotify_token');
    if (token) {
      setSpotifyToken(token);
      setIsSpotifyAuthenticated(true);
    }
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
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