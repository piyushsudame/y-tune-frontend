import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  if (!redirectUri) {
    return NextResponse.json({ error: 'Redirect URI not configured' }, { status: 500 });
  }
  const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-read-collaborative';

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scope);

  return NextResponse.json({ url: authUrl.toString() });
} 