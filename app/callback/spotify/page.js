'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSpotify } from '@/context/SpotifyContext';

export default function SpotifyCallback() {
  const router = useRouter();
  const { handleSpotifyCallback } = useSpotify();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      handleSpotifyCallback(code).then(() => {
        router.push('/account');
      });
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