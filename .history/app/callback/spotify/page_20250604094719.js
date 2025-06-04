'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSpotify } from '@/context/SpotifyContext';

export default function SpotifyCallback() {
  const router = useRouter();
  const { handleSpotifyCallback } = useSpotify();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    console.log('SpotifyCallback page: Received code from URL:', code);
    if (code) {
      console.log('SpotifyCallback page: Calling handleSpotifyCallback with code...');
      handleSpotifyCallback(code).then(() => {
        console.log('SpotifyCallback page: handleSpotifyCallback finished, redirecting to /account');
        router.push('/account');
      }).catch(error => {
        console.error('SpotifyCallback page: Error during handleSpotifyCallback:', error);
        // Optionally redirect to an error page or show a message
      });
    } else {
      console.error('SpotifyCallback page: No code received from Spotify.');
      // Handle the case where no code is received, e.g., redirect to login or error page
    }
  }, [handleSpotifyCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Connecting to Spotify...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954] mx-auto"></div>
      </div>
    </div>
  );
} 