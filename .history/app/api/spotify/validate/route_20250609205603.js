import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

export async function GET(request) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    const clerkId = user?.id;
    
    if (!clerkId) {
      console.error('No user found in auth');
      return NextResponse.json({ error: 'Not authenticated', valid: false }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Get the session from the database
    const dbUser = await User.findOne({ clerkId });

    if (!dbUser) {
      console.error('No session found for user');
      return NextResponse.json({ error: 'No session found', valid: false }, { status: 401 });
    }

    if(!dbUser.isSpotifyConnected) {
      console.error('Spotify not connected for user');
      return NextResponse.json({ error: 'Spotify not connected', valid: false }, { status: 401 });
    }

    // Check if the session is expired
    if (new Date() > dbUser.expiresAt) {
      console.error('Session expired');
      return NextResponse.json({ error: 'Session expired', valid: false }, { status: 401 });
    }

    // If we reach here, the user is authenticated and the session is valid
    return NextResponse.json({ 
      valid: true,
      isSpotifyConnected: dbUser.isSpotifyConnected,
      expiresAt: dbUser.expiresAt
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: error.message, valid: false }, { status: 500 });
  }
}