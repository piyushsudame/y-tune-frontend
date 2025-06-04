'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
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
        console.log('Detected spotify_auth=success in URL, checking auth status...');
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
      console.log('Checking Spotify authentication status...');
      
      // First check the non-httpOnly cookie flag for quick client-side check
      // This is just a flag, the actual tokens are stored in the database
      const isAuthenticated = Cookies.get('spotify_authenticated') === 'true';
      console.log('Auth check: isAuthenticated =', isAuthenticated);

      // Validate authentication by making an API call to our backend
      if (isAuthenticated) {
        console.log('Attempting to validate token...');
        const isValid = await validateAuthentication();
        console.log('Token validation result:', isValid);
        
        if (isValid) {
          console.log('Token is valid, setting authenticated state to true');
          setIsSpotifyAuthenticated(true);
        } else {
          console.log('Token is invalid, attempting refresh...');
          // Try to refresh the token via our API
          const refreshed = await refreshAuthentication();
          console.log('Token refresh result:', refreshed);
          
          if (refreshed) {
            console.log('Token refreshed successfully, setting authenticated state to true');
            setIsSpotifyAuthenticated(true);
          } else {
            console.log('Token refresh failed, clearing authentication data');
            clearAuthenticationData();
          }
        }
      } else {
        console.log('No authentication cookie found, clearing authentication data');
        clearAuthenticationData();
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      clearAuthenticationData();
    } finally {
      setIsLoading(false);
    }
  };

  const validateAuthentication = async () => {
    try {
      // Use our backend to validate the session
      const response = await fetch('/api/spotify/validate', {
        method: 'GET',
        credentials: 'include', // Important: include cookies for Clerk auth
      });
      
      return response.ok;
    } catch (error) {
      console.error('Authentication validation error:', error);
      return false;
    }
  };

  const clearAuthenticationData = () => {
    // We can only clear the non-httpOnly cookie that indicates authentication status
    // The actual session data is cleared server-side
    Cookies.remove('spotify_authenticated');
    setIsSpotifyAuthenticated(false);
  };

  const loginToSpotify = async () => {
    try {
      // Get the authorization URL from our backend
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirect to Spotify authorization page
        window.location.href = data.url;
      } else {
        console.error('Failed to get Spotify authorization URL:', data.error);
      }
    } catch (error) {
      console.error('Error initiating Spotify login:', error);
    }
  };

  const logoutSpotify = async () => {
    try {
      // Call logout endpoint to clear session on the server
      await fetch('/api/spotify/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for Clerk auth
      });
      clearAuthenticationData();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthenticationData();
    }
  };

  const refreshAuthentication = async () => {
    try {
      const response = await fetch('/api/spotify/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies for Clerk auth
      });

      return response.ok;
    } catch (error) {
      console.error('Error refreshing authentication:', error);
      return false;
    }
  };

  const spotifyApiCall = async (endpoint, options = {}) => {
    try {
      // First ensure we have valid authentication
      if (!isSpotifyAuthenticated) {
        const refreshed = await refreshAuthentication();
        if (!refreshed) {
          throw new Error('Not authenticated with Spotify');
        }
      }

      // Make the API call through our backend proxy
      const response = await fetch(`/api/spotify/proxy${endpoint}`, {
        ...options,
        credentials: 'include', // Include cookies for Clerk auth
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshAuthentication();
        if (refreshed) {
          return fetch(`/api/spotify/proxy${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });
        }
        throw new Error('Authentication failed');
      }

      return response;
    } catch (error) {
      console.error('Spotify API call error:', error);
      throw error;
    }
  };

  return (
    <SpotifyContext.Provider value={{
      isSpotifyAuthenticated,
      isLoading,
      loginToSpotify,
      logoutSpotify,
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