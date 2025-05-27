import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/user'

// This is a test endpoint to check if a token exists and is valid
// DO NOT USE IN PRODUCTION

export async function GET(request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token parameter is required' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    // Find user with this token
    const user = await User.findOne({ resetToken: token })
    
    if (!user) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'No user found with this token',
          token: token.substring(0, 10) + '...'
        },
        { status: 200 }
      )
    }
    
    // Check if token has expiry
    let isExpired = false
    let expiryInfo = null
    
    if (user.resetTokenExpiry) {
      const tokenExpiry = new Date(user.resetTokenExpiry).getTime()
      const now = Date.now()
      isExpired = tokenExpiry < now
      
      expiryInfo = {
        expiryDate: user.resetTokenExpiry,
        expiryTimestamp: tokenExpiry,
        currentTimestamp: now,
        differenceMs: tokenExpiry - now,
        isExpired
      }
    }
    
    // Return token info
    return NextResponse.json({
      valid: user && (!user.resetTokenExpiry || !isExpired),
      token: token.substring(0, 10) + '...',
      user: {
        email: user.email,
        hasResetToken: !!user.resetToken,
        hasResetTokenExpiry: !!user.resetTokenExpiry
      },
      expiry: expiryInfo
    })
  } catch (error) {
    console.error('Check token error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}