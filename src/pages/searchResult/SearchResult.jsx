import Footer from '@/components/Footer';
import { NearbyCarousel } from "@/components/NearbyCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSearchContext } from "@/context/searchContext";
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
  

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [displayedResults, setDisplayedResults] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionTimeout, setSuggestionTimeout] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { getSearchedResults,userLocation, updateUserLocation: contextUpdateUserLocation } = useSearchContext();
  const searchedResult = getSearchedResults();
  const [inputQuery, setInputQuery] = useState()
  const [resultsFor, setResultsFor] = useState()
  
  // Remove the complex distance calculation useEffect and related logic
  // The backend now handles all distance calculations

  // Remove the calculateDistance function since it's now on the backend

  // Remove the custom updateUserLocation function and forceUpdate logic
  // Simplify to just use the context updateUserLocation

  console.log(searchedResult)
  console.log("Current userLocation:", userLocation);
  console.log("Current displayedResults:", displayedResults);
  console.log("Current suggestions:", suggestions);
  console.log("Show suggestions:", showSuggestions);
  console.log("Loading suggestions:", loadingSuggestions);
  // Request user location
const requestLocation = () => {
    console.log("Requesting location...");
    if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        return;
    }

    // Add timeout and high accuracy options
    const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location obtained:", { latitude, longitude });
        contextUpdateUserLocation({ latitude, longitude }); // Update location in context
        toast.success("Location access granted!");
    },
    (error) => {
        console.error("Location error:", error);
        if (error.code === error.PERMISSION_DENIED) {
            toast.error(
                "Location access denied. Please enable location services in your browser settings."
            );
        } else if (error.code === error.TIMEOUT) {
            toast.error("Request for location timed out. Please try again.");
        } else {
            toast.error("An unknown error occurred while fetching location.");
        }
    },
    options
);
};
  
  // Fetch search results
  async function fetchResults(query) {
    try {
      console.log("Searching for:", query);
      console.log("Current user location:", userLocation);
      
      // Get the latest location from context to ensure we have the most up-to-date location
      const currentLocation = userLocation;
      
      const requestBody = {
        medicineName: query
      };

      // Add user location if available
      if (currentLocation.latitude && currentLocation.longitude) {
        requestBody.userLatitude = currentLocation.latitude;
        requestBody.userLongitude = currentLocation.longitude;
        console.log("✅ Including user location in search request:", { latitude: currentLocation.latitude, longitude: currentLocation.longitude });
      } else {
        console.log("❌ No user location available, searching without distance calculation");
      }

      console.log("🔍 Full request body:", requestBody);

      const response = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      console.log("Search results for", query, ":", data);
      
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
        console.error("API error:", data);
        toast.error(data.message || "An error occurred while searching");
        setDisplayedResults([]);
        return;
      }
      
      // Set results directly since distance/time are calculated on backend
      setDisplayedResults(data.data);
      updateSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Network error. Please check your connection and try again.");
      setDisplayedResults([]);
    }
  }

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
    
    const timeout = setTimeout(() => {
      console.log("Timeout executed, calling fetchSuggestions");
      fetchSuggestions(query);
    }, 300); // 300ms delay
    
    setSuggestionTimeout(timeout);
  };

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log("Input changed to:", value);
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
    const filteredMedicine = searchedResult
      .filter(
        (pharmacy) => pharmacy.price >= range[0] && pharmacy.price <= range[1]
      )
      .map((pharmacy) => {
        if (userLocation.latitude && userLocation.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pharmacy.latitude,
            pharmacy.longitude
          );
          return { ...pharmacy, distance, time: distance * 3 };
        }
        return pharmacy;
      });
    setDisplayedResults(filteredMedicine);
  };

  // filter by location
  const handleLocationFilter = ({ subcity, part }) => {
    const filteredResults = searchedResult
      .filter((pharmacy) => pharmacy.address.split(",").includes(part))
      .map((pharmacy) => {
        if (userLocation.latitude && userLocation.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pharmacy.latitude,
            pharmacy.longitude
          );
          return { ...pharmacy, distance, time: distance * 3 };
        }
        return pharmacy;
      });
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
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    toast.error("Please allow location access first.");
    requestLocation();
    return;
  }

  if (!searchedResult || searchedResult.length === 0) {
    toast.info("No search results to filter.");
    return;
  }

  // Filter pharmacies within 5 km radius
  const nearbyPharmacies = searchedResult.filter((pharmacy) => {
    if (pharmacy.latitude && pharmacy.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );
      pharmacy.distance=distance
      pharmacy.time=distance*3
      return distance<=5; // Only include pharmacies within 5 km
    }
    return false; // Skip pharmacies without valid coordinates
  });

  if (nearbyPharmacies.length === 0) {
    toast.info("No pharmacies found within 5 km radius.");
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

  // Test API accessibility
  const testAPI = async () => {
    try {
      console.log("Testing API accessibility...");
      const response = await fetch(`${BASE_URL}/medicines`);
      console.log("API test response:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("API test data:", data);
      }
    } catch (error) {
      console.error("API test error:", error);
    }
  };

  // Test API on component mount
  useEffect(() => {
    testAPI();
  }, []);

  // Add test function to window for debugging
  useEffect(() => {
    window.testSearchWithLocation = async (medicineName = "paracetamol") => {
      console.log("🧪 Testing search with location for:", medicineName);
      const testLocation = { latitude: 9.03, longitude: 38.74 };
      contextUpdateUserLocation(testLocation);
      setInputQuery(medicineName);
      setResultsFor(medicineName);
      
      // Wait for location to be set in context before searching
      setTimeout(async () => {
        console.log("🧪 Location set, now searching...");
        await fetchResults(medicineName);
      }, 100);
    };
    
    return () => {
      delete window.testSearchWithLocation;
    };
  }, []);


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
            <h2 className=" font-bold text-2xl mb-4">Results for: <span className="text-primary">{resultsFor}</span></h2>
            <div className="flex flex-wrap gap-2 md:gap-8 mb-5">
              <PriceRangeDropdown onSelect={handleFilter} />
              <LocationFilter onSelect={handleLocationFilter} />
              <Button variant="outline" className="border-foregorund text-gray-700" onClick={filterPharmaciesNearMe}>
                Near Me
              </Button>
            </div>
          </div>


          {/* results section */}
          <div className="flex items-center gap-4">
              {!userLocation.latitude || !userLocation.longitude ? (
                    <div className="flex flex-wrap gap-4 mb-4">
                       <p className="text-red-600">
                       Enable your location to view the estimated distance and travel time to each pharmacy.
                       </p>
                        <Button variant="outline" className='h-fit py-1 px-2' onClick={requestLocation}>
                          Allow Location
                        </Button>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-green-600 font-medium">
                          ✓ Location enabled - Distance and travel time will be shown
                        </p>
                        <Button 
                          variant="outline" 
                          className='h-fit py-1 px-2 mt-2' 
                          onClick={() => {
                            console.log("Manual test: Re-searching with current location");
                            if (inputQuery) {
                              fetchResults(inputQuery);
                            } else {
                              toast.error("Please search for a medicine first");
                            }
                          }}
                        >
                          Test Search with Location
                        </Button>
                      </div>
                    )}
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
                        updateUserLocation={contextUpdateUserLocation}
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

