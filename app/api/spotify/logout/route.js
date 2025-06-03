import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear all Spotify cookies
  response.cookies.set('spotify_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
  
  response.cookies.set('spotify_refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
  
  response.cookies.set('spotify_authenticated', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
  
  return response;
}