import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PriceRangeDropdown from "../../components/PriceRangeDropdown";
import { useSearchContext } from "@/context/searchContext";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import LocationFilter from "../../components/LocatioListDropDown";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { BASE_URL } from "@/lib/utils";
import { NearbyCarousel } from "@/components/NearbyCarousel";
import Cookies from 'universal-cookie';

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

  const { getSearchedResults,userLocation, updateUserLocation } = useSearchContext();
  const searchedResult = getSearchedResults();
  const [inputQuery, setInputQuery] = useState()
  const [resultsFor, setResultsFor] = useState()
  
  // Request user location
const requestLocation = () => {
    if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        updateUserLocation({ latitude, longitude }); // Update location in context
    },
    (error) => {
        if (error.code === error.PERMISSION_DENIED) {
            toast.error(
                "Location access denied. Please enable location services in your browser settings."
            );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            toast.error("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
            toast.error("Request for location timed out.");
        } else {
            toast.error("An unknown error occurred while fetching location.");
        }
    }
);
};
  
  // Fetch search results
  async function fetchResults(query) {
    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName: query }),
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          setDisplayedResults([]); // Show "No results found"
          return;
        } else if (response.status === 500) {
          toast.error("Internal Server Error");
        } else {
          toast.error("Unexpected error occurred");
        }
      }
      
      const data = await response.json();
      updateSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
  
  // handle serach input
  const handleSearchInput = () => {
      requestLocation();
      setResultsFor(inputQuery)
      fetchResults(inputQuery);
  }

  useEffect(() => {
    if (searchQuery) {
      setResultsFor(searchQuery)
      fetchResults(searchQuery);
    }
  }, []);

  // Update displayed results with distance and time
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      const updatedResults = searchedResult?.map((pharmacy) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return {
          ...pharmacy,
          distance,
          time: distance * 2, // Assuming 2 minutes per km
        };
      });
      setDisplayedResults(updatedResults);
    } else {
      setDisplayedResults(searchedResult);
    }
  }, [userLocation, searchedResult]);


 // Calculate distance
 function calculateDistance(lat1, lng1, lat2, lng2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance
  }


  

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
          return { ...pharmacy, distance, time: distance * 2 };
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
          return { ...pharmacy, distance, time: distance * 2 };
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
      pharmacy.time=distance*2

      const distanceInKm=Math.round((distance / 4) * 60)

      return distanceInKm<=10; // Only include pharmacies within 5 km
    }
    return false; // Skip pharmacies without valid coordinates
  });

  if (nearbyPharmacies.length === 0) {
    toast.info("No pharmacies found within 10 km radius.");
    setDisplayedResults([]); // Clear displayed results
  } else {
    setDisplayedResults(nearbyPharmacies); // Update displayed results
  }
};




  return (
    <div>

    <div className="container min-h-screen">
      {/* search */}
      <div className="flex w-full max-w-sm items-center mt-20">
        <Input
          type="text"
          placeholder="Search"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          />
        <Button type="button" onClick={handleSearchInput}>
          Search
        </Button>
      </div>


      

{  !searchQuery && !searchedResult? 
      <div className=" my-16">
              <h3 className='text-2xl font-semibold mb-3'>Nearby pharmacies</h3>
              <NearbyCarousel pharmacies={nearBypharmacies}/>
            </div>:
      <div>
          {/* results for and filter buttons */}
          <div className="my-4">
            <h2 className=" font-bold text-2xl mb-4">Results for: {resultsFor}</h2>
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
                    <div className="flex flex-wrap  lg:gap-4">
                       <p className="text-red-600 mb-4">
                       Enable your location to view the estimated distance and travel time to each pharmacy.                        </p>
                        <Button variant="outline" className='h-fit py-1 px-2' onClick={requestLocation}>
                          Allow Location
                        </Button>
                      </div>
                    ) : null}
            </div>


            <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
              <Separator />
              {!displayedResults?.length ? (
                <p>No results found</p>
              ) : (
                displayedResults?.map((result, index) => (
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
                    />
                  ))
                )}
            </div>

      </div>}
    </div>
    {!user?.role!="user" && <Footer/>}
    </div>
  );
}
