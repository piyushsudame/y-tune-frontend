import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // Get the current user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();
    
    // Find the user's Spotify session
    const session = await SpotifySession.findOne({ userId });
    
    if (!session) {
      return NextResponse.json({ error: 'No Spotify session found' }, { status: 401 });
    }
    
    // Check if the token is expired
    if (new Date() > new Date(session.expiresAt)) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    
    // Validate the token with Spotify
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}