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

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsSpotifyAuthenticated(true);
    }
  }, []);

  const loginToSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback/spotify`;
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const logoutSpotify = () => {
    // Clear tokens from cookies
    Cookies.remove('spotify_access_token');
    Cookies.remove('spotify_refresh_token');
    
    // Clear state
    setAccessToken(null);
    setRefreshToken(null);
    setIsSpotifyAuthenticated(false);
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
