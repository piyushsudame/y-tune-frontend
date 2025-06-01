"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Leftbar = () => {
  const [isGridView, setIsGridView] = useState(true);
  
  // Sample playlists data (replace with actual data)
  const playlists = [
    { id: 1, name: 'Chill Vibes', songs: 12 },
    { id: 2, name: 'Workout Mix', songs: 15 },
    { id: 3, name: 'Study Focus', songs: 8 },
    { id: 4, name: 'Road Trip', songs: 20 },
    { id: 5, name: 'Party Hits', songs: 18 },
    { id: 6, name: 'Relaxing Piano', songs: 10 },
  ];

  return (
    <div className='h-full flex flex-col p-4 overflow-hidden bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg'>
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

          <Link href="/account">
            <li className='flex items-center text-white hover:text-purple-300 transition-colors cursor-pointer'>
              <div className='w-8 h-8 relative flex items-center justify-center'>
                <div className='w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-xs'>👤</div>
              </div>
              <span className='ml-3 text-sm'>Account Settings</span>
            </li>
          </Link>
        </ul>
      </div>
      
      {/* Divider */}
      <div className='border-t border-white/10 my-2'></div>
      
      {/* Playlists Section */}
      <div className='flex-1 overflow-hidden'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white/80 text-sm font-semibold pl-2'>YOUR PLAYLISTS</h2>
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
                  <div className='w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md mb-2 flex items-center justify-center'>
                    <span className='text-white text-2xl'>🎵</span>
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
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3'>
                    <span className='text-white text-sm'>🎵</span>
                  </div>
                  <div>
                    <p className='text-white text-xs font-medium'>{playlist.name}</p>
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
