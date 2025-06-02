import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  try {
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
        code,
        redirect_uri: 'https://y-tune-frontend.vercel.app/api/auth/callback/spotify',
      }),
    });

    const data = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(data.error_description || 'Failed to get access token');
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/account', request.url));
    
    // Set access token cookie (1 hour)
    response.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });
    
    // Set refresh token cookie (30 days)
    response.cookies.set('spotify_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    return response;
  } catch (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.redirect(new URL('/account', request.url));
  }
} 