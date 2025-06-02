import { NextResponse } from 'next/server';
import { SPOTIFY_CONFIG } from '@/lib/spotify';

export async function GET() {
  // This file handles Spotify OAuth initiation
  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    response_type: 'code',
    show_dialog: true,
  }).toString()}`;

  return NextResponse.redirect(authUrl);
} 