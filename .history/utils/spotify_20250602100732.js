const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function fetchWithToken(endpoint, token) {
  if (!token) throw new Error('No token provided');
  
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}

export const spotifyEndpoints = {
  userProfile: '/me',
  userPlaylists: '/me/playlists',
  userLibrary: '/me/tracks',
  userTopTracks: '/me/top/tracks',
  userTopArtists: '/me/top/artists',
  search: '/search',
  album: (id) => `/albums/${id}`,
  artist: (id) => `/artists/${id}`,
  playlist: (id) => `/playlists/${id}`,
  track: (id) => `/tracks/${id}`,
}; 