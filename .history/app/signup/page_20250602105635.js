"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import Footer from '@/components/Footer'
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"

const Signup = () => {
  const { signUp, isLoaded } = useSignUp()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (!formData.terms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' '),
      })

      if (result.status === "complete") {
        setSuccess(true)
        router.push('/player')
      } else {
        setError('Failed to create account')
      }
    } catch (err) {
      if (err.errors?.[0]?.message?.includes('already exists')) {
        setError('This email is already registered. Please try logging in or use a different email.')
      } else {
        setError(err.errors?.[0]?.message || 'Failed to create account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='text-white py-14 container mx-auto w-[90vw] md:w-full'>
        <h1 className='text-center font-bold text-3xl mb-8'>Sign Up to Start Your Amazing Journey of Music on YTune!</h1>

        <div className="flex flex-col justify-center items-center">
          {/* Custom Signup Form */}
          <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm w-full max-w-md mb-6">
            {success ? (
              <div className="text-center py-4">
                <div className="text-green-400 text-xl mb-2">Account created successfully!</div>
                <p>Redirecting you to the player...</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                
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
                  <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="w-4 h-4 border border-purple-900 rounded bg-black/40 focus:ring-3 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-300">
                      I agree to the <a href="/YTune_Terms_of_Use.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="/YTune_Privacy_Policy.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                    </label>
                  </div>
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
                      Creating Account...
                    </span>
                  ) : "Create Account"}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-white">
                Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Login</Link>
              </p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="flex items-center w-full max-w-md my-4">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>
          
          {/* Social Login Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            {/* Google */}
            <button 
              onClick={() => signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.name.split(' ')[0],
                lastName: formData.name.split(' ').slice(1).join(' '),
                provider: 'google'
              })} 
              className="flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <path d="M9.827,24c0-1.524,0.253-2.986,0.705-4.356l-7.909-6.04C1.082,16.734,0.214,20.26,0.214,24c0,3.737,0.867,7.261,2.406,10.388l7.905-6.051C10.077,26.973,9.827,25.517,9.827,24" fill="#FBBC05" />
                  <path d="M23.714,10.133c3.311,0,6.302,1.174,8.652,3.094l6.836-6.827c-4.166-3.627-9.507-5.867-15.488-5.867c-9.287,0-17.268,5.311-21.09,13.071l7.909,6.04C12.355,14.112,17.549,10.133,23.714,10.133" fill="#EB4335" />
                  <path d="M23.714,37.867c-6.164,0-11.359-3.979-13.182-9.51l-7.909,6.038c4.822,7.761,12.803,13.072,21.09,13.072c5.732,0,11.205-2.035,15.311-5.849l-7.507-5.804c-2.118,1.334-4.786,2.052-7.804,2.052" fill="#34A853" />
                  <path d="M46.145,24c0-1.387-0.213-2.88-0.534-4.267H23.714v9.067h12.604c-0.63,3.091-2.346,5.468-4.8,7.014l7.507,5.804c4.314-4.004,7.121-9.969,7.121-17.618" fill="#4285F4" />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Github */}
            <button 
              onClick={() => signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.name.split(' ')[0],
                lastName: formData.name.split(' ').slice(1).join(' '),
                provider: 'github'
              })} 
              className="flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-md w-full px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z" fill="#000000" />
              </svg>
              <span>Continue with Github</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default Signup
