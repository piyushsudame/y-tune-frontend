'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState(null);

  const loginToSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to initiate Spotify login:', error);
    }
  };

  const logoutSpotify = () => {
    setSpotifyToken(null);
    setIsSpotifyAuthenticated(false);
    setSpotifyUser(null);
    // Remove both tokens
    document.cookie = 'spotify_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'spotify_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('/api/spotify/refresh', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      setSpotifyToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logoutSpotify();
      return null;
    }
  };

  const fetchSpotifyUser = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setSpotifyUser(userData);
    } catch (error) {
      console.error('Failed to fetch Spotify user:', error);
    }
  };

  const handleSpotifyCallback = async (code) => {
    try {
      const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
      const data = await response.json();
      
      if (data.access_token) {
        setSpotifyToken(data.access_token);
        setIsSpotifyAuthenticated(true);
        await fetchSpotifyUser(data.access_token);
      }
    } catch (error) {
      console.error('Failed to complete Spotify authentication:', error);
    }
  };

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Get access token from cookie
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('spotify_access_token='))
        ?.split('=')[1];

      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          // Token is expired, try to refresh
          const newToken = await refreshAccessToken();
          if (newToken) {
            setSpotifyToken(newToken);
            setIsSpotifyAuthenticated(true);
            await fetchSpotifyUser(newToken);
          }
        } else {
          setSpotifyToken(accessToken);
          setIsSpotifyAuthenticated(true);
          await fetchSpotifyUser(accessToken);
        }
      }
    };

    checkAndRefreshToken();

    // Set up periodic token refresh (every 45 minutes)
    const refreshInterval = setInterval(checkAndRefreshToken, 45 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        spotifyUser,
        loginToSpotify,
        logoutSpotify,
        handleSpotifyCallback,
        refreshAccessToken,
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
