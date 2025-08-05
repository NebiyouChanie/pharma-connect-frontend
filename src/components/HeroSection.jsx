import React, { useState, useEffect } from 'react'
import HeroIllustration from '../assets/HeroIllustration.svg'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../lib/utils'
 

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState(''); // State to store search input
  const [searchResults, setSearchResults] = useState([]); // State to store backend response
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTimeout, setSuggestionTimeout] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const navigate =  useNavigate()

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }
    };
  }, [suggestionTimeout]);

  // Fetch medicine suggestions
  async function fetchSuggestions(query) {
    console.log("Fetching suggestions for:", query);
    
    if (!query || query.trim().length < 2) {
      console.log("Query too short, clearing suggestions");
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const url = `${BASE_URL}/medicines/suggestions?q=${encodeURIComponent(query)}`;
      console.log("Fetching from URL:", url);
      
      const response = await fetch(url);
      console.log("Suggestions response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Suggestions data:", data);
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      } else {
        console.error("Suggestions API error:", response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Don't show error toast for suggestions as it's not critical
    } finally {
      setLoadingSuggestions(false);
    }
  }

  // Debounced suggestion function
  const debouncedFetchSuggestions = (query) => {
    console.log("Debounced function called with:", query);
    
    if (suggestionTimeout) {
      console.log("Clearing previous timeout");
      clearTimeout(suggestionTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      console.log("Executing debounced fetch for:", query);
      fetchSuggestions(query);
    }, 300);
    
    setSuggestionTimeout(newTimeout);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    // Navigate to search results with the selected suggestion
    navigate('/searchResults', { state: { searchQuery: suggestion.name } });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // 
  const handleSearch = async (event) => {
    event.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    navigate('/searchResults', { state: { searchQuery } }); 
  }
 
  return (
    <div className='flex flex-col md:flex-row gap-8 md:justify-between md:items-center mt-8'>
      <div className='max-w-[90%] md:max-w-[50%] xl:max-w-[605px]'>
        <h1 className='font-bold text-4xl lg:text-5xl xl:text-6xl mt-4'>
          Find medicines, compare prices, and <span className='text-primary'>check availability</span> instantly.
        </h1>
        <div className="relative w-full max-w-sm mt-8">
          <form onSubmit={handleSearch} className="flex w-full items-center">
            <Input
              type="text"
              placeholder="Search for Medicine"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={handleKeyDown}
            />
            <Button type="submit"><Search strokeWidth={4} size={40} /></Button>
          </form>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {loadingSuggestions ? (
                <div className="px-4 py-3 text-gray-500 text-center">
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                  Loading suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      index === selectedSuggestionIndex ? 'bg-blue-100 font-medium' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">{suggestion.category}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No medicines found
                </div>
              )}
            </div>
          )}
        </div>
        <div className='mt-8 flex gap-4'>
          <Link to={"/sign-up"}>
          <Button>
            Sign Up
          </Button>
          </Link>
            <Link to={"/join-us"}>
              <Button variant="outline"> 
                Join As Pharmacy
              </Button>
          </Link>
        </div>
      </div>
      <div>
        <img src={HeroIllustration} className='h-64 md:h-96 lg:h-[600px] lg:w-[635px] mx-auto' alt="" />
      </div>
      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-2xl">Search Results:</h2>
          <ul className="list-disc pl-5 mt-4">
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li> // Replace with more detailed rendering if needed
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
 
export default HeroSection;
