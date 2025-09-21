import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Home, Star, X } from 'lucide-react';
import { BASE_URL } from './constants';

const SearchBar = ({ onSearch, onSuggestionClick, placeholder = "Search properties" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 1) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for custom clear event
  useEffect(() => {
    const handleClearSearchBar = () => {
      clearInput();
    };

    window.addEventListener('clearSearchBar', handleClearSearchBar);
    return () => window.removeEventListener('clearSearchBar', handleClearSearchBar);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/properties/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onSearch(suggestion.value);
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'property':
        return <Home className="w-4 h-4 text-blue-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-green-500" />;
      case 'amenity':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionLabel = (suggestion) => {
    switch (suggestion.type) {
      case 'property':
        return 'Property';
      case 'location':
        return suggestion.category ? `${suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}` : 'Location';
      case 'amenity':
        return 'Amenity';
      default:
        return 'Search';
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-12 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Search className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-shrink-0 mr-3">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getSuggestionLabel(suggestion)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
