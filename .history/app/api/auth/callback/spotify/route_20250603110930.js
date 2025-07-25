// app/api/auth/callback/spotify/route.js
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongoose';
import SpotifySession from '@/lib/spotifySession';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!redirectUri) {
    console.error('Redirect URI not configured');
    return NextResponse.redirect(`${baseUrl}/?error=config_error`);
  }

  if (!baseUrl) {
    console.error('Base URL not configured');
    return NextResponse.redirect('/?error=config_error');
  }

  if (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=spotify_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // Get the current user from Clerk
    const user = await currentUser();
    console.log('Callback received for user:', user?.id);
    
    if (!user?.id) {
      console.error('No user found in auth');
      return NextResponse.redirect(`${baseUrl}/?error=not_authenticated`);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect(`${baseUrl}/?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful, storing session...');
    
    // Connect to the database
    await connectToDatabase();
    console.log('Database connected');
    
    // Calculate token expiration time
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    
    // Store the tokens in the database
    const session = await SpotifySession.findOneAndUpdate(
      { userId: user.id },
      {
        userId: user.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('Session stored:', session ? 'success' : 'failed');
    
    // Set a non-httpOnly cookie just to indicate authentication status to the client
    const response = NextResponse.redirect(`${baseUrl}/?spotify_auth=success`);
    response.cookies.set('spotify_authenticated', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}