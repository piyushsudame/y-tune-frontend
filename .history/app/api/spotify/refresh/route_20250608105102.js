import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

export async function POST(request) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    const clerkId = user?.id;
    
    if (!clerkId) {
      console.error('[Spotify Refresh] No user found in auth');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Connect to the database
    console.log('[Spotify Refresh] Connecting to database...');
    await connectToDatabase();
    console.log('[Spotify Refresh] Database connected');
    
    // Find the user in the database
    console.log('[Spotify Refresh] Finding user:', clerkId);
    const dbUser = await User.findOne({ clerkId });
    console.log('[Spotify Refresh] User found:', dbUser ? 'Yes' : 'No');
    
    if (!dbUser) {
      console.error('[Spotify Refresh] No user found in database:', clerkId);
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    if (!dbUser.isSpotifyConnected) {
      console.error('[Spotify Refresh] Spotify not connected for user:', clerkId);
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 401 });
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
        refresh_token: dbUser.refreshToken,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[Spotify Refresh] Token refresh failed:', data);
      throw new Error(data.error_description || 'Failed to refresh token');
    }
    
    // Calculate new expiration time
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    
    // Update the user in the database
    console.log('[Spotify Refresh] Updating user in database...');
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        accessToken: data.access_token,
        expiresAt,
        // Update refresh token if provided
        ...(data.refresh_token ? { refreshToken: data.refresh_token } : {})
      },
      { new: true }
    );
    
    if (updatedUser) {
      console.log('[Spotify Refresh] User updated successfully');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Spotify Refresh] Error in refresh process:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}