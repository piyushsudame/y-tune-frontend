import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';

export async function POST(request) {
  try {
    
    // Try to get userId from auth first
    const { userId: authUserId } = auth();
    
    // If auth fails, try to get userId from request body
    let userId = authUserId;
    let bodyUserId;
    
    try {
      const body = await request.json();
      bodyUserId = body.userId;;
    } catch (e) {
        console.error('[Spotify Refresh] No userId in request body or invalid JSON');
    }
    
    // Use bodyUserId if authUserId is not available
    if (!userId && bodyUserId) {
      userId = bodyUserId;
    }
    
    if (!userId) {
      console.error('[Spotify Refresh] No user ID found in auth or request body');
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Connect to the database
      ('[Spotify Refresh] Connecting to database...');
    await connectToDatabase();
      ('[Spotify Refresh] Database connected');
    
    // Find the user's Spotify session
      ('[Spotify Refresh] Finding session for user:', userId);
    const session = await SpotifySession.findOne({ userId });
      ('[Spotify Refresh] Session found:', session ? 'Yes' : 'No');
    
    if (!session) {
      console.error('[Spotify Refresh] No Spotify session found for user:', userId);
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
      console.error('[Spotify Refresh] Token refresh failed:', data);
      throw new Error(data.error_description || 'Failed to refresh token');
    }
    
    // Calculate new expiration time
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    
    // Update the session in the database
      ('[Spotify Refresh] Updating session in database...');
    const updatedSession = await SpotifySession.findOneAndUpdate(
      { userId },
      {
        accessToken: data.access_token,
        expiresAt,
        updatedAt: new Date(),
        // Update refresh token if provided
        ...(data.refresh_token ? { refreshToken: data.refresh_token } : {})
      },
      { new: true }
    );
    
    if (updatedSession) {
        ('[Spotify Refresh] Updated session expires at:', updatedSession.expiresAt);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Spotify Refresh] Error in refresh process:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}