"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import Sidebar from './Sidebar'
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import SpotifyButton from './SpotifyButton'

const Navbar = () => {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      router.push(`/player/search?q=${encodeURIComponent(debouncedSearchQuery)}`)
    }
  }, [debouncedSearchQuery, router])

  return (
    <>
      <nav className='z-[9999] min-h-[10vh] max-h-[10vh] w-full flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-black/70 via-purple-950/40 to-black/70 backdrop-blur-sm border-b border-purple-900/30'>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href={"/"}>
            <div className="logo relative h-12 w-12 md:h-16 md:w-16">
              <Image src="/logo1.png" alt="Logo of YTune" fill sizes='64px' className="object-contain"/>         
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <ul className="flex gap-5 text-white ml-4">
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/?force=true"}><li>Home</li></Link>
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/about"}><li>About</li></Link>
            <Link className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-full" href={"/player"}><li>Player</li></Link>
          </ul>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block search flex-grow max-w-xl mx-8">
          {isSignedIn && (
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full p-2 pl-10 text-sm bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Search for Songs or Playlists or artists"
                />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Login/Signup */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-white hover:text-purple-400 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile Login/Signup */}
        <div className="md:hidden">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && createPortal(
        <div className="z-[9999] fixed top-[10vh] left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-purple-900/30 md:hidden">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              <Link href={"/?force=true"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">Home</Link>
              <Link href={"/about"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">About</Link>
              <Link href={"/player"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">Player</Link>
            </div>

            {/* Mobile Login/Signup */}
            {!isSignedIn && (
              <div className="flex flex-col space-y-2 pt-2">
                <SignInButton mode="modal">
                  <button className="w-full text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full text-white bg-purple-600 p-2 rounded-lg">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Sidebar */}
      {isSidebarOpen && createPortal(
        <Sidebar onClose={() => setIsSidebarOpen(false)} />,
        document.body
      )}
    </>
  )
}

export default Navbar