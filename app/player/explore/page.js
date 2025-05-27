"use client"
import React from 'react'
import Image from 'next/image'

const ExplorePage = () => {
  // Sample categories for exploration
  const categories = [
    { id: 1, name: "Pop", color: "from-pink-500 to-red-500", emoji: "🎵" },
    { id: 2, name: "Hip Hop", color: "from-yellow-500 to-orange-500", emoji: "🎤" },
    { id: 3, name: "Rock", color: "from-red-500 to-purple-500", emoji: "🎸" },
    { id: 4, name: "Electronic", color: "from-blue-500 to-teal-500", emoji: "🎧" },
    { id: 5, name: "R&B", color: "from-purple-500 to-indigo-500", emoji: "🎹" },
    { id: 6, name: "Jazz", color: "from-green-500 to-teal-500", emoji: "🎷" },
    { id: 7, name: "Classical", color: "from-indigo-500 to-blue-500", emoji: "🎻" },
    { id: 8, name: "Country", color: "from-yellow-500 to-green-500", emoji: "🤠" },
  ]

  // Sample featured playlists
  const featuredPlaylists = [
    { id: 1, title: "Today's Hits", description: "The hottest tracks right now", songs: 50, image: "/playlist-placeholder.png" },
    { id: 2, title: "Chill Vibes", description: "Relaxing beats for your day", songs: 40, image: "/playlist-placeholder.png" },
    { id: 3, title: "Workout Mix", description: "Energy boosting tracks", songs: 35, image: "/playlist-placeholder.png" },
    { id: 4, title: "Focus Flow", description: "Concentration enhancing music", songs: 45, image: "/playlist-placeholder.png" },
  ]

  // Sample new releases
  const newReleases = [
    { id: 1, title: "New Album Title", artist: "Popular Artist", type: "Album", tracks: 12, image: "/album-placeholder.png" },
    { id: 2, title: "Single Name", artist: "Rising Star", type: "Single", tracks: 1, image: "/album-placeholder.png" },
    { id: 3, title: "EP Title", artist: "Indie Band", type: "EP", tracks: 5, image: "/album-placeholder.png" },
    { id: 4, title: "Remix Collection", artist: "DJ Something", type: "Album", tracks: 8, image: "/album-placeholder.png" },
  ]

  return (
    <div className="text-white h-full">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-white/60">Discover new music across genres and moods</p>
      </div>

      {/* Categories section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <div 
              key={category.id} 
              className={`bg-gradient-to-br ${category.color} rounded-lg p-6 cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">{category.emoji}</span>
                <h3 className="text-white font-medium text-center">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured playlists */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map(playlist => (
            <div 
              key={playlist.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-video bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">📃</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{playlist.title}</h3>
                <p className="text-white/60 text-sm mb-2">{playlist.description}</p>
                <p className="text-white/40 text-xs">{playlist.songs} songs</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New releases */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">New Releases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newReleases.map(release => (
            <div 
              key={release.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">💿</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{release.title}</h3>
                <p className="text-white/60 text-sm mb-1">{release.artist}</p>
                <p className="text-white/40 text-xs">{release.type} • {release.tracks} tracks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending now */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
        <div className="bg-white/5 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-white/60 text-left">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Album</th>
                <th className="py-3 px-4 text-right">Plays</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <tr key={item} className="hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4 text-white/60">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3">
                        <span className="text-white text-xs">🎵</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Trending Song {index + 1}</p>
                        <p className="text-white/60 text-sm">Popular Artist {index + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/60">Album Title {index + 1}</td>
                  <td className="py-3 px-4 text-white/60 text-right">{Math.floor(Math.random() * 1000000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
