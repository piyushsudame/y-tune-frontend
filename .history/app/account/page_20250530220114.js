"use client"
import React, { useState } from 'react'
import Footer from '@/components/Footer'
import Image from 'next/image'

const AccountSettings = () => {
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
      
      // TODO: Implement Clerk profile update
      
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
      
      // TODO: Implement Clerk password update
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
      
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white py-14">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-purple-900/30">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-2 ${
                activeTab === 'profile'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-2 ${
                activeTab === 'security'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Security
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-2xl">
            {activeTab === 'profile' && (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-900/50 mb-4 md:mb-0 md:mr-6">
                    <div className="w-full h-full flex items-center justify-center text-3xl text-white">
                      {/* TODO: Implement Clerk user avatar */}
                      ?
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {/* TODO: Implement Clerk user name */}
                      User
                    </h2>
                    <p className="text-gray-400">
                      {/* TODO: Implement Clerk user email */}
                      user@example.com
                    </p>
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
                    {message.text && (
                      <div className={`p-3 rounded-lg ${
                        message.type === 'error' 
                          ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                          : message.type === 'success'
                          ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                          : 'bg-blue-500/20 border border-blue-500/50 text-blue-200'
                      }`}>
                        {message.text}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Name</h3>
                      <p className="text-white">
                        {/* TODO: Implement Clerk user name */}
                        User
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                      <p className="text-white">
                        {/* TODO: Implement Clerk user email */}
                        user@example.com
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {message.text && (
                    <div className={`p-3 rounded-lg ${
                      message.type === 'error' 
                        ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                        : message.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                        : 'bg-blue-500/20 border border-blue-500/50 text-blue-200'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-white mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AccountSettings