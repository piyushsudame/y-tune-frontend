"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
  const { data: session, status} = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <nav className='h-18 w-full flex items-center justify-between px-6 bg-gradient-to-r from-black/70 via-purple-950/40 to-black/70 backdrop-blur-sm border-b border-purple-900/30'>
      <Link href={"/"}>
        <div className="logo relative h-28 w-28">
          <Image src="/logo1.png" alt="Logo of YTune" fill className="object-contain"/>         
        </div>
      </Link>

      <div className="flex items-center">
        <ul className="flex gap-5 text-white ml-4">
          <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/?force=true"}><li>Home</li></Link>
          <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/about"}><li>About</li></Link>
          <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/player"}><li>Player</li></Link>
        </ul>
      </div>

      {/* This div will take up space even when empty to maintain layout */}
      <div className="search flex-grow max-w-xl mx-8">
        {isAuthenticated && (
          <div className="relative">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Search for Songs or Playlists or artists"
              />
              
              {/* Spinner */}
              {/* 
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-4 h-4 border-2 border-t-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              */}
            </div>
            
            {/* Search Results Dropdown - Hidden by default, would be shown when searching */}
            {/* 
            <div className="absolute z-10 w-full mt-2 bg-slate-900/90 border border-slate-700/80 rounded-lg shadow-lg max-h-96 overflow-y-auto backdrop-blur-sm">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-slate-800/80 transition-colors duration-150">
                  <Link href="#" className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-purple-800/60 rounded-md flex items-center justify-center text-white font-bold overflow-hidden">
                        <Image 
                          src="/demo-album.jpg" 
                          alt="Song thumbnail" 
                          width={40} 
                          height={40} 
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">Song Title</p>
                      <p className="text-sm text-gray-400">Song • Artist Name</p>
                    </div>
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-slate-800/80 transition-colors duration-150">
                  <Link href="#" className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-purple-800/60 rounded-md flex items-center justify-center text-white font-bold overflow-hidden">
                        <span>P</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-white">Playlist Name</p>
                      <p className="text-sm text-gray-400">Playlist</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            */}
            
            {/* No results state - also hidden by default */}
            {/* 
            <div className="absolute z-10 w-full mt-2 bg-slate-900/90 border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-sm">
              <div className="px-4 py-3 text-sm text-gray-400">
                No results found matching your search
              </div>
            </div>
            */}
          </div>
        )}
      </div>
      
      
      
      <div className="login flex items-center">
        {isAuthenticated? (
          <div className="flex items-center gap-4">
            <Link href={/account}>
              <div className="text-white">
                <span className="mr-2">Hello,</span>
                <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
              </div>
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="cursor-pointer text-white bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Logout
            </button>
          </div>
        ) : (
        <>
          <Link href={"/signup"}>
            <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-purple-600/90 to-indigo-700/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-3">
              Signup
            </button>
          </Link>
          <Link href={"/login"}>
            <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-indigo-700/90 to-purple-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Login
            </button>
          </Link>
        </>)}
        
      </div>
    </nav>
  )
}

export default Navbar