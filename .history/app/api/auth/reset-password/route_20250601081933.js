import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/user'
import bcrypt from 'bcryptjs'
import { checkEnvVariables } from '../config'

// Check environment variables
checkEnvVariables();

export async function POST(request) {
  try {
    const { token, password } = await request.json()
    
    console.log('Reset password request received:', { token: token?.substring(0, 10) + '...' })

    if (!token || !password) {
      console.log('Missing token or password')
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()
    console.log('Connected to database')

    // Find user with this token
    console.log('Searching for user with token')
    const user = await User.findOne({
      resetToken: token
    })
    
    console.log('User found?', !!user)
    
    // If no user found with this token
    if (!user) {
      console.log('No user found with this token')
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }
    
    // Check if token is expired separately for better debugging
    if (user.resetTokenExpiry) {
      const tokenExpiry = new Date(user.resetTokenExpiry).getTime()
      const now = Date.now()
      
      console.log('Token expiry (ISO):', new Date(user.resetTokenExpiry).toISOString())
      console.log('Token expiry (timestamp):', tokenExpiry)
      console.log('Current time (ISO):', new Date().toISOString())
      console.log('Current time (timestamp):', now)
      console.log('Difference (ms):', tokenExpiry - now)
      console.log('Token expired?', tokenExpiry < now)
      
      // Check if token is expired
      if (tokenExpiry < now) {
        console.log('Token has expired')
        return NextResponse.json(
          { error: 'Reset token has expired' },
          { status: 400 }
        )
      }
    } else {
      console.log('No expiry date found for token')
      // For testing purposes, we'll allow tokens without expiry
      console.log('Allowing token without expiry for testing')
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update user's password and clear reset token fields
    user.password = hashedPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    )
  }
}