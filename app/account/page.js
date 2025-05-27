"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

const AccountSettings = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('profile')

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    
    if (status === "authenticated" && session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [status, router, session])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    try {
      setMessage({ type: 'info', text: 'Updating profile...' })
      
      // Here you would make an API call to update the user profile
      // For now, we'll just simulate a successful update
      
      setTimeout(() => {
        // Update the session with the new name
        update({ name: formData.name })
        
        setIsEditing(false)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }, 1000)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' })
      return
    }
    
    try {
      setMessage({ type: 'info', text: 'Updating password...' })
      
      // Here you would make an API call to update the password
      // For now, we'll just simulate a successful update
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
        
        setMessage({ type: 'success', text: 'Password updated successfully!' })
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }, 1000)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' })
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
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
    <div className="min-h-screen bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-xl border border-purple-900/30 backdrop-blur-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Account Settings</h1>
            
            {/* Message display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'error' ? 'bg-red-900/30 text-red-200 border border-red-700/50' :
                message.type === 'success' ? 'bg-green-900/30 text-green-200 border border-green-700/50' :
                'bg-blue-900/30 text-blue-200 border border-blue-700/50'
              }`}>
                {message.text}
              </div>
            )}
            
            {/* Tabs */}
            <div className="flex border-b border-purple-900/30 mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'preferences' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
            </div>
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-900/50 mb-4 md:mb-0 md:mr-6">
                    <div className="w-full h-full flex items-center justify-center text-3xl text-white">
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || '?'}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {session?.user?.name || 'User'}
                    </h2>
                    <p className="text-gray-400">{session?.user?.email}</p>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="mt-2 px-4 py-1 text-sm bg-purple-700/30 hover:bg-purple-700/50 text-white rounded-lg transition-colors"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your email"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Account Type</h3>
                      <p className="text-white">Standard Account</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Member Since</h3>
                      <p className="text-white">May 2025</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter new password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-purple-900/30">
                  <h2 className="text-xl font-semibold text-white mb-4">Login Sessions</h2>
                  
                  <div className="bg-slate-800/30 border border-slate-700/60 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Current Session</p>
                        <p className="text-sm text-gray-400">Windows • Chrome • May 23, 2025</p>
                      </div>
                      <div className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700/50">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">App Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-2">Theme</h3>
                    <div className="flex space-x-4">
                      <button className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500"></button>
                      <button className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700"></button>
                      <button className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 border border-slate-700"></button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Audio Quality</h3>
                    <select className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="auto">Auto (Recommended)</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Higher quality uses more data</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">New releases from artists you follow</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Friend activity</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Marketing emails</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountSettings