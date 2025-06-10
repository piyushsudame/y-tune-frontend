'use client';

import { useSpotify } from '@/context/SpotifyContext';
import { useCallback } from 'react';

/**
 * A hook for handling music playback across the application
 * This centralizes playback logic so it can be used consistently across routes
 */
export function usePlayback() {
  const { playSpotifyTrack, handlePlay, isLoading } = useSpotify();

  /**
   * Play a Spotify track
   * @param {Object} track - The Spotify track object
   */
  const playTrack = useCallback((track) => {
    if (!track) return;
    playSpotifyTrack(track);
  }, [playSpotifyTrack]);

  /**
   * Play a track from a custom source
   * @param {Object} songInfo - Object containing song information
   * @param {string} songInfo.title - Song title
   * @param {string} songInfo.artist - Song artist
   * @param {string} songInfo.image - Image URL
   * @param {number} songInfo.duration - Duration in ms
   * @param {string} songInfo.album - Album name
   */
  const playCustomTrack = useCallback((songInfo) => {
    if (!songInfo?.title || !songInfo?.artist) return;
    handlePlay(songInfo);
  }, [handlePlay]);

  /**
   * Play the first track from a playlist
   * @param {Array} tracks - Array of tracks
   * @param {boolean} isSpotifyPlaylist - Whether this is a Spotify playlist
   */
  const playFirstFromPlaylist = useCallback((tracks, isSpotifyPlaylist = true) => {
    if (!tracks || tracks.length === 0) return;
    
    if (isSpotifyPlaylist) {
      // For Spotify playlists, tracks might be in a different format
      const firstTrack = tracks[0]?.track || tracks[0];
      playSpotifyTrack(firstTrack);
    } else {
      // For custom playlists
      const firstTrack = tracks[0];
      handlePlay(firstTrack);
    }
  }, [playSpotifyTrack, handlePlay]);

  return {
    playTrack,
    playCustomTrack,
    playFirstFromPlaylist,
    isLoading
  };
}