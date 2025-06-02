import { algoliasearch } from 'algoliasearch'

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
)

export { client };

// Initialize indices
const songsIndex = client.initIndex('songs');
const artistsIndex = client.initIndex('artists');
const albumsIndex = client.initIndex('albums');
const playlistsIndex = client.initIndex('playlists');

export { songsIndex, artistsIndex, albumsIndex, playlistsIndex };

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