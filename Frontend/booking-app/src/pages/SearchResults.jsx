import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../components/constants';
import PropertyCards from '../components/PropertyCards';
import { ArrowLeft } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || ''
  });


  const performSearch = async (searchFilters = filters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (searchFilters.query) queryParams.append('query', searchFilters.query);
      if (searchFilters.location) queryParams.append('location', searchFilters.location);
      if (searchFilters.type) queryParams.append('type', searchFilters.type);

      const response = await fetch(`${BASE_URL}/api/properties/search?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const derivedFilters = {
      query: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || ''
    };

    setFilters(derivedFilters);

    if (derivedFilters.query || derivedFilters.location || derivedFilters.type) {
      performSearch(derivedFilters);
    } else {
      setSearchResults([]);
    }
  }, [searchParams]);


  const onCardClick = (id) => {
    navigate(`/property-details/${id}`);
  };

  const getSearchSummary = () => {
    const parts = [];
    if (filters.query) parts.push(`"${filters.query}"`);
    if (filters.location) parts.push(`in ${filters.location}`);
    if (filters.type) parts.push(`with ${filters.type}`);
    
    return parts.length > 0 ? parts.join(' ') : 'All properties';
  };

  const handleBack = () => {
    // Dispatch custom event to clear search bar
    window.dispatchEvent(new CustomEvent('clearSearchBar'));
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-3 rounded-md hover:bg-gray-100 border border-gray-300 bg-white shadow-sm"
              
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isLoading ? 'Searching...' : `${searchResults.length} properties found`}
              </h2>
              <p className="text-sm text-gray-600">
                {getSearchSummary()}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Searching properties...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
                {searchResults.map((property) => (
                  <PropertyCards
                    key={property._id}
                    id={property._id}
                    title={property.title}
                    coverImg={property.profileImage}
                    rating={property.rating}
                    price={property.pricePerNight}
                    amenities={property.amenities}
                    onCardClick={onCardClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search criteria or browse all properties.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Browse All Properties
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
