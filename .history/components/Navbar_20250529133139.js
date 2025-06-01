"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
  const { data: session, status} = useSession()
  const isAuthenticated = status === "authenticated"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  // Handle window resize
  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth)
    
    // Update window width when resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // Close mobile menu if screen becomes larger than mobile breakpoint
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className='relative max-h-[10vh] h-[10vh] min-h-18 w-full flex flex-wrap items-center justify-between px-4 md:px-6 bg-gradient-to-r from-black/70 via-purple-950/40 to-black/70 backdrop-blur-sm border-b border-purple-900/30'>
      {/* Logo - always visible */}
      <Link href={"/"} className="py-2 flex items-center">
        <div className="logo relative h-full w-20 md:w-28">
          <Image src="/logo1.png" alt="Logo of YTune" fill className="object-contain"/>         
        </div>
      </Link>

      {/* Mobile menu button - only visible on small screens */}
      <button 
        className="lg:hidden ml-auto text-white p-2 focus:outline-none z-50"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Navigation container - changes layout based on screen size */}
      <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:w-auto lg:order-1 absolute lg:relative top-[10vh] lg:top-0 left-0`}>
        {/* Navigation links */}
        <div className="flex flex-col lg:flex-row lg:items-center order-2 lg:order-1 w-full lg:w-auto">
          <ul className="flex flex-col lg:flex-row gap-2 lg:gap-5 text-white lg:ml-4 mb-4 lg:mb-0">
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full text-center" href={"/?force=true"}><li>Home</li></Link>
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full text-center" href={"/about"}><li>About</li></Link>
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full text-center" href={"/player"}><li>Player</li></Link>
          </ul>
        </div>

        {/* Search bar - conditionally rendered */}
        <div className="search w-full lg:flex-grow lg:max-w-xl lg:mx-8 order-1 lg:order-2 mb-4 lg:mb-0">
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
        
        {/* Login/Signup buttons */}
        <div className="login flex flex-col lg:flex-row items-center order-3 w-full lg:w-auto mb-4 lg:mb-0">
          {isAuthenticated ? (
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
              <Link href={"/account"} className="w-full lg:w-auto text-center lg:text-left mb-2 lg:mb-0">
                <div className="text-white">
                  <span className="mr-2">Hello,</span>
                  <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
                </div>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="cursor-pointer text-white bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full lg:w-auto"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link href={"/signup"} className="w-full sm:w-auto">
                <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-purple-600/90 to-indigo-700/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                  Signup
                </button>
              </Link>
              <Link href={"/login"} className="w-full sm:w-auto">
                <button type="button" className="cursor-pointer text-white bg-gradient-to-r from-indigo-700/90 to-purple-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar