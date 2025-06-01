"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import Sidebar from './Sidebar'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
              <Image src="/logo1.png" alt="Logo of YTune" fill className="object-contain"/>         
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex login items-center">
          {/* TODO: Implement Clerk authentication */}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-b from-slate-900 to-purple-900/20 p-4">
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col space-y-2 mt-3">
                {/* TODO: Implement Clerk authentication */}
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
              </div>
            </div>
          </div>,
          typeof window !== "undefined" ? document.body : null
        )}
      </nav>
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

export default Navbar