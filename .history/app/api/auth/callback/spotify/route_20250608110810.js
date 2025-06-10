// app/api/auth/callback/spotify/route.js
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/user';

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
    const userId = user?.id;
    
    if (!userId) {
      console.error('No user found in auth');
      return NextResponse.redirect(`${baseUrl}/?error=not_authenticated`);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      let errorData;
      try {
        errorData = await tokenResponse.json();
        console.error('Token exchange error:', errorData);
      } catch (e) {
        console.error('Failed to parse token error response:', await tokenResponse.text(), e);
      }
      console.error('Token exchange failed with status:', tokenResponse.status);
      return NextResponse.redirect(`${baseUrl}/?error=token_exchange_failed&status=${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    
    await connectToDatabase();
    
    // Calculate token expiration time
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    
    // Store the tokens in the database
    const session = await SpotifySession.findOneAndUpdate(
      { userId },
      {
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    if (session) {
      
    } else {
      console.error('Failed to save/update session.');
    }

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