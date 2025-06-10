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

  useEffect(() => {
    const loadInitialAuthStatus = async () => {
      try {
        const storedAuth = localStorage.getItem('spotifyAuthStatus');
        if (storedAuth) {
          const { isAuthenticated, lastChecked, expiresAt } = JSON.parse(storedAuth);
          const now = new Date();
          const lastCheckedDate = new Date(lastChecked);
          const expiresAtDate = new Date(expiresAt);
          
          if (isAuthenticated && now < expiresAtDate) {
            setIsSpotifyAuthenticated(true);
            setLastChecked(lastCheckedDate);
            setExpiresAt(expiresAtDate);
            setIsLoading(false);
          } else {
            localStorage.removeItem('spotifyAuthStatus');
            await checkAuthenticationStatus();
          }
        } else {
          await checkAuthenticationStatus();
        }
      } catch (error) {
        await checkAuthenticationStatus();
      }
    };
    
    loadInitialAuthStatus();
  }, []);

  useEffect(() => {
    if (isSpotifyAuthenticated && !isLoading && !dataLoaded.profile) {
      fetchUserData();
    }
  }, [isSpotifyAuthenticated, isLoading, dataLoaded.profile]);

  const fetchUserData = async () => {
    try {
      if (Object.values(dataLoaded).some(value => value === true)) {
        return;
      }
      
      await fetchUserProfile();
      
      if (dataLoaded.profile) {
        fetchUserPlaylists();
        fetchLikedSongs();
        fetchTopArtists();
      }
    } catch (error) {
      // Error handling
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
      // Error handling
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
      // Error handling
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
      // Error handling
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
      // Error handling
    }
  };

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
    
    localStorage.removeItem('spotifyAuthStatus');
  }, []);

  const checkAuthenticationStatus = useCallback(async () => {
    try {
      const now = new Date();
      const cacheValidityPeriod = 5 * 60 * 1000;
      
      if (
        lastChecked && 
        expiresAt && 
        (now - lastChecked) < cacheValidityPeriod && 
        now < new Date(expiresAt)
      ) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const response = await fetch('/api/spotify/validate', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.valid) {
          setIsSpotifyAuthenticated(true);
          setLastChecked(now);
          setExpiresAt(data.expiresAt);
          
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
      clearAuthenticationData();
    } finally {
      setIsLoading(false);
    }
  }, [lastChecked, expiresAt, clearAuthenticationData]);

  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('spotify_auth') === 'success') {
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => checkAuthenticationStatus(), 100);
      }
      
      const error = urlParams.get('error');
      if (error) {
        const status = urlParams.get('status');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('error');
        newUrl.searchParams.delete('status');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    };

    handleUrlChange();
    
    const handleFocus = () => {
      const now = new Date();
      const cacheValidityPeriod = 5 * 60 * 1000;
      
      if (!lastChecked || (now - lastChecked) > cacheValidityPeriod) {
        checkAuthenticationStatus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastChecked, checkAuthenticationStatus]);

  const loginToSpotify = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    if (!redirectUri) {
      return;
    }
    
    const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state user-read-currently-playing';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    
    window.location.href = authUrl;
  };

  const logoutSpotify = async () => {
    try {
      await fetch('/api/spotify/logout', {
        method: 'POST',
        credentials: 'include',
      });
      clearAuthenticationData();
    } catch (error) {
      clearAuthenticationData();
    }
  };

  const spotifyApiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`/api/spotify/proxy${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        await checkAuthenticationStatus();
        throw new Error('Authentication failed - please try again');
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePlay = async (songInfo) => {
    try {
      setIsLoading(true);
      
      // Format the search query based on the song info
      const query = songInfo.title + ' ' + songInfo.artist;
      
      // First search for the song
      const searchResponse = await fetch(`/api/get-stream-url`, {
        method: 'POST',
        body: JSON.stringify({ action: 'search', query }),
        headers: { 'Content-Type': "application/json"}
      });

      if(!searchResponse.ok) throw new Error('Failed to search for song');
      
      const searchResults = await searchResponse.json();
      
      if (searchResults.length === 0) {
        throw new Error('No results found for this song');
      }
      
      // Get the first result's video ID
      const videoId = searchResults[0].id;
      
      // Now get the stream URL
      const streamResponse = await fetch(`/api/get-stream-url`, {
        method: 'POST',
        body: JSON.stringify({ action: 'stream', id: videoId }),
        headers: { 'Content-Type': "application/json"}
      });

      if(!streamResponse.ok) throw new Error('Failed to fetch stream URL');

      const streamData = await streamResponse.json();
      
      // Update the song info with additional details from search if needed
      const enhancedSongInfo = {
        ...songInfo,
        // Add any additional properties from search results if needed
        videoId: videoId
      };
      
      setCurrentSong(enhancedSongInfo);
      setStreamUrl(streamData.streamUrl);
    } catch(error) {
      console.error("Error fetching stream URL:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Function to play a Spotify track
  const playSpotifyTrack = async (track) => {
    if (!track) return;
    
    try {
      // Format the song info from Spotify track data
      const songInfo = {
        id: track.id,
        title: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        image: track.album?.images?.[0]?.url || '/demo-album.jpg',
        duration: track.duration_ms,
        album: track.album?.name || 'Unknown Album'
      };
      
      // Use the handlePlay function to get and play the song
      await handlePlay(songInfo);
    } catch (error) {
      console.error("Error playing Spotify track:", error);
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
      playSpotifyTrack,
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

