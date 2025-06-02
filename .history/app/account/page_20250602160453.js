"use client"
import React from 'react'
import Footer from '@/components/Footer'
import { UserButton } from '@clerk/nextjs'
import SpotifyAccountButton from "@/components/SpotifyAccountButton"

const AccountSettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black/30 backdrop-blur-sm">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Your Account</h1>
        <p className="text-gray-300 mb-8">Click the button below to view and edit your profile, security, and connected accounts.</p>
        
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-32 h-32' } }} />
        <SpotifyAccountButton />
      </div>
      <Footer />
    </div>
  )
}

export default AccountSettings