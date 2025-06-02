import {algoliasearch} from 'algoliasearch';

// Initialize Algolia client with sample data credentials
const client = algoliasearch(
  'latency', // This is Algolia's sample data app ID
  '6be0576ff61c053d5f9a3225e2a90f76' // This is Algolia's sample data search-only API key
);

// Initialize indices with sample data
export const songsIndex = client.initIndex('instant_search');
export const artistsIndex = client.initIndex('instant_search');
export const albumsIndex = client.initIndex('instant_search');
export const playlistsIndex = client.initIndex('instant_search');

// Search helper function
export const searchAll = async (query, options = {}) => {
  const searchOptions = {
    hitsPerPage: 10,
    ...options
  };

  try {
    const [songs, artists, albums, playlists] = await Promise.all([
      songsIndex.search(query, { ...searchOptions, filters: 'type:song' }),
      artistsIndex.search(query, { ...searchOptions, filters: 'type:artist' }),
      albumsIndex.search(query, { ...searchOptions, filters: 'type:album' }),
      playlistsIndex.search(query, { ...searchOptions, filters: 'type:playlist' })
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
      filters: `type:${type}`,
      ...options
    };

    const { hits } = await index.search(query, searchOptions);
    return hits;
  } catch (error) {
    console.error(`Algolia search error for ${type}:`, error);
    return [];
  }
}; 