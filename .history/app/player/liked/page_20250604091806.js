"use client"
import React, { useState, useEffect } from 'react'
import { useSpotify } from '@/context/SpotifyContext'
import Image from 'next/image'
import { Heart, Clock, Play, MoreHorizontal } from 'lucide-react'

const LikedSongs = () => {
  const { isSpotifyAuthenticated, likedSongs, dataLoaded, fetchLikedSongs } = useSpotify()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSpotifyAuthenticated && !dataLoaded.likedSongs) {
      fetchLikedSongs()
    }
    
    if (dataLoaded.likedSongs || !isSpotifyAuthenticated) {
      setIsLoading(false)
    }
  }, [isSpotifyAuthenticated, dataLoaded.likedSongs, fetchLikedSongs])

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isSpotifyAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Connect to Spotify</h2>
        <p className="text-white/60 mb-6">Sign in with your Spotify account to see your liked songs</p>
      </div>
    )
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center rounded-lg shadow-lg">
          <Heart size={64} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase">Playlist</p>
          <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
          <div className="flex items-center text-sm text-white/60">
            <p>{likedSongs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <Play size={24} className="text-black ml-1" />
        </button>
      </div>

      {/* Songs table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-auto">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/60 text-sm">
              <th className="px-4 py-2 w-12">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Album</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2 w-12 text-center"><Clock size={16} /></th>
              <th className="px-4 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((item, index) => (
              <tr 
                key={item.track.id} 
                className="hover:bg-white/5 group transition-colors"
              >
                <td className="px-4 py-3 text-white/60">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.track.album.images && item.track.album.images.length > 0 ? (
                      <div className="w-10 h-10 relative flex-shrink-0">
                        <Image 
                          src={item.track.album.images[item.track.album.images.length - 1].url} 
                          alt={item.track.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-white/10 rounded flex-shrink-0"></div>
                    )}
                    <div>
                      <p className="font-medium">{item.track.name}</p>
                      <p className="text-sm text-white/60">
                        {item.track.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/60">{item.track.album.name}</td>
                <td className="px-4 py-3 text-white/60">{formatDate(item.added_at)}</td>
                <td className="px-4 py-3 text-white/60 text-center">{formatDuration(item.track.duration_ms)}</td>
                <td className="px-4 py-3">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={20} className="text-white/60" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LikedSongs
