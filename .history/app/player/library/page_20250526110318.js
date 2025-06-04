"use client"
import React, { useState } from 'react'
import Image from 'next/image'

const Library = () => {
  const [activeTab, setActiveTab] = useState('playlists')
  
  // Sample data for library
  const libraryData = {
    playlists: [
      { id: 1, title: "My Favorites", songs: 42, createdBy: "You", lastUpdated: "2 days ago", image: "/playlist-placeholder.png" },
      { id: 2, title: "Workout Mix", songs: 28, createdBy: "You", lastUpdated: "1 week ago", image: "/playlist-placeholder.png" },
      { id: 3, title: "Chill Vibes", songs: 35, createdBy: "You", lastUpdated: "3 days ago", image: "/playlist-placeholder.png" },
      { id: 4, title: "Road Trip", songs: 50, createdBy: "You", lastUpdated: "1 month ago", image: "/playlist-placeholder.png" },
      { id: 5, title: "Party Hits", songs: 32, createdBy: "You", lastUpdated: "2 weeks ago", image: "/playlist-placeholder.png" },
    ],
    albums: [
      { id: 1, title: "After Hours", artist: "The Weeknd", year: "2020", songs: 14, image: "/album-placeholder.png" },
      { id: 2, title: "Harry's House", artist: "Harry Styles", year: "2022", songs: 13, image: "/album-placeholder.png" },
      { id: 3, title: "Gemini Rights", artist: "Steve Lacy", year: "2022", songs: 10, image: "/album-placeholder.png" },
      { id: 4, title: "Dreamland", artist: "Glass Animals", year: "2020", songs: 16, image: "/album-placeholder.png" },
    ],
    artists: [
      { id: 1, name: "The Weeknd", followers: "85.4M", albums: 5, image: "/artist-placeholder.png" },
      { id: 2, name: "Harry Styles", followers: "65.8M", albums: 3, image: "/artist-placeholder.png" },
      { id: 3, name: "Steve Lacy", followers: "12.3M", albums: 2, image: "/artist-placeholder.png" },
      { id: 4, name: "Glass Animals", followers: "8.7M", albums: 3, image: "/artist-placeholder.png" },
      { id: 5, name: "Dua Lipa", followers: "74.2M", albums: 2, image: "/artist-placeholder.png" },
    ],
    podcasts: [
      { id: 1, title: "Music History", publisher: "YTune Studios", episodes: 45, image: "/podcast-placeholder.png" },
      { id: 2, title: "Behind the Lyrics", publisher: "Music Insights", episodes: 32, image: "/podcast-placeholder.png" },
      { id: 3, title: "Artist Interviews", publisher: "YTune Originals", episodes: 28, image: "/podcast-placeholder.png" },
    ]
  }

  const tabs = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'podcasts', label: 'Podcasts' },
  ]

  return (
    <div className="text-white h-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Library</h1>
        <p className="text-white/60">All your music in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-white/10 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg text-sm ${
              activeTab === tab.id
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Filter your library"
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70 hover:bg-white/20">
            Recently Added
          </button>
          <button className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70 hover:bg-white/20">
            Alphabetical
          </button>
          <button className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70 hover:bg-white/20">
            Creator
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Create playlist card */}
          <div className="bg-gradient-to-br from-purple-500/30 to-indigo-600/30 hover:from-purple-500/40 hover:to-indigo-600/40 transition-colors rounded-lg overflow-hidden cursor-pointer border border-white/10">
            <div className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-white font-medium mb-2">Create Playlist</h3>
              <p className="text-white/60 text-sm">Start a new collection of songs</p>
            </div>
          </div>
          
          {/* Playlist cards */}
          {libraryData.playlists.map(playlist => (
            <div 
              key={playlist.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">📃</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{playlist.title}</h3>
                <p className="text-white/60 text-sm">Playlist • {playlist.songs} songs</p>
                <p className="text-white/40 text-xs mt-2">Last updated {playlist.lastUpdated}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {libraryData.albums.map(album => (
            <div 
              key={album.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">💿</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{album.title}</h3>
                <p className="text-white/60 text-sm">{album.artist} • {album.year}</p>
                <p className="text-white/40 text-xs mt-2">{album.songs} songs</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {libraryData.artists.map(artist => (
            <div 
              key={artist.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer p-4"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-4xl">👤</span>
              </div>
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">{artist.name}</h3>
                <p className="text-white/60 text-sm">Artist • {artist.followers} followers</p>
                <p className="text-white/40 text-xs mt-2">{artist.albums} albums</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'podcasts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {libraryData.podcasts.map(podcast => (
            <div 
              key={podcast.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">🎙️</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{podcast.title}</h3>
                <p className="text-white/60 text-sm">{podcast.publisher}</p>
                <p className="text-white/40 text-xs mt-2">{podcast.episodes} episodes</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Library
