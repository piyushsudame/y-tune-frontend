'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    // Check for existing tokens in cookies
    const storedAccessToken = Cookies.get('spotify_access_token');
    const storedRefreshToken = Cookies.get('spotify_refresh_token');
    const isAuthenticated = Cookies.get('spotify_authenticated') === 'true';

    if (storedAccessToken && storedRefreshToken && isAuthenticated) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsSpotifyAuthenticated(true);
    }
  }, []);

  const loginToSpotify = () => {
    // We must use NEXT_PUBLIC_ prefix for client-side access
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      console.error('Spotify Client ID is not defined. Make sure NEXT_PUBLIC_SPOTIFY_CLIENT_ID is set in your .env.local file');
      return;
    }

    const redirectUri = 'https://y-tune-frontend.vercel.app/api/auth/callback/spotify';
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const logoutSpotify = () => {
    // Clear tokens from cookies
    Cookies.remove('spotify_access_token');
    Cookies.remove('spotify_refresh_token');
    Cookies.remove('spotify_authenticated');
    
    // Clear state
    setAccessToken(null);
    setRefreshToken(null);
    setIsSpotifyAuthenticated(false);
  };

  // Add this new function
  const handleSpotifyCallback = async (code) => {
    try {
      const response = await fetch('/api/auth/callback/spotify?code=' + code);
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with Spotify');
      }
      
      // After successful callback, check for cookies
      const storedAccessToken = Cookies.get('spotify_access_token');
      const storedRefreshToken = Cookies.get('spotify_refresh_token');
      const isAuthenticated = Cookies.get('spotify_authenticated') === 'true';
      
      if (storedAccessToken && storedRefreshToken && isAuthenticated) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsSpotifyAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in Spotify callback:', error);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return null;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Update cookies and state
      Cookies.set('spotify_access_token', data.access_token, { expires: 1/24 }); // 1 hour
      setAccessToken(data.access_token);
      
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logoutSpotify();
      return null;
    }
  };

  const getAccessToken = async () => {
    if (!accessToken) {
      return await refreshAccessToken();
    }
    return accessToken;
  };

  return (
    <SpotifyContext.Provider value={{
      isSpotifyAuthenticated,
      accessToken,
      loginToSpotify,
      logoutSpotify,
      getAccessToken,
      handleSpotifyCallback, // Add this to the context value
    }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}
