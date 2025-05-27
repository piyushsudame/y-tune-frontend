"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Footer from '@/components/Footer'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [tokenValid, setTokenValid] = useState(true)
  const [validating, setValidating] = useState(true)
  const [tokenInfo, setTokenInfo] = useState(null)

  useEffect(() => {
    // Redirect if no token is provided
    if (!token) {
      router.push('/forgot-password')
      return
    }

    // Validate token on page load
    const validateToken = async () => {
      try {
        setValidating(true)
        // Only in development, check if token exists and is valid
        if (process.env.NODE_ENV !== 'production') {
          const response = await fetch(`/api/auth/check-token?token=${token}`)
          const data = await response.json()
          console.log('Token validation result:', data)
          setTokenInfo(data)
          setTokenValid(data.valid)
        }
      } catch (err) {
        console.error('Token validation error:', err)
        // Don't set token as invalid on validation error
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token, router])

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
    if (!formData.password || !formData.confirmPassword) {
      setError('Both fields are required')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    console.log('Submitting reset password request with token:', token?.substring(0, 10) + '...')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      })

      const data = await response.json()
      console.log('Reset password response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
      toast.success('Password reset successful!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message || 'Failed to reset password')
      toast.error(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return null // Don't render anything while redirecting
  }

  return (
    <>
      <div className='text-white py-14 container mx-auto'>
        <h1 className='text-center font-bold text-3xl mb-8'>Reset Your Password</h1>

        <div className="flex flex-col justify-center items-center">
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm w-full max-w-md mb-6">
            {validating ? (
              // Loading state while validating token
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-300">Validating your reset link...</p>
              </div>
            ) : success ? (
              // Success state
              <div className="text-center">
                <div className="mb-4 text-green-400 text-5xl flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Password Reset Successful!</h2>
                <p className="text-gray-300 mb-4">
                  Your password has been updated successfully.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  You'll be redirected to the login page in a moment...
                </p>
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Go to Login
                </Link>
              </div>
            ) : !tokenValid ? (
              // Invalid token state
              <div className="text-center">
                <div className="mb-4 text-red-400 text-5xl flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Invalid or Expired Link</h2>
                <p className="text-gray-300 mb-4">
                  This password reset link is invalid or has expired.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Please request a new password reset link.
                </p>
                <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium">
                  Request New Link
                </Link>
                
                {/* Debug info in development */}
                {process.env.NODE_ENV !== 'production' && tokenInfo && (
                  <div className="mt-6 p-3 bg-gray-800 rounded-lg text-left text-xs">
                    <h4 className="font-medium text-gray-300 mb-1">Debug Info:</h4>
                    <pre className="text-gray-400 overflow-auto">
                      {JSON.stringify(tokenInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              // Form state
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">New Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="••••••••" 
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg font-medium text-white hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}

export default ResetPassword