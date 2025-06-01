import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { isSocialAccount: false },
        { status: 200 }
      );
    }
    
    // Check if this is a social account (no password)
    const isSocialAccount = !user.password;
    
    // Determine the provider (this is a simplification, in a real app you might store the provider)
    // For now we'll just assume it's either Google or GitHub
    let provider = 'Social Login';
    if (user.email.includes('gmail.com')) {
      provider = 'Google';
    } else if (user.email.includes('github')) {
      provider = 'GitHub';
    }
    
    return NextResponse.json(
      { 
        isSocialAccount,
        provider: isSocialAccount ? provider : null
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Check social account error:', error);
    return NextResponse.json(
      { error: 'Failed to check account' },
      { status: 500 }
    );
  }
}