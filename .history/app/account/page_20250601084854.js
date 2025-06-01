"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

const AccountSettings = () => {
  const { isSignedIn, isLoaded, user } = useAuth()
  const router = useRouter()

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your account settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="bg-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-900/30">
          <div className="flex items-center space-x-4 mb-6">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <p className="text-gray-400">
                Manage your account settings and preferences through the Clerk dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountSettings