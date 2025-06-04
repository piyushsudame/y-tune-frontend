import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';
import { auth } from '@clerk/nextjs';

export async function POST() {
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
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: session.refreshToken,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    // Calculate new expiration time
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    
    // Update the session in the database
    await SpotifySession.findOneAndUpdate(
      { userId },
      {
        accessToken: data.access_token,
        expiresAt,
        updatedAt: new Date(),
        // Update refresh token if provided
        ...(data.refresh_token ? { refreshToken: data.refresh_token } : {})
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}