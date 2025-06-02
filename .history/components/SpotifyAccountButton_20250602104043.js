'use client';

import { useSpotify } from '@/context/SpotifyContext';

export default function SpotifyAccountButton() {
  const { isSpotifyAuthenticated, loginToSpotify } = useSpotify();

  return (
    <div className="flex flex-col gap-4">
      {!isSpotifyAuthenticated ? (
        <Button 
          onClick={loginToSpotify}
          className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
        >
          Connect Spotify Account
        </Button>
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