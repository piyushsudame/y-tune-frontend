import { algoliasearch } from 'algoliasearch';

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

// Connect to Algolia's sample movie index
export const moviesIndex = client.initIndex('movies');

// Basic search function
export const searchMovies = async (query, options = {}) => {
  const searchOptions = {
    hitsPerPage: 10,
    ...options
  };

  try {
    const result = await moviesIndex.search(query, searchOptions);
    return {
      hits: result.hits,
      nbHits: result.nbHits,
      page: result.page,
      nbPages: result.nbPages,
      processingTimeMS: result.processingTimeMS
    };
  } catch (error) {
    console.error('Algolia search error:', error);
    return {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      processingTimeMS: 0
    };
  }
};

// Search with filters
export const searchMoviesWithFilters = async (query, filters = {}) => {
  const searchOptions = {
    hitsPerPage: 20
  };

  // Add filters if provided
  if (filters.genre) {
    searchOptions.facetFilters = [`genre:${filters.genre}`];
  }
  
  if (filters.year) {
    searchOptions.numericFilters = [`year=${filters.year}`];
  }

  if (filters.rating) {
    searchOptions.numericFilters = searchOptions.numericFilters || [];
    searchOptions.numericFilters.push(`rating>=${filters.rating}`);
  }

  try {
    const result = await moviesIndex.search(query, searchOptions);
    return result.hits;
  } catch (error) {
    console.error('Filtered search error:', error);
    return [];
  }
};

// Get all movies (empty search)
export const getAllMovies = async (limit = 50) => {
  try {
    const result = await moviesIndex.search('', {
      hitsPerPage: limit
    });
    return result.hits;
  } catch (error) {
    console.error('Error fetching all movies:', error);
    return [];
  }
};

// Get movie by objectID
export const getMovieById = async (objectID) => {
  try {
    const movie = await moviesIndex.getObject(objectID);
    return movie;
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    return null;
  }
};

// Get facets (available genres, years, etc.)
export const getMovieFacets = async (facetName) => {
  try {
    const result = await moviesIndex.searchForFacetValues(facetName, '');
    return result.facetHits;
  } catch (error) {
    console.error(`Error fetching ${facetName} facets:`, error);
    return [];
  }
};