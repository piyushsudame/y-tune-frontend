// app/api/auth/callback/spotify/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://y-tune-frontend.vercel.app';

  if (!redirectUri) {
    console.error('Redirect URI not configured');
    return NextResponse.redirect(`${baseUrl}/?error=config_error`);
  }

  if (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=spotify_auth_failed`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
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
    
    // Create response and set cookies
    const response = NextResponse.redirect(`${baseUrl}/?spotify_auth=success`);
    
    // Set secure cookies
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });
    
    response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Set authentication flag
    response.cookies.set('spotify_authenticated', 'true', {
      httpOnly: false, // This needs to be readable by client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}