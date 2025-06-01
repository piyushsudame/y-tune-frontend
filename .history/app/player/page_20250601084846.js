"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const Homepage = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your music experience...</p>
        </div>
      </div>
    )
  }

  // Sample recently played tracks
  const recentlyPlayed = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", image: "/album-placeholder.png" },
    { id: 2, title: "As It Was", artist: "Harry Styles", album: "Harry's House", image: "/album-placeholder.png" },
    { id: 3, title: "Bad Habit", artist: "Steve Lacy", album: "Gemini Rights", image: "/album-placeholder.png" },
    { id: 4, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", image: "/album-placeholder.png" },
    { id: 5, title: "Stay", artist: "The Kid LAROI, Justin Bieber", album: "F*CK LOVE 3+", image: "/album-placeholder.png" },
    { id: 6, title: "Easy On Me", artist: "Adele", album: "30", image: "/album-placeholder.png" },
  ]

  // Sample made for you playlists
  const madeForYou = [
    { id: 1, title: "Daily Mix 1", description: "The Weeknd, Dua Lipa and more", image: "/playlist-placeholder.png" },
    { id: 2, title: "Daily Mix 2", description: "Post Malone, Drake and more", image: "/playlist-placeholder.png" },
    { id: 3, title: "Discover Weekly", description: "Your weekly mixtape of fresh music", image: "/playlist-placeholder.png" },
    { id: 4, title: "Release Radar", description: "Catch all the latest music from artists you follow", image: "/playlist-placeholder.png" },
  ]

  // Sample top artists
  const topArtists = [
    { id: 1, name: "The Weeknd", image: "/artist-placeholder.png" },
    { id: 2, name: "Taylor Swift", image: "/artist-placeholder.png" },
    { id: 3, name: "Drake", image: "/artist-placeholder.png" },
    { id: 4, name: "Billie Eilish", image: "/artist-placeholder.png" },
    { id: 5, name: "Post Malone", image: "/artist-placeholder.png" },
  ]

  // If authenticated, show the dashboard
  return (
    <div className="text-white h-full">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Good afternoon{session?.user?.name ? `, ${session.user.name}` : ''}</h1>
        <p className="text-white/60">Welcome back to your music</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link href="/player/liked">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center mr-4">
              <span className="text-white text-xl">❤️</span>
            </div>
            <span className="text-white font-medium">Liked Songs</span>
          </div>
        </Link>
        <Link href="/player/recent">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center mr-4">
              <span className="text-white text-xl">🕒</span>
            </div>
            <span className="text-white font-medium">Recently Played</span>
          </div>
        </Link>
        <Link href="/player/library">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center mr-4">
              <span className="text-white text-xl">📃</span>
            </div>
            <span className="text-white font-medium">Your Playlists</span>
          </div>
        </Link>
      </div>

      {/* Recently played section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyPlayed.map(track => (
            <div 
              key={track.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-2xl">🎵</span>
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate">{track.title}</h3>
                <p className="text-white/60 text-xs truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Made for you section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Made For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {madeForYou.map(playlist => (
            <div 
              key={playlist.id} 
              className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl">📃</span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-1">{playlist.title}</h3>
                <p className="text-white/60 text-sm">{playlist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top artists section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Top Artists</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar-x">
          {topArtists.map(artist => (
            <div 
              key={artist.id} 
              className="flex-shrink-0 w-40 bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mt-4 flex items-center justify-center">
                <span className="text-white text-4xl">👤</span>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-white font-medium">{artist.name}</h3>
                <p className="text-white/60 text-sm">Artist</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Charts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer">
            <div className="relative w-full aspect-video bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <span className="text-white text-4xl">🏆</span>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <h3 className="text-white font-medium text-center">Top 50 Global</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer">
            <div className="relative w-full aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-4xl">🌎</span>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <h3 className="text-white font-medium text-center">Top 50 USA</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer">
            <div className="relative w-full aspect-video bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <span className="text-white text-4xl">🔥</span>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <h3 className="text-white font-medium text-center">Viral Hits</h3>
              </div>
            </div>
          </div>
        </div>
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

export default Homepage