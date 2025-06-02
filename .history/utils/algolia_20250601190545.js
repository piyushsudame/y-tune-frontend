import {algoliasearch} from 'algoliasearch';

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

// Initialize indices
export const songsIndex = client.initIndex('songs');
export const artistsIndex = client.initIndex('artists');
export const albumsIndex = client.initIndex('albums');
export const playlistsIndex = client.initIndex('playlists');

// Search helper function
export const searchAll = async (query, options = {}) => {
  const searchOptions = {
    hitsPerPage: 10,
    ...options
  };

  try {
    const [songs, artists, albums, playlists] = await Promise.all([
      songsIndex.search(query, searchOptions),
      artistsIndex.search(query, searchOptions),
      albumsIndex.search(query, searchOptions),
      playlistsIndex.search(query, searchOptions)
    ]);

    return {
      songs: songs.hits,
      artists: artists.hits,
      albums: albums.hits,
      playlists: playlists.hits
    };
  } catch (error) {
    console.error('Algolia search error:', error);
    return {
      songs: [],
      artists: [],
      albums: [],
      playlists: []
    };
  }
};

// Search by type helper function
export const searchByType = async (type, query, options = {}) => {
  const index = {
    songs: songsIndex,
    artists: artistsIndex,
    albums: albumsIndex,
    playlists: playlistsIndex
  }[type];

  if (!index) {
    throw new Error(`Invalid search type: ${type}`);
  }

  try {
    const searchOptions = {
      hitsPerPage: 10,
      ...options
    };

    const { hits } = await index.search(query, searchOptions);
    return hits;
  } catch (error) {
    console.error(`Algolia search error for ${type}:`, error);
    return [];
  }
}; 