import { NextResponse } from 'next/server';

export async function GET(request) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token found' }, { status: 401 });
  }

  try {
    // Validate the token with Spotify
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}