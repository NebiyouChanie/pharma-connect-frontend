import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PriceRangeDropdown from "../../components/PriceRangeDropdown";
import { useSearchContext } from "@/context/searchContext";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import LocationFilter from "../../components/LocatioListDropDown";

export default function SearchResults() {
  
  // Getting the search term from the router state
  const location = useLocation();
  const { searchQuery } = location.state || {};

  // Getting the searched result from context
  const { getSearchedResults } = useSearchContext();
  const searchedResult = getSearchedResults();

  const [displayedResults, setDisplayedResults] = useState(searchedResult);
  const [userLocation, setUserLocation] = useState({});
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  // Request user location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setError(null);
      },
      (error) => {
        setError(error.message || "An unknown error occurred.");
      }
    );
  };

  // Calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Radius of Earth in km
  };

  // Update displayed results with distance and time
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      const updatedResults = searchedResult.map((pharmacy) => {
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
      setDisplayedResults(searchedResult); // Fallback if location is unavailable
    }
  }, [userLocation, searchedResult]);

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Filter Near Me
  const filterNearMe = () => {
    if (userLocation.latitude && userLocation.longitude) {
      const nearbyResults = displayedResults.filter((pharmacy) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return distance <= 5; // Filter results within 5 km
      });
      setDisplayedResults(nearbyResults);
    }
  };

  // Handle Near Me button click
  const handleNearme = () => {
    requestLocation();
    filterNearMe();
  };

  // Price filter
 // Price filter
const handleFilter = (range) => {
  setSelectedRange(range);

  // Filter results based on price range
  const filteredMedicine = searchedResult
    .filter(
      (pharmacy) => pharmacy.price >= range[0] && pharmacy.price <= range[1]
    )
    .map((pharmacy) => {
      // Recalculate distance and time for the filtered results
      if (userLocation.latitude && userLocation.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return {
          ...pharmacy,
          distance,
          time: distance * 2, 
        };
      }
      return pharmacy;  
    });

  setDisplayedResults(filteredMedicine);
};

const handleLocationFilter = ({ subcity, part }) => {
  const filteredResults = searchedResult.filter(
    (pharmacy) => {
      const pharmacyAddressTags = pharmacy.address.split(",")
      return pharmacyAddressTags.includes(part)
    }
  )
  .map((pharmacy) => {
    // Recalculate distance and time for the filtered results
    if (userLocation.latitude && userLocation.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );
      return {
        ...pharmacy,
        distance,
        time: distance * 2, 
      };
    }
    return pharmacy;  
  });
  setDisplayedResults(filteredResults);

  
};
  return (
    <div className="container">
      <div className="flex w-full max-w-sm items-center mt-8">
        <Input type="text" placeholder="Search" value={searchQuery} />
        <Button type="submit">Search</Button>
      </div>
      <h2 className="my-4 font-bold text-3xl">Results for: {searchQuery}</h2>
      <div className="flex gap-8 mb-5">
        <PriceRangeDropdown onSelect={handleFilter} />
        <LocationFilter onSelect={handleLocationFilter} />

        <Button variant="outline" onClick={handleNearme}>
          Near Me
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
        <Separator />
        {displayedResults?.length === 0 ? (
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
            />
          ))
        )}
      </div>
    </div>
  );
}
