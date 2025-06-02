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
    try {
      const results = await client.search({
        requests: [
          {
            indexName: 'songs',
            query: query,
            params: {
              attributesToRetrieve: ['objectID', 'name', 'artist', 'album'],
              hitsPerPage: 5
            }
          },
          {
            indexName: 'artists',
            query: query,
            params: {
              attributesToRetrieve: ['objectID', 'name', 'genre'],
              hitsPerPage: 5
            }
          },
          {
            indexName: 'albums',
            query: query,
            params: {
              attributesToRetrieve: ['objectID', 'name', 'artist'],
              hitsPerPage: 5
            }
          },
          {
            indexName: 'playlists',
            query: query,
            params: {
              attributesToRetrieve: ['objectID', 'name', 'creator'],
              hitsPerPage: 5
            }
          }
        ]
      });
    
      return {
        songs: results.results[0].hits,
        artists: results.results[1].hits,
        albums: results.results[2].hits,
        playlists: results.results[3].hits
      };
    } catch (error) {
      console.error('Algolia search error:', error);
      throw error;
    }
  } catch (error) {
  
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