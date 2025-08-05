import Footer from '@/components/Footer';
import { NearbyCarousel } from "@/components/NearbyCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSearchContext } from "@/context/searchContext";
import { useLocationContext } from "@/context/locationContext";
import { BASE_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';
import LocationFilter from "../../components/LocatioListDropDown";
import PriceRangeDropdown from "../../components/PriceRangeDropdown";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";

const cookies = new Cookies();
export default function SearchResults() {
  const location = useLocation();
  const { searchQuery: initialSearchQuery } = location.state || {};
  const { updateSearchResults } = useSearchContext();
  const navigate = useNavigate();
  const user = cookies.get('user');

  // Safety check to prevent rendering before context is ready
  const [isContextReady, setIsContextReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure context is properly initialized
    const timer = setTimeout(() => {
      setIsContextReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [displayedResults, setDisplayedResults] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTimeout, setSuggestionTimeout] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { getSearchedResults } = useSearchContext();
  const { 
    userLocation, 
    updateUserLocation: contextUpdateUserLocation, 
    requestLocation: contextRequestLocation,
    hasLocation,
    isLocationLoading,
    locationError,
    getLocationStatus,
    getLocationType
  } = useLocationContext();
  const searchedResult = getSearchedResults();
  const [inputQuery, setInputQuery] = useState(initialSearchQuery || "")
  const [resultsFor, setResultsFor] = useState(initialSearchQuery || "")
  
  // Auto-search when component mounts with a search query
  useEffect(() => {
    if (initialSearchQuery) {
      setInputQuery(initialSearchQuery);
      setResultsFor(initialSearchQuery);
      
      // Wait a bit for any existing location to be available, then search
      setTimeout(() => {
        fetchResults(initialSearchQuery);
      }, 100);
    }
  }, [initialSearchQuery]);

  // Re-search when location becomes available (if we have a search query)
  useEffect(() => {
    if (inputQuery && userLocation && userLocation.latitude && userLocation.longitude) {
      fetchResults(inputQuery);
    }
  }, [userLocation, inputQuery]);

  // Remove the complex distance calculation useEffect and related logic
  // The backend now handles all distance calculations

  // Remove the calculateDistance function since it's now on the backend

  // Remove the custom updateUserLocation function and forceUpdate logic
  // Simplify to just use the context updateUserLocation


  // Request user location using the dedicated context
  const requestLocation = async () => {
    try {
      await contextRequestLocation();
      toast.success("Location access granted! Re-searching with distance calculations.");
      
      // If we have a search query, re-search with the new location
      if (inputQuery) {
        setTimeout(() => {
          fetchResults(inputQuery);
        }, 200);
      }
    } catch (error) {
      toast.error(locationError || "Failed to get location. Please try again.");
    }
  };
  
  // Fetch search results
  async function fetchResults(query) {
    try {
      const requestBody = {
        medicineName: query
      };

      // Always try to get the best available location
      let currentLocation = userLocation;
      
      // If we don't have location, try to get it (this will use fallback if needed)
      if (!hasLocation()) {
        try {
          currentLocation = await contextRequestLocation({ useFallback: true });
        } catch (error) {
          // Silently handle location errors
        }
      }

      // Add user location if available
      if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
        requestBody.userLatitude = currentLocation.latitude;
        requestBody.userLongitude = currentLocation.longitude;
      }

            const response = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400) {
          console.log("No results found for:", query);
          toast.error(data.message || "No results found for this medicine");
          setDisplayedResults([]); // Show "No results found"
          return;
        } else if (response.status === 500) {
          console.error("Server error:", data);
          toast.error("Server error occurred. Please try again later.");
          setDisplayedResults([]);
          return;
        } else {
          toast.error("Unexpected error occurred");
          setDisplayedResults([]);
          return;
        }
      }
      
      if (data.status === 'error') {
        toast.error(data.message || "An error occurred while searching");
        setDisplayedResults([]);
        return;
      }
      
      // Set results directly since distance/time are calculated on backend
      setDisplayedResults(data.data);
      updateSearchResults(data);
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
      setDisplayedResults([]);
    }
  }

  // Fetch medicine suggestions
  async function fetchSuggestions(query) {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const url = `${BASE_URL}/medicines/suggestions?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      // Silently handle suggestion errors
    } finally {
      setLoadingSuggestions(false);
    }
  }

  // Debounced suggestion function
  const debouncedFetchSuggestions = (query) => {
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms delay
    
    setSuggestionTimeout(timeout);
  };

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputQuery(value);
    setSelectedSuggestionIndex(-1); // Reset selected index when typing
    debouncedFetchSuggestions(value);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setInputQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    setResultsFor(suggestion.name); // Update resultsFor to show the clicked suggestion
    fetchResults(suggestion.name); // Directly fetch results for the clicked suggestion
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearchInput();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };
  
  // handle search input
  const handleSearchInput = () => {
      if (!inputQuery || inputQuery.trim() === '') {
          toast.error("Please enter a medicine name to search");
          return;
      }
      
      console.log("Searching for:", inputQuery);
      setResultsFor(inputQuery);
      fetchResults(inputQuery);
      
      // Request location separately to avoid blocking the search
      if (!userLocation.latitude || !userLocation.longitude) {
          requestLocation();
      }
  }

  useEffect(() => {
    if (searchQuery) {
      // console.log(searchQuery)
      setResultsFor(searchQuery)
      fetchResults(searchQuery);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }
    };
  }, [suggestionTimeout]);

  // Remove the complex distance calculation useEffect since backend handles it now


  

  // Price filter
  const handleFilter = (range) => {
    setSelectedRange(range);
    if (!searchedResult || searchedResult.length === 0) {
      return;
    }
    
    const filteredMedicine = searchedResult.filter(
      (pharmacy) => pharmacy.price >= range[0] && pharmacy.price <= range[1]
    );
    
    setDisplayedResults(filteredMedicine);
  };

  // filter by location
  const handleLocationFilter = ({ subcity, part }) => {
    if (!searchedResult || searchedResult.length === 0) {
      return;
    }
    
    const filteredResults = searchedResult.filter((pharmacy) => 
      pharmacy.address.toLowerCase().includes(part.toLowerCase())
    );
    
    setDisplayedResults(filteredResults);
  };


  //near by caerosel
const [nearBypharmacies, setNearBypharmacies] = useState([]);
  
  useEffect(() => {
      async function fetchData() {
        try {
  
          const response = await fetch(`${BASE_URL}/pharmacies`)
          const responseJson = await response.json()
          const pharmacies = responseJson.data
          setNearBypharmacies(pharmacies)

      } catch (err) {
      }  
      }
  
      fetchData();
      
    }, []);

 
// handle "Near Me" functionality
const filterPharmaciesNearMe = () => {
  if (!hasLocation()) {
    toast.error("Please allow location access first.");
    requestLocation();
    return;
  }

  if (!searchedResult || searchedResult.length === 0) {
    return;
  }

  // Filter pharmacies within 5 km radius using existing distance data
  const nearbyPharmacies = searchedResult.filter((pharmacy) => {
    return pharmacy.distance && pharmacy.distance <= 5; // Only include pharmacies within 5 km
  });

  if (nearbyPharmacies.length === 0) {
    setDisplayedResults([]); // Clear displayed results
  } else {
    setDisplayedResults(nearbyPharmacies); // Update displayed results
  }
};

  // Callback function to trigger new search when location is updated
  const handleLocationUpdate = () => {
    if (inputQuery) {
      console.log("Location updated, triggering new search with distance calculations");
      // Wait a bit for the location to be properly set in context
      setTimeout(() => {
        console.log("🔄 Re-searching with updated location...");
        fetchResults(inputQuery);
      }, 200);
    } else {
      console.log("No inputQuery available for location update");
    }
  };








  // Show loading while context is initializing
  if (!isContextReady) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>

    <div className="container min-h-screen">
      {/* search */}
      <div className="relative w-full max-w-sm mt-20">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search for medicine..."
            value={inputQuery}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchInput();
              }
            }}
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
          <Button type="button" onClick={handleSearchInput} className="ml-2">
            Search
          </Button>
        </div>
        
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


      

{  !searchQuery && !searchedResult? 
      <div className=" my-16">
              <h3 className='text-2xl font-semibold mb-3'>Nearby pharmacies</h3>
              <NearbyCarousel pharmacies={nearBypharmacies}/>
            </div>:
      <div>
          {/* results for and filter buttons */}
          <div className="my-4">
            {/* <h2 className=" font-bold text-2xl mb-4">Results for: <span className="text-primary">{resultsFor}</span></h2> */}
            <div className="flex flex-wrap gap-2 md:gap-8 mb-5">
              <PriceRangeDropdown onSelect={handleFilter} />
              <LocationFilter onSelect={handleLocationFilter} />
              <Button variant="outline" className="border-foregorund text-gray-700" onClick={filterPharmaciesNearMe}>
                Near Me (Within 5km)
              </Button>
            </div>
          </div>


          {/* results section */}
          <div className="flex items-center gap-4">
              {(() => {
                const status = getLocationStatus();
                const type = getLocationType();
                
                switch (status) {
                                     case 'loading':
                     return (
                       <div className="flex flex-wrap gap-4 mb-4">
                         <p className="text-blue-600">
                           Getting your location...
                         </p>
                       </div>
                     );
                  
                                     case 'available':
                     return (
                       <div className="mb-4">
                         <p className={`font-medium ${type === 'approximate' ? 'text-green-600' : 'text-green-600'}`}>
                           Location enabled - Distance and travel time will be shown
                           {type === 'approximate' && ' (approximate location)'}
                         </p>
                       </div>
                     );
                  
                                     case 'denied':
                     return (
                       <div className="flex flex-wrap gap-4 mb-4">
                         <p className="text-red-600">
                           Location access denied. Please enable location in your browser settings.
                         </p>
                         <Button 
                           variant="outline" 
                           className='h-fit py-1 px-2' 
                           onClick={() => requestLocation({ force: true })}
                         >
                           Try Again
                         </Button>
                       </div>
                     );
                  
                  default:
                    return (
                      <div className="flex flex-wrap gap-4 mb-4">
                        <p className="text-gray-600">
                          Enable your location to view the estimated distance and travel time to each pharmacy.
                        </p>
                        <Button 
                          variant="outline" 
                          className='h-fit py-1 px-2' 
                          onClick={requestLocation}
                          disabled={isLocationLoading}
                        >
                          {isLocationLoading ? "Getting Location..." : "Enable Location"}
                        </Button>
                      </div>
                    );
                }
              })()}
            </div>


            <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
              {!displayedResults?.length ? (
                <p>No results found</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Found {displayedResults.length} results</p>
                  <Separator />
                  {displayedResults?.map((result, index) => {
                    console.log("Rendering result:", result);
                    return (
                      <SearchResultsCard
                      key={index}
                      pharmacyName={result.pharmacyName}
                        address={result.address}
                        distance={result.distance}
                        time={result.time}
                        price={result.price}
                        pharmacyId={result.pharmacyId}
                        inventoryId={result.inventoryId}
                        image={result.photo}
                        medicineName={result.medicineName}
                        onLocationUpdate={handleLocationUpdate}
                        />
                    );
                  })}
                </>
              )}
            </div>

      </div>}
    </div>
    {!user?.role!="user" && <Footer/>}
    </div>
  );
}

