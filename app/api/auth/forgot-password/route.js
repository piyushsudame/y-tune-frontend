import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/user'
import { Resend } from 'resend'
import crypto from 'crypto'

// Function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    console.log('Raw API Key:', apiKey)
    console.log('API Key type:', typeof apiKey)
    console.log('API Key length:', apiKey.length)
    console.log('API Key characters:', [...apiKey].map(c => c.charCodeAt(0)))
    console.log('API Key starts with re_:', apiKey.startsWith('re_'))
    console.log('API Key contains re_re_:', apiKey.includes('re_re_'))

    // Initialize Resend with the API key directly
    const resend = new Resend(apiKey)

    await connectToDatabase()

    // Find the user by email
    const user = await User.findOne({ email })

    // Don't reveal if the user exists or not for security reasons
    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If your email is registered, you will receive a password reset link' },
        { status: 200 }
      )
    }

    // Generate a reset token and expiry
    const resetToken = generateToken()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Save the token and expiry to the user document
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Create the reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`
    console.log('Reset URL:', resetUrl)

    // Send the email using Resend
    console.log('Attempting to send email to:', email)
    console.log('Using sender:', process.env.EMAIL_FROM || 'YTune <onboarding@resend.dev>')
    
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'YTune <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your YTune Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #6d28d9;">YTune</h1>
            </div>
            
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #4b5563;">Reset Your Password</h2>
              <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              
              <p style="margin-bottom: 0;">This link will expire in 1 hour.</p>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; color: #6d28d9;">${resetUrl}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} YTune. All rights reserved.</p>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json(
          { error: `Failed to send reset email. API Key used: ${apiKey}. Error: ${error.message}` },
          { status: 500 }
        )
      }

      console.log('Email sent successfully:', data)
      return NextResponse.json(
        { success: true, message: 'Password reset email sent' },
        { status: 200 }
      )
    } catch (error) {
      console.error('Email sending error:', error)
      return NextResponse.json(
        { error: `Failed to send reset email. API Key used: ${apiKey}. Error: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
}