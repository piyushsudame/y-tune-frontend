'use client';

import React from 'react';
import Image from 'next/image';
import { useSpotify } from '@/context/SpotifyContext';
import { User, LogOut } from 'lucide-react';

const SpotifyUserProfile = () => {
  const { isSpotifyAuthenticated, isLoading, userProfile, logoutSpotify } = useSpotify();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-2 rounded-lg bg-white/5">
        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!isSpotifyAuthenticated || !userProfile) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-2">
        {userProfile.images && userProfile.images.length > 0 ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={userProfile.images[0].url}
              alt={userProfile.display_name || 'Spotify User'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        )}
        <div className="text-sm">
          <p className="font-medium text-white truncate max-w-[120px]">
            {userProfile.display_name || 'Spotify User'}
          </p>
          <p className="text-xs text-white/60">
            {userProfile.product === 'premium' ? 'Premium' : 'Free'}
          </p>
        </div>
      </div>
      
      <button 
        onClick={logoutSpotify}
        className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        title="Logout from Spotify"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

export default SpotifyUserProfile;