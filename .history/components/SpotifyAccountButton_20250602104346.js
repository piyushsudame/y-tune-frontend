'use client';

import { useSpotify } from '@/context/SpotifyContext';

export default function SpotifyAccountButton() {
  const { isSpotifyAuthenticated, loginToSpotify } = useSpotify();

  return (
    <div className="flex flex-col gap-4">
      {!isSpotifyAuthenticated ? (
        <button 
          onClick={loginToSpotify}
          className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-700 rounded-full font-medium text-white hover:opacity-90 transition-all"
        >
          Connect Spotify Account
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">Spotify Account Connected</p>
          <a 
            href="https://spotify.com/account" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Manage your Spotify account
          </a>
        </div>
      )}
    </div>
  );
} 