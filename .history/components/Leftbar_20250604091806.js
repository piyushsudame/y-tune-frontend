"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSpotify } from '@/context/SpotifyContext'
import SpotifyUserProfile from './SpotifyUserProfile'
import { Music } from 'lucide-react'

const Leftbar = () => {
  const { isSpotifyAuthenticated, userPlaylists, dataLoaded, fetchUserPlaylists } = useSpotify();
  const [isGridView, setIsGridView] = useState(true);
  
  // Sample playlists data (fallback when not authenticated)
  const samplePlaylists = [
    { id: 1, name: 'Chill Vibes', songs: 12 },
    { id: 2, name: 'Workout Mix', songs: 15 },
    { id: 3, name: 'Study Focus', songs: 8 },
    { id: 4, name: 'Road Trip', songs: 20 },
    { id: 5, name: 'Party Hits', songs: 18 },
    { id: 6, name: 'Relaxing Piano', songs: 10 },
  ];

  useEffect(() => {
    if (isSpotifyAuthenticated && !dataLoaded.playlists) {
      fetchUserPlaylists();
    }
  }, [isSpotifyAuthenticated, dataLoaded.playlists, fetchUserPlaylists]);

  // Use Spotify playlists if authenticated, otherwise use sample data
  const playlists = isSpotifyAuthenticated && userPlaylists.length > 0
    ? userPlaylists.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        songs: playlist.tracks?.total || 0,
        image: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : null
      }))
    : samplePlaylists;

  return (
    <div className='h-full flex flex-col p-4 overflow-hidden bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg'>
      {/* Spotify User Profile */}
      <div className="mb-4">
        <SpotifyUserProfile />
      </div>
      
      {/* Navigation Menu */}
      <div className='mb-6'>
        <h2 className='text-white/80 text-sm font-semibold mb-4 pl-2'>MENU</h2>
        <ul className='space-y-3'>
          <Link href={"/player"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/home.png" alt="Home" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Home</span>
            </li>
          </Link>
          
          <Link href={"/player/library"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/library.svg" style={{ filter: "invert(1)" }} alt="Library" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Library</span>
            </li>
          </Link>
          
          <Link href={"/player/downloads"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/download.png" style={{ filter: "invert(1)" }} alt="Downloads" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Downloads</span>
            </li>
          </Link>

          <Link href={"/player/chat"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/chat.png" alt="Chat" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Chat</span>
            </li>
          </Link>

          <Link href={"/player/liked"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/liked music.png" alt="Liked Music" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Liked Music</span>
            </li>
          </Link>          
          
          <Link href={"/player/explore"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <Image src="/explore.svg" style={{ filter: "invert(1)" }} alt="Explore" width={20} height={20} />
              </div>
              <span className='ml-3 text-sm'>Explore</span>
            </li>
          </Link>
          
          <Link href={"/player/podcasts"}>
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <div className='w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-xs'>🎙️</div>
              </div>
              <span className='ml-3 text-sm'>Podcasts</span>
            </li>
          </Link>
        </ul>
      </div>
      
      {/* Divider */}
      <div className='border-t border-white/10 my-2'></div>
      
      {/* Playlists Section */}
      <div className='flex-1 overflow-hidden'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white/80 text-sm font-semibold pl-2'>
            {isSpotifyAuthenticated ? 'SPOTIFY PLAYLISTS' : 'YOUR PLAYLISTS'}
          </h2>
          <button 
            onClick={() => setIsGridView(!isGridView)}
            className='text-white/70 hover:text-white text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors'
          >
            {isGridView ? 'List View' : 'Grid View'}
          </button>
        </div>
        
        <div className='overflow-y-auto h-full pr-2 custom-scrollbar'>
          {isGridView ? (
            <div className='grid grid-cols-2 gap-3'>
              {playlists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className='bg-white/5 hover:bg-white/10 p-3 rounded-lg cursor-pointer transition-colors'
                >
                  <div className='w-full aspect-square rounded-md mb-2 overflow-hidden'>
                    {playlist.image ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={playlist.image} 
                          alt={playlist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center'>
                        <Music size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className='text-white text-xs font-medium truncate'>{playlist.name}</p>
                  <p className='text-white/60 text-xs'>{playlist.songs} songs</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-2'>
              {playlists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className='flex items-center bg-white/5 hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-colors'
                >
                  <div className='w-10 h-10 rounded-md overflow-hidden mr-3'>
                    {playlist.image ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={playlist.image} 
                          alt={playlist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center'>
                        <Music size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className='text-white text-xs font-medium truncate max-w-[120px]'>{playlist.name}</p>
                    <p className='text-white/60 text-xs'>{playlist.songs} songs</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}

export default Leftbar
