"use client"
import React, { useState } from 'react'
import Image from 'next/image'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // Sample search results - in a real app, these would come from an API
  const searchResults = {
    songs: [
      { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
      { id: 2, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47" },
      { id: 3, title: "Bad Habit", artist: "Steve Lacy", album: "Gemini Rights", duration: "3:52" },
      { id: 4, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:59" },
    ],
    artists: [
      { id: 1, name: "The Weeknd", followers: "85.4M", image: "/artist-placeholder.png" },
      { id: 2, name: "Harry Styles", followers: "65.8M", image: "/artist-placeholder.png" },
      { id: 3, name: "Steve Lacy", followers: "12.3M", image: "/artist-placeholder.png" },
    ],
    albums: [
      { id: 1, title: "After Hours", artist: "The Weeknd", year: "2020", image: "/album-placeholder.png" },
      { id: 2, title: "Harry's House", artist: "Harry Styles", year: "2022", image: "/album-placeholder.png" },
      { id: 3, title: "Gemini Rights", artist: "Steve Lacy", year: "2022", image: "/album-placeholder.png" },
    ],
    playlists: [
      { id: 1, title: "Today's Top Hits", creator: "YTune", songs: 50, image: "/playlist-placeholder.png" },
      { id: 2, title: "Chill Vibes", creator: "YTune", songs: 40, image: "/playlist-placeholder.png" },
      { id: 3, title: "Workout Mix", creator: "YTune", songs: 35, image: "/playlist-placeholder.png" },
    ]
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ]

  return (
    <div className="text-white h-full">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 custom-scrollbar-x">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search results */}
      <div className="space-y-8">
        {/* Songs section */}
        {(activeFilter === 'all' || activeFilter === 'songs') && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Songs</h2>
            <div className="bg-white/5 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-left">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Album</th>
                    <th className="py-3 px-4 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.songs.map((song, index) => (
                    <tr key={song.id} className="hover:bg-white/10 transition-colors">
                      <td className="py-3 px-4 text-white/60">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3">
                            <span className="text-white text-xs">🎵</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{song.title}</p>
                            <p className="text-white/60 text-sm">{song.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">{song.album}</td>
                      <td className="py-3 px-4 text-white/60 text-right">{song.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Artists section */}
        {(activeFilter === 'all' || activeFilter === 'artists') && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Artists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.artists.map(artist => (
                <div key={artist.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 cursor-pointer">
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">👤</span>
                  </div>
                  <h3 className="text-white font-medium text-center">{artist.name}</h3>
                  <p className="text-white/60 text-sm text-center">{artist.followers} followers</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums section */}
        {(activeFilter === 'all' || activeFilter === 'albums') && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Albums</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.albums.map(album => (
                <div key={album.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 cursor-pointer">
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">💿</span>
                  </div>
                  <h3 className="text-white font-medium">{album.title}</h3>
                  <p className="text-white/60 text-sm">{album.artist} • {album.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists section */}
        {(activeFilter === 'all' || activeFilter === 'playlists') && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.playlists.map(playlist => (
                <div key={playlist.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 cursor-pointer">
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">📃</span>
                  </div>
                  <h3 className="text-white font-medium">{playlist.title}</h3>
                  <p className="text-white/60 text-sm">By {playlist.creator} • {playlist.songs} songs</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar-x::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}

export default SearchPage