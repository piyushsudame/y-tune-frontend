"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
  const { data: session, status} = useSession()
  const isAuthenticated = status === "authenticated"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='z-[9999] max-h-[10vh] w-full flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-black/70 via-purple-950/40 to-black/70 backdrop-blur-sm border-b border-purple-900/30'>
      <Link href={"/"}>
        <div className="logo relative h-12 w-12 md:h-16 md:w-16">
          <Image src="/logo1.png" alt="Logo of YTune" fill className="object-contain"/>         
        </div>
      </Link>

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
        {isAuthenticated && (
          <div className="relative">
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
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop Login/Signup */}
      <div className="hidden md:flex login items-center">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link href={"/account"}>
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
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="z-[9999] absolute top-[10vh] left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-purple-900/30 md:hidden">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              <Link href={"/?force=true"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">Home</Link>
              <Link href={"/about"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">About</Link>
              <Link href={"/player"} className="text-white bg-slate-800/60 border border-slate-700/60 p-2 rounded-lg">Player</Link>
            </div>

            {/* Mobile Search - Only show if authenticated */}
            {isAuthenticated && (
              <div className="relative mt-3">
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
                </div>
              </div>
            )}

            {/* Mobile Login/Signup */}
            <div className="flex flex-col space-y-2 mt-3">
              {isAuthenticated ? (
                <>
                  <Link href={"/account"}>
                  <div className="text-white p-2">
                    <span>Hello, </span>
                    <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>
                  </div>
                  </Link>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full cursor-pointer text-white bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href={"/signup"}>
                    <button type="button" className="w-full cursor-pointer text-white bg-gradient-to-r from-purple-600/90 to-indigo-700/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      Signup
                    </button>
                  </Link>
                  <Link href={"/login"}>
                    <button type="button" className="w-full cursor-pointer text-white bg-gradient-to-r from-indigo-700/90 to-purple-600/90 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar