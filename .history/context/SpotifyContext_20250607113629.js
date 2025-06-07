'use client';

import { createContext, useContext, useState, useEffect } from 'react';
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
  const [streamUrl, setStreamUrl] = useState(null)
  const [dataLoaded, setDataLoaded] = useState({
    profile: false,
    playlists: false,
    likedSongs: false,
    artists: false
  });

  // Check authentication status on mount and URL changes
  useEffect(() => {
    checkAuthenticationStatus();
    
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
    window.addEventListener('focus', checkAuthenticationStatus);
    
    return () => {
      window.removeEventListener('focus', checkAuthenticationStatus);
    };
  }, []);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isSpotifyAuthenticated && !isLoading) {
      fetchUserData();
    }
  }, [isSpotifyAuthenticated, isLoading]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      fetchUserProfile();
      
      // Fetch user playlists
      fetchUserPlaylists();
      
      // Fetch liked songs
      fetchLikedSongs();
      
      // Fetch top artists
      fetchTopArtists();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserProfile = async () => {
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
  };

  const fetchUserPlaylists = async () => {
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
  };

  const fetchLikedSongs = async (limit = 50, offset = 0) => {
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
  };

  const fetchTopArtists = async (limit = 20) => {
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
  };

  const checkAuthenticationStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check authentication status from our backend
      const response = await fetch('/api/spotify/validate', {
        method: 'GET',
        credentials: 'include',
      });

      const isAuthenticated = response.ok;

      if (isAuthenticated) {
        setIsSpotifyAuthenticated(true);
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

  const clearAuthenticationData = () => {
    setIsSpotifyAuthenticated(false);
    setUserProfile(null);
    setUserPlaylists([]);
    setLikedSongs([]);
    setTopArtists([]);
    setDataLoaded({
      profile: false,
      playlists: false,
      likedSongs: false,
      artists: false
    });
  };

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

  const spotifyApiCall = async (endpoint, options = {}) => {
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

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshResponse = await fetch('/api/spotify/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          // Retry the original request
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

  /**
   * Placeholder for future song playback implementation
   * @param {string} songName - The name of the song to play
   * @param {Object} songInfo - Optional song metadata (title, artist, etc.)
   */

   const handlePlay = async (songInfo) => {
    try {
      const response = await fetch(`/api/get-stream-url`)
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