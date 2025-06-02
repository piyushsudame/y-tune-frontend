import { NextResponse } from 'next/server';

export async function GET(request) {
  // This file fetches user's playlists from Spotify
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
  }
} 