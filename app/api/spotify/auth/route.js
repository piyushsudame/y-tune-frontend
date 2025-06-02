import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = 'https://192.168.1.5:3000/api/auth/callback/spotify';
  const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-read-collaborative';

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scope);

  return NextResponse.json({ url: authUrl.toString() });
} 