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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Get the session from the database
    const dbUser = await User.findOne({ clerkId });

    if (!dbUser) {
      console.error('No session found for user');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    if(!dbUser.isSpotifyConnected) {
      console.error('Spotify not connected for user');
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 401 });
    }

    // Check if the session is expired
    if (new Date() > dbUser.expiresAt) {
      console.error('Session expired');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Only validate with Spotify if the token isn't expired based on our local data
    // This prevents unnecessary API calls that could lead to loops
    if (new Date() <= dbUser.expiresAt) {
      return NextResponse.json({ valid: true });
    } else {
      console.error('Session expired based on local data');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}