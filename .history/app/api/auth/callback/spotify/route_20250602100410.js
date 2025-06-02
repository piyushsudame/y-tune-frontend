import { NextResponse } from 'next/server';
import { SPOTIFY_CONFIG } from '@/lib/spotify';

export async function GET(request) {
  // This file handles Spotify OAuth callback and token exchange
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/error?message=No code provided');
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
      }),
    });

    const data = await tokenResponse.json();
    
    // Here you would typically store the token in your database
    // associated with the user's Clerk ID

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Spotify token exchange error:', error);
    return NextResponse.redirect('/error?message=Authentication failed');
  }
} 