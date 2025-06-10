"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSpotify } from '@/context/SpotifyContext'
import { Music, User } from 'lucide-react'

const Homepage = () => {
  const { isSignedIn, isLoaded, user } = useUser()
  const { 
    isSpotifyAuthenticated, 
    userProfile, 
    userPlaylists, 
    likedSongs, 
    topArtists, 
    dataLoaded,
    fetchUserData,
    handlePlay
  } = useSpotify()
  const router = useRouter()
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true)

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  // Fetch Spotify data when authenticated
  useEffect(() => {
    if (isSpotifyAuthenticated) {
      fetchUserData()
    }
    
    // Set loading state based on data loaded status
    if (isSpotifyAuthenticated) {
      if (dataLoaded.profile && dataLoaded.playlists && dataLoaded.artists) {
        setIsLoadingSpotify(false)
      }
    } else {
      setIsLoadingSpotify(false)
    }
  }, [isSpotifyAuthenticated, dataLoaded, fetchUserData])

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

  // Sample recently played tracks (fallback when not authenticated)
  const sampleRecentlyPlayed = [
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

  // Sample top artists (fallback when not authenticated)
  const sampleTopArtists = [
    { id: 1, name: "The Weeknd", image: "/artist-placeholder.png" },
    { id: 2, name: "Taylor Swift", image: "/artist-placeholder.png" },
    { id: 3, name: "Drake", image: "/artist-placeholder.png" },
    { id: 4, name: "Billie Eilish", image: "/artist-placeholder.png" },
    { id: 5, name: "Post Malone", image: "/artist-placeholder.png" },
  ]

  // Get the time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // If authenticated, show the dashboard
  return (
    <div className="text-white h-full">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}
          {user?.fullName ? `, ${user.fullName}` : ''}
          {isSpotifyAuthenticated && userProfile ? ` (${userProfile.display_name})` : ''}
        </h1>
        <p className="text-white/60">
          {isSpotifyAuthenticated 
            ? "Your Spotify music is ready to explore" 
            : "Welcome back to your music"}
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link href="/player/liked">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-4 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center mr-4">
              <span className="text-white text-xl">❤️</span>
            </div>
            <div>
              <span className="text-white font-medium block">Liked Songs</span>
              {isSpotifyAuthenticated && likedSongs.length > 0 && (
                <span className="text-white/70 text-xs">{likedSongs.length} songs</span>
              )}
            </div>
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
            <div>
              <span className="text-white font-medium block">Your Playlists</span>
              {isSpotifyAuthenticated && userPlaylists.length > 0 && (
                <span className="text-white/70 text-xs">{userPlaylists.length} playlists</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Recently played section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isSpotifyAuthenticated && likedSongs.length > 0 ? (
            // Show liked songs from Spotify (as a placeholder for recently played)
            likedSongs.slice(0, 6).map((item, index) => (
              <div 
                key={item.track.id || index} 
                className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  const songName = item.track.name;
                  const artistName = item.track.artists.map(artist => artist.name).join(', ');
                  const songInfo = {
                    title: songName,
                    artist: artistName,
                    album: item.track.album.name,
                    image: item.track.album.images && item.track.album.images.length > 0 
                      ? item.track.album.images[0].url 
                      : '/album-placeholder.png'
                  };
                  
                  // Use the full song name with artist for better search results
                  const fullSongName = `${songName} ${artistName}`;
                  handlePlay(fullSongName, songInfo);
                }}
              >
                <div className="w-full aspect-square relative">
                  {item.track.album.images && item.track.album.images.length > 0 ? (
                    <Image 
                      src={item.track.album.images[0].url} 
                      alt={item.track.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Music size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{item.track.name}</h3>
                  <p className="text-white/60 text-xs truncate">
                    {item.track.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Show sample data when not authenticated
            sampleRecentlyPlayed.map(track => (
              <div 
                key={track.id} 
                className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  const songInfo = {
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                    image: track.image
                  };
                  
                  // Use the full song name with artist for better search results
                  const fullSongName = `${track.title} ${track.artist}`;
                  handlePlay(fullSongName, songInfo);
                }}
              >
                <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Music size={24} className="text-white" />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{track.title}</h3>
                  <p className="text-white/60 text-xs truncate">{track.artist}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Playlists section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {isSpotifyAuthenticated ? 'Your Spotify Playlists' : 'Made For You'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isSpotifyAuthenticated && userPlaylists.length > 0 ? (
            // Show user playlists from Spotify
            userPlaylists.slice(0, 4).map(playlist => (
              <div 
                key={playlist.id} 
                className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="w-full aspect-square relative">
                  {playlist.images && playlist.images.length > 0 ? (
                    <Image 
                      src={playlist.images[0].url} 
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Music size={36} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1 truncate">{playlist.name}</h3>
                  <p className="text-white/60 text-sm">
                    By {playlist.owner?.display_name || 'Unknown'} • {playlist.tracks?.total || 0} tracks
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Show sample data when not authenticated
            madeForYou.map(playlist => (
              <div 
                key={playlist.id} 
                className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Music size={36} className="text-white" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1">{playlist.title}</h3>
                  <p className="text-white/60 text-sm">{playlist.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top artists section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Top Artists</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar-x">
          {isSpotifyAuthenticated && topArtists.length > 0 ? (
            // Show top artists from Spotify
            topArtists.map(artist => (
              <div 
                key={artist.id} 
                className="flex-shrink-0 w-40 bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="w-40 h-40 relative mx-auto mt-4 rounded-full overflow-hidden">
                  {artist.images && artist.images.length > 0 ? (
                    <Image 
                      src={artist.images[0].url} 
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <User size={36} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-white font-medium truncate">{artist.name}</h3>
                  <p className="text-white/60 text-sm">Artist</p>
                </div>
              </div>
            ))
          ) : (
            // Show sample data when not authenticated
            sampleTopArtists.map(artist => (
              <div 
                key={artist.id} 
                className="flex-shrink-0 w-40 bg-white/5 hover:bg-white/10 transition-colors rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mt-4 flex items-center justify-center">
                  <User size={36} className="text-white" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-white font-medium">{artist.name}</h3>
                  <p className="text-white/60 text-sm">Artist</p>
                </div>
              </div>
            ))
          )}
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

      {/* Spotify connection prompt if not connected */}
      {!isSpotifyAuthenticated && (
        <div className="mb-10 p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect to Spotify
          </h2>
          <p className="text-white/70 mb-4">
            Link your Spotify account to see your playlists, liked songs, and favorite artists.
          </p>
        </div>
      )}

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