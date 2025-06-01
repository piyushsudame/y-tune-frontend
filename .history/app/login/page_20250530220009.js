"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import Footer from '@/components/Footer'
import { useRouter } from "next/navigation"

const Login = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    // TODO: Implement Clerk authentication
    setLoading(false)
  }

  return (
    <>
      <div className='z-[300] text-white py-14 container mx-auto w-[90vw] md:w-full'>
        <h1 className='text-center font-bold text-3xl mb-8'>Login to Start Listening Again!</h1>

        <div className="flex flex-col justify-center items-center">
          {/* Custom Login Form */}
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm w-full max-w-md mb-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="••••••••" 
                  required 
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login
