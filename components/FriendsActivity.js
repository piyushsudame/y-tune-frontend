"use client"
import React, { useState } from 'react'
import Image from 'next/image'

const FriendsActivity = () => {
  // Sample friends data - replace with your actual data source
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/avatar-placeholder.png", // Replace with actual avatar path
      online: true,
      currentlyPlaying: {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        startedAt: "10 minutes ago"
      }
    },
    {
      id: 2,
      name: "Jamie Smith",
      avatar: "/avatar-placeholder.png",
      online: true,
      currentlyPlaying: {
        title: "As It Was",
        artist: "Harry Styles",
        album: "Harry's House",
        startedAt: "2 minutes ago"
      }
    },
    {
      id: 3,
      name: "Taylor Wilson",
      avatar: "/avatar-placeholder.png",
      online: false,
      lastSeen: "3 hours ago",
      currentlyPlaying: null
    },
    {
      id: 4,
      name: "Jordan Lee",
      avatar: "/avatar-placeholder.png",
      online: true,
      currentlyPlaying: {
        title: "Bad Habit",
        artist: "Steve Lacy",
        album: "Gemini Rights",
        startedAt: "Just now"
      }
    },
    {
      id: 5,
      name: "Casey Morgan",
      avatar: "/avatar-placeholder.png",
      online: true,
      currentlyPlaying: {
        title: "Glimpse of Us",
        artist: "Joji",
        album: "Smithereens",
        startedAt: "5 minutes ago"
      }
    },
    {
      id: 6,
      name: "Riley Parker",
      avatar: "/avatar-placeholder.png",
      online: false,
      lastSeen: "1 day ago",
      currentlyPlaying: null
    }
  ]);

  return (
    <div className="h-full bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-medium">Friend Activity</h2>
        <p className="text-white/60 text-xs mt-1">See what your friends are listening to</p>
      </div>
      
      {/* Friends list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {friends.map(friend => (
          <div key={friend.id} className="mb-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center mb-2">
              {/* Avatar with online indicator */}
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                  {/* If you have actual avatars, use this: */}
                  {/* <Image src={friend.avatar} alt={friend.name} width={40} height={40} className="object-cover" /> */}
                  <span className="text-white text-sm">{friend.name.charAt(0)}</span>
                </div>
                {friend.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-900/80"></div>
                )}
              </div>
              
              {/* Name and status */}
              <div className="flex-1">
                <h3 className="text-white text-sm font-medium">{friend.name}</h3>
                <p className="text-white/60 text-xs">
                  {friend.online ? 'Online' : `Last seen ${friend.lastSeen}`}
                </p>
              </div>
            </div>
            
            {/* Currently playing */}
            {friend.online && friend.currentlyPlaying && (
              <div className="ml-12 bg-white/5 rounded-lg p-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-md flex items-center justify-center mr-2">
                    <span className="text-white text-xs">🎵</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white text-xs font-medium truncate">{friend.currentlyPlaying.title}</p>
                    <p className="text-white/60 text-xs truncate">{friend.currentlyPlaying.artist}</p>
                    <div className="flex items-center mt-1">
                      <div className="h-1 bg-white/20 rounded-full flex-1 mr-2">
                        <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: Math.random() * 100 + '%' }}></div>
                      </div>
                      <span className="text-white/40 text-xs">{friend.currentlyPlaying.startedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Find friends button */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
          Find Friends
        </button>
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

export default FriendsActivity
