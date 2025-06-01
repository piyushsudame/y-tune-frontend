"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import Sidebar from './Sidebar'
import { UserButton, useAuth } from "@clerk/nextjs"

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/80 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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
                  <Image src="/logo1.png" alt="Logo of YTune" fill className="object-contain"/>         
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
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
                      className="block w-full p-2 pl-10 text-sm bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="Search for Songs or Playlists or artists"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop Login/Signup */}
            <div className="hidden md:flex login items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href={"/?force=true"} className="block px-3 py-2 rounded-md text-white bg-slate-800/60 border border-slate-700/60">
                  Home
                </Link>
                <Link href={"/about"} className="block px-3 py-2 rounded-md text-white bg-slate-800/60 border border-slate-700/60">
                  About
                </Link>
                <Link href={"/player"} className="block px-3 py-2 rounded-md text-white bg-slate-800/60 border border-slate-700/60">
                  Player
                </Link>
                <div className="px-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
export default Navbar
