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
// Search by type helper function
export const searchByType = async (type, query, options = {}) => {
  const indexNameMap = {
    songs: 'songs',
    artists: 'artists', 
    albums: 'albums',
    playlists: 'playlists'
  };

  const indexName = indexNameMap[type];
  
  if (!indexName) {
    throw new Error(`Invalid search type: ${type}`);
  }

  try {
    const searchOptions = {
      query: query,
      hitsPerPage: 10,
      filters: `type:${type}`,
      ...options
    }

    const result = await client.searchSingleIndex({
      indexName: indexName,
      searchParams: searchOptions
    });

    return result.hits;
  } catch (error) {
    console.error(`Algolia search error for ${type}:`, error);
    return [];
  }
};