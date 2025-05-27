import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/user'
import crypto from 'crypto'

// This is a test endpoint to verify that reset tokens are working correctly
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
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Generate a test token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    console.log('Generated test token:', resetToken.substring(0, 10) + '...')
    console.log('Token expiry (ISO):', resetTokenExpiry.toISOString())
    console.log('Token expiry (timestamp):', resetTokenExpiry.getTime())
    console.log('Current time (ISO):', new Date().toISOString())
    console.log('Current time (timestamp):', Date.now())
    console.log('Difference (ms):', resetTokenExpiry.getTime() - Date.now())
    
    // Save to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    
    try {
      await user.save()
      console.log('User saved with test reset token')
    } catch (saveError) {
      console.error('Error saving user with test reset token:', saveError)
      throw saveError
    }
    
    // Return token info
    return NextResponse.json({
      success: true,
      message: 'Test reset token generated',
      email: user.email,
      resetToken,
      resetTokenExpiry,
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    })
  } catch (error) {
    console.error('Test token error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}