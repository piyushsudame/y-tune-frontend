import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

export async function POST() {
  try {
    // Get the current user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();
    
    // Update user's Spotify connection status
    await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        isSpotifyConnected: false,
        accessToken: null,
        refreshToken: null,
        expiresAt: null
      }
    );
    
    // Clear the client-side authentication flag
    const response = NextResponse.json({ success: true });
    response.cookies.set('spotify_authenticated', '', {
      httpOnly: false,
      secure: true,
      maxAge: 0,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}