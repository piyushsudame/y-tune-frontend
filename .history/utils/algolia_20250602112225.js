import { algoliasearch } from 'algoliasearch'

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
)

export { client };

// Initialize indices
export const INDEX_NAMES = {
  SONGS: 'songs',
  ARTISTS: 'artists',
  ALBUMS: 'albums',
  PLAYLISTS: 'playlists'
};

export async function searchAll(query) {
  try {
    const [songsResults, artistsResults, albumsResults, playlistsResults] = await Promise.all([
      client.index(INDEX_NAMES.SONGS).search(query, {
        attributesToRetrieve: ['objectID', 'name', 'artist', 'album'],
        hitsPerPage: 5
      }),
      client.index(INDEX_NAMES.ARTISTS).search(query, {
        attributesToRetrieve: ['objectID', 'name', 'genre'],
        hitsPerPage: 5
      }),
      client.index(INDEX_NAMES.ALBUMS).search(query, {
        attributesToRetrieve: ['objectID', 'name', 'artist'],
        hitsPerPage: 5
      }),
      client.index(INDEX_NAMES.PLAYLISTS).search(query, {
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
  const indexName = {
    songs: INDEX_NAMES.SONGS,
    artists: INDEX_NAMES.ARTISTS,
    albums: INDEX_NAMES.ALBUMS,
    playlists: INDEX_NAMES.PLAYLISTS
  }[type];

  if (!indexName) {
    throw new Error(`Invalid search type: ${type}`);
  }

  try {
    const searchOptions = {
      hitsPerPage: 10,
      filters: `type:${type}`,
      ...options
    };

    const { hits } = await client.index(indexName).search(query, searchOptions);
    return hits;
  } catch (error) {
    console.error(`Algolia search error for ${type}:`, error);
    return [];
  }
}; 