"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import Footer from '@/components/Footer'
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"

const Login = () => {
  const { data: session, status } = useSession() 
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/player")
    }
  }, [status, router])

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

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // Check if this might be a social login account
        try {
          await fetch('/api/auth/check-social-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          })
          .then(res => res.json())
          .then(data => {
            if (data.isSocialAccount) {
              setError(`This email is registered with ${data.provider}. Please use the "${data.provider}" login button below.`)
            } else {
              setError('Invalid email or password')
            }
          })
        } catch (checkErr) {
          // If the check fails, show the generic error
          setError('Invalid email or password')
        }
      } else {
        // Redirect will happen automatically via the useEffect
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='z-[] text-white py-14 container mx-auto w-[90vw] md:w-full'>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                  <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot your password?
                  </Link>
                </div>
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
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg font-medium text-white hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : "Sign In"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-white">
                New to YTune? <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">Sign up now!</Link>
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
              onClick={() => signIn("google", { callbackUrl: '/player' })} 
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
              onClick={() => signIn("github", { callbackUrl: '/player' })} 
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

export default Login
