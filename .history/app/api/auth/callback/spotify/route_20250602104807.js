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
        redirect_uri: 'https://localhost:3000/api/auth/callback/spotify',
      }),
    });

    const data = await tokenResponse.json();
    
    // Create a response that redirects to the account page
    const response = NextResponse.redirect(new URL('/account', request.url));
    
    // Set the token in a cookie
    response.cookies.set('spotify_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expires_in, // Spotify token expiry time
    });

    return response;
  } catch (error) {
    console.error('Spotify token error:', error);
    return NextResponse.redirect(new URL('/account', request.url));
  }
} 