'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount and URL changes
  useEffect(() => {
    checkAuthenticationStatus();
    
    // Listen for URL changes (e.g., after redirect from Spotify)
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('spotify_auth') === 'success') {
        // Remove the URL parameter and refresh auth status
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => checkAuthenticationStatus(), 100);
      }
    };

    handleUrlChange();
    window.addEventListener('focus', checkAuthenticationStatus);
    
    return () => {
      window.removeEventListener('focus', checkAuthenticationStatus);
    };
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check for existing tokens in cookies
      const storedAccessToken = Cookies.get('spotify_access_token');
      const storedRefreshToken = Cookies.get('spotify_refresh_token');
      const isAuthenticated = Cookies.get('spotify_authenticated') === 'true';

      console.log('Auth check:', { 
        hasAccessToken: !!storedAccessToken, 
        hasRefreshToken: !!storedRefreshToken, 
        isAuthenticated 
      });

      if (storedAccessToken && storedRefreshToken && isAuthenticated) {
        // Validate token by making a test API call
        const isValid = await validateToken(storedAccessToken);
        
        if (isValid) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsSpotifyAuthenticated(true);
        } else {
          // Try to refresh the token
          const newToken = await refreshAccessToken(storedRefreshToken);
          if (newToken) {
            setAccessToken(newToken);
            setRefreshToken(storedRefreshToken);
            setIsSpotifyAuthenticated(true);
          } else {
            // Clear invalid tokens
            clearAuthenticationData();
          }
        }
      } else {
        clearAuthenticationData();
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      clearAuthenticationData();
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const clearAuthenticationData = () => {
    Cookies.remove('spotify_access_token');
    Cookies.remove('spotify_refresh_token');
    Cookies.remove('spotify_authenticated');
    setAccessToken(null);
    setRefreshToken(null);
    setIsSpotifyAuthenticated(false);
  };

  const loginToSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      console.error('Spotify Client ID is not defined. Make sure NEXT_PUBLIC_SPOTIFY_CLIENT_ID is set in your .env.local file');
      return;
    }

    const redirectUri = 'https://y-tune-frontend.vercel.app/api/auth/callback/spotify';
    // Use consistent scopes - match what you need for your app
    const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    
    window.location.href = authUrl;
  };

  const logoutSpotify = () => {
    clearAuthenticationData();
  };

  const refreshAccessToken = async (currentRefreshToken = refreshToken) => {
    if (!currentRefreshToken) return null;

    try {
      const response = await fetch('/api/spotify/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      if (data.access_token) {
        // Update state
        setAccessToken(data.access_token);
        return data.access_token;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearAuthenticationData();
      return null;
    }
  };

  const getAccessToken = async () => {
    if (!accessToken) {
      return await refreshAccessToken();
    }
    
    // Check if token is still valid
    const isValid = await validateToken(accessToken);
    if (!isValid) {
      return await refreshAccessToken();
    }
    
    return accessToken;
  };

  const spotifyApiCall = async (endpoint, options = {}) => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        return fetch(`https://api.spotify.com/v1${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
      }
      throw new Error('Authentication failed');
    }

    return response;
  };

  return (
    <SpotifyContext.Provider value={{
      isSpotifyAuthenticated,
      accessToken,
      isLoading,
      loginToSpotify,
      logoutSpotify,
      getAccessToken,
      spotifyApiCall,
      checkAuthenticationStatus,
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