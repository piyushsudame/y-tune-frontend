'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { spotifyEndpoints } from '@/utils/spotify';
import { useSession } from '@clerk/nextjs';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [dataLoaded, setDataLoaded] = useState({
    profile: false,
    playlists: false,
    likedSongs: false,
    artists: false
  });

  // Define callback functions first
  const clearAuthenticationData = useCallback(() => {
    setIsSpotifyAuthenticated(false);
    setUserProfile(null);
    setUserPlaylists([]);
    setLikedSongs([]);
    setTopArtists([]);
    setLastChecked(null);
    setExpiresAt(null);
    setDataLoaded({
      profile: false,
      playlists: false,
      likedSongs: false,
      artists: false
    });
    
    // Clear from localStorage
    localStorage.removeItem('spotifyAuthStatus');
  }, []);

  const checkAuthenticationStatus = useCallback(async () => {
    try {
      // Check if we've recently validated and the token is still valid
      const now = new Date();
      const cacheValidityPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (
        lastChecked && 
        expiresAt && 
        (now - lastChecked) < cacheValidityPeriod && 
        now < new Date(expiresAt)
      ) {
        // Use cached authentication status
        console.log('Using cached authentication status');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      // Check authentication status from our backend
      const response = await fetch('/api/spotify/validate', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        // Parse the response to get the validation result
        const data = await response.json();
        
        if (data.valid) {
          setIsSpotifyAuthenticated(true);
          setLastChecked(now);
          setExpiresAt(data.expiresAt);
          
          // Store in localStorage for persistence across page reloads
          localStorage.setItem('spotifyAuthStatus', JSON.stringify({
            isAuthenticated: true,
            lastChecked: now.toISOString(),
            expiresAt: data.expiresAt
          }));
        } else {
          clearAuthenticationData();
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
  }, [lastChecked, expiresAt, clearAuthenticationData]);

  const spotifyApiCall = useCallback(async (endpoint, options = {}) => {
    try {
      // Make the API call through our backend proxy
      const response = await fetch(`/api/spotify/proxy${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // If we get a 401, we don't need to manually refresh the token here
      // The proxy endpoint will handle token refreshing internally
      if (response.status === 401) {
        // Instead of trying to refresh here, we'll check authentication status
        // This prevents potential infinite loops
        await checkAuthenticationStatus();
        throw new Error('Authentication failed - please try again');
      }

      return response;
    } catch (error) {
      console.error('Spotify API call error:', error);
      throw error;
    }
  }, [checkAuthenticationStatus]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await spotifyApiCall(spotifyEndpoints.userProfile);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setDataLoaded(prev => ({ ...prev, profile: true }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [spotifyApiCall]);

  const fetchUserPlaylists = useCallback(async () => {
    try {
      const response = await spotifyApiCall(spotifyEndpoints.userPlaylists);
      if (response.ok) {
        const data = await response.json();
        setUserPlaylists(data.items || []);
        setDataLoaded(prev => ({ ...prev, playlists: true }));
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }, [spotifyApiCall]);

  const fetchLikedSongs = useCallback(async (limit = 50, offset = 0) => {
    try {
      const response = await spotifyApiCall(`${spotifyEndpoints.userLibrary}?limit=${limit}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setLikedSongs(data.items || []);
        setDataLoaded(prev => ({ ...prev, likedSongs: true }));
      }
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  }, [spotifyApiCall]);

  const fetchTopArtists = useCallback(async (limit = 20) => {
    try {
      const response = await spotifyApiCall(`${spotifyEndpoints.userTopArtists}?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setTopArtists(data.items || []);
        setDataLoaded(prev => ({ ...prev, artists: true }));
      }
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  }, [spotifyApiCall]);

  const fetchUserData = useCallback(async () => {
    try {
      // Use a flag to prevent multiple simultaneous data fetches
      if (Object.values(dataLoaded).some(value => value === true)) {
        console.log('Some data already loaded, skipping redundant fetches');
        return;
      }
      
      // Fetch user profile first
      await fetchUserProfile();
      
      // Only continue with other fetches if profile was successfully loaded
      if (dataLoaded.profile) {
        // Fetch user playlists
        fetchUserPlaylists();
        
        // Fetch liked songs
        fetchLikedSongs();
        
        // Fetch top artists
        fetchTopArtists();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dataLoaded, fetchUserProfile, fetchUserPlaylists, fetchLikedSongs, fetchTopArtists]);

  // Load authentication status from localStorage on initial load
  useEffect(() => {
    const loadInitialAuthStatus = async () => {
      try {
        const storedAuth = localStorage.getItem('spotifyAuthStatus');
        if (storedAuth) {
          const { isAuthenticated, lastChecked, expiresAt } = JSON.parse(storedAuth);
          const now = new Date();
          const lastCheckedDate = new Date(lastChecked);
          const expiresAtDate = new Date(expiresAt);
          
          // Only use stored auth if it's still valid
          if (isAuthenticated && now < expiresAtDate) {
            setIsSpotifyAuthenticated(true);
            setLastChecked(lastCheckedDate);
            setExpiresAt(expiresAtDate);
            setIsLoading(false);
          } else {
            // If expired, clear and check again
            localStorage.removeItem('spotifyAuthStatus');
            await checkAuthenticationStatus();
          }
        } else {
          await checkAuthenticationStatus();
        }
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        await checkAuthenticationStatus();
      }
    };
    
    loadInitialAuthStatus();
  }, [checkAuthenticationStatus]);

  // Check authentication status on URL changes and window focus
  useEffect(() => {
    // Listen for URL changes (e.g., after redirect from Spotify)
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for success
      if (urlParams.get('spotify_auth') === 'success') {
        // Remove the URL parameter and refresh auth status
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => checkAuthenticationStatus(), 100);
      }
      
      // Check for errors
      const error = urlParams.get('error');
      if (error) {
        console.error('Spotify auth error detected in URL:', error);
        const status = urlParams.get('status');
        if (status) {
          console.error('Error status:', status);
        }
        // Clear the error from the URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('error');
        newUrl.searchParams.delete('status');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    };

    handleUrlChange();
    
    // Only check auth on focus if we haven't checked recently
    const handleFocus = () => {
      const now = new Date();
      const cacheValidityPeriod = 5 * 60 * 1000; // 5 minutes
      
      if (!lastChecked || (now - lastChecked) > cacheValidityPeriod) {
        checkAuthenticationStatus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastChecked, checkAuthenticationStatus]);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isSpotifyAuthenticated && !isLoading && !dataLoaded.profile) {
      fetchUserData();
    }
  }, [isSpotifyAuthenticated, isLoading, dataLoaded.profile, fetchUserData]);

  const loginToSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      console.error('Spotify Client ID is not defined. Make sure NEXT_PUBLIC_SPOTIFY_CLIENT_ID is set in your .env file');
      return;
    }

    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    if (!redirectUri) {
      console.error('Spotify Redirect URI is not defined. Make sure NEXT_PUBLIC_SPOTIFY_REDIRECT_URI is set in your .env file');
      return;
    }
    
    
    // Use consistent scopes - match what you need for your app
    const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    
    
    window.location.href = authUrl;
  };

  const logoutSpotify = async () => {
    try {
      // Call logout endpoint to clear session on the server
      await fetch('/api/spotify/logout', {
        method: 'POST',
        credentials: 'include',
      });
      clearAuthenticationData();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthenticationData();
    }
  };

  /**
   * Placeholder for future song playback implementation
   * @param {string} songName - The name of the song to play
   * @param {Object} songInfo - Optional song metadata (title, artist, etc.)
   */

   const handlePlay = async (songInfo) => {
    try {
      const response = await fetch(`/api/get-stream-url`, {
        method: 'POST',
        body: JSON.stringify({ query: songInfo.title + ' ' + songInfo.artist }),
        headers: { 'Content-Type': "application/json"}
      });

      if(!response.ok) throw new Error('Failed to fetch stream URL')

      const { streamUrl } = await response.json();
      setCurrentSong(songInfo);
      setStreamUrl(streamUrl);
    } catch(error) {
      console.error("Error fetching stream URL:", error)
    }
   }

  return (
    <SpotifyContext.Provider value={{
      isSpotifyAuthenticated,
      isLoading,
      userProfile,
      userPlaylists,
      likedSongs,
      topArtists,
      dataLoaded,
      currentSong,
      streamUrl,
      handlePlay,
      loginToSpotify,
      logoutSpotify,
      spotifyApiCall,
      checkAuthenticationStatus,
      fetchUserData,
      fetchUserProfile,
      fetchUserPlaylists,
      fetchLikedSongs,
      fetchTopArtists
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

