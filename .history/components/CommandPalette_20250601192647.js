"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchAll } from '@/utils/algolia'
import { useDebounce } from '@/hooks/useDebounce'

const CommandPalette = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setResults({
          songs: [],
          artists: [],
          albums: [],
          playlists: []
        })
        return
      }

      setIsLoading(true)
      try {
        const searchResults = await searchAll(debouncedSearchQuery)
        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery])

  const handleResultClick = (type, item) => {
    onClose()
    // Navigate to the appropriate page based on the result type
    switch (type) {
      case 'songs':
        router.push(`/player/song/${item.objectID}`)
        break
      case 'artists':
        router.push(`/player/artist/${item.objectID}`)
        break
      case 'albums':
        router.push(`/player/album/${item.objectID}`)
        break
      case 'playlists':
        router.push(`/player/playlist/${item.objectID}`)
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Command palette */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, albums, or playlists..."
              className="w-full p-4 pl-12 text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Results */}
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {/* Songs */}
                {results.songs.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Songs</h3>
                    <div className="space-y-1">
                      {results.songs.map((song) => (
                        <button
                          key={song.objectID}
                          onClick={() => handleResultClick('songs', song)}
                          className="w-full p-2 text-left text-white hover:bg-slate-800 rounded-lg flex items-center"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3">
                            <span className="text-white text-xs">🎵</span>
                          </div>
                          <div>
                            <p className="font-medium">{song.name}</p>
                            <p className="text-sm text-gray-400">{song.artist}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists */}
                {results.artists.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Artists</h3>
                    <div className="space-y-1">
                      {results.artists.map((artist) => (
                        <button
                          key={artist.objectID}
                          onClick={() => handleResultClick('artists', artist)}
                          className="w-full p-2 text-left text-white hover:bg-slate-800 rounded-lg flex items-center"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs">👤</span>
                          </div>
                          <div>
                            <p className="font-medium">{artist.name}</p>
                            <p className="text-sm text-gray-400">{artist.genre}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Albums */}
                {results.albums.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Albums</h3>
                    <div className="space-y-1">
                      {results.albums.map((album) => (
                        <button
                          key={album.objectID}
                          onClick={() => handleResultClick('albums', album)}
                          className="w-full p-2 text-left text-white hover:bg-slate-800 rounded-lg flex items-center"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3">
                            <span className="text-white text-xs">💿</span>
                          </div>
                          <div>
                            <p className="font-medium">{album.name}</p>
                            <p className="text-sm text-gray-400">{album.artist}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playlists */}
                {results.playlists.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Playlists</h3>
                    <div className="space-y-1">
                      {results.playlists.map((playlist) => (
                        <button
                          key={playlist.objectID}
                          onClick={() => handleResultClick('playlists', playlist)}
                          className="w-full p-2 text-left text-white hover:bg-slate-800 rounded-lg flex items-center"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-3">
                            <span className="text-white text-xs">📃</span>
                          </div>
                          <div>
                            <p className="font-medium">{playlist.name}</p>
                            <p className="text-sm text-gray-400">{playlist.creator}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {!searchQuery && (
                  <div className="text-center text-gray-400 py-8">
                    Start typing to search
                  </div>
                )}

                {searchQuery && !isLoading && Object.values(results).every(arr => arr.length === 0) && (
                  <div className="text-center text-gray-400 py-8">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Press <kbd className="px-2 py-1 text-xs bg-slate-800 rounded">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette 