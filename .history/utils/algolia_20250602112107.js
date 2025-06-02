import { algoliasearch } from 'algoliasearch'

// Initialize Algolia client
const client = algoliasearch('YOUR_APP_ID', 'YOUR_API_KEY');

// Export the client and index names
export { client };

// Export index names as constants for consistency
export const INDEX_NAMES = {
  SONGS: 'songs',
  ARTISTS: 'artists',
  ALBUMS: 'albums',
  PLAYLISTS: 'playlists'
};

export async function searchAll(query) {
  try {
    const [songsResults, artistsResults, albumsResults, playlistsResults] = await Promise.all([
      songsIndex.search(query, {
        attributesToRetrieve: ['objectID', 'name', 'artist', 'album'],
        hitsPerPage: 5
      }),
      artistsIndex.search(query, {
        attributesToRetrieve: ['objectID', 'name', 'genre'],
        hitsPerPage: 5
      }),
      albumsIndex.search(query, {
        attributesToRetrieve: ['objectID', 'name', 'artist'],
        hitsPerPage: 5
      }),
      playlistsIndex.search(query, {
        attributesToRetrieve: ['objectID', 'name', 'creator'],
        hitsPerPage: 5
      })
    ])

    return {
      songs: songsResults.hits,
      artists: artistsResults.hits,
      albums: albumsResults.hits,
      playlists: playlistsResults.hits
    }
  } catch (error) {
    console.error('Algolia search error:', error)
    throw error
  }
}

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