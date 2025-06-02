import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/env';

export const SPOTIFY_CONFIG = {
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://localhost:3000/api/auth/callback/spotify',
  scopes: [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read',
  ].join(' '),
};

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    response_type: 'code',
    show_dialog: true,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};