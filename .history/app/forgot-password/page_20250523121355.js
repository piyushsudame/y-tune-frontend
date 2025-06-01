"use client"
import React, { useState } from 'react'
import Link from "next/link"
import Footer from '@/components/Footer'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate email
    if (!email) {
      setError('Email is required')
      setLoading(false)
      return
    }

    console.log('Submitting forgot password request for email:', email)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('Forgot password response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err.message || 'Failed to send reset email')
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='text-white py-14 container mx-auto'>
        <h1 className='text-center font-bold text-3xl mb-8'>Reset Your Password</h1>

        <div className="flex flex-col justify-center items-center">
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm w-full max-w-md mb-6">
            {success ? (
              <div className="text-center">
                <div className="mb-4 text-green-400 text-5xl flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
                <p className="text-gray-300 mb-4">
                  We've sent a password reset link to <span className="font-medium text-purple-400">{email}</span>
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  If you don't see it, check your spam folder or try again.
                </p>
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-300 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="your@email.com" 
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
                        Sending...
                      </span>
                    ) : "Send Reset Link"}
                  </button>
                </form>
              </>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-white">
                Remember your password? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Back to login</Link>
              </p>
            </div>
          </div>
          
          <div className="w-full max-w-md text-center mt-4">
            <p className="text-gray-400 text-sm">
              If you're still having trouble, please <Link href="/contact" className="text-purple-400 hover:text-purple-300">contact support</Link>.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  )
}

export default ForgotPassword