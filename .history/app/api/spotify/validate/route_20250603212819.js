import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';

export async function GET(request) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    const userId = user?.id;
    console.log('Validate request for user:', userId);

    console.log()
    
    if (!userId) {
      console.error('No user found in auth');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();
    console.log('Database connected for validation');

    // Get the session from the database
    const session = await SpotifySession.findOne({ userId });
    console.log('Session found:', session ? 'yes' : 'no');

    if (!session) {
      console.error('No session found for user');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Check if the session is expired
    if (new Date() > session.expiresAt) {
      console.error('Session expired');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Validate the token with Spotify
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Invalid token with Spotify');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Session validated successfully');
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}