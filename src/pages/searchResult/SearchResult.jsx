import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import SearchResultsCard from "./searchResultsCard/SearchResultsCard";
import { Button } from "@/components/ui/button";
import PriceRangeDropdown from "../../components/PriceRangeDropdown";
import { useSearchContext } from "@/context/searchContext";

export default function SearchResults() {
  const location = useLocation();
  const { searchQuery } = location.state || {};
  const { getSearchedResults } = useSearchContext();
  const searchedResult = getSearchedResults();
  
  const [displayedResults, setDisplayedResults] = useState(searchedResult);
  const [userLocation, setUserLocation] = useState({});
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  
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
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Radius of Earth in km
  };
  displayedResults?.map((pharmacy)=>{
    pharmacy.distance= calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      pharmacy.latitude,
      pharmacy.longitude
    );
    pharmacy.time= pharmacy.distance * 2

  })

  const handleNearme = () => {
    console.log(userLocation)
    if (userLocation.latitude && userLocation.longitude) {
      const nearbyResults = searchedResult.filter((pharmacy) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );
        return distance <= 5;  
      });
      setDisplayedResults(nearbyResults);
    }
  };

  const handleFilter = (range) => {
    setSelectedRange(range);
    const filteredMedicine = searchedResult.filter(
      (pharmacy) => pharmacy.price >= range[0] && pharmacy.price <= range[1]
    );
    setDisplayedResults(filteredMedicine);
  };

  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      handleNearme();
    }
  }, [userLocation]);


  return (
    <div className="container">
      <div className="flex w-full max-w-sm items-center mt-8">
        <Input type="text" placeholder="Search" value={searchQuery} />
        <Button type="submit">Search</Button>
      </div>
      <h2 className="my-4 font-bold text-3xl">Results for: {searchQuery}</h2>
      <div className="flex gap-8 mb-5">
        <PriceRangeDropdown onSelect={handleFilter} />
        <Button variant="outline" onClick={requestLocation}>
          Near Me
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
  <Separator />
  {displayedResults?.length === 0 ? (
    <p>No results found</p>
  ) : (
    displayedResults?.map((result, index) => {
      console.log(result.time, result.distance); // Log the values
      return (
        <SearchResultsCard
          key={index}
          pharmacyName={result.pharmacyName}
          address={result.address}
          distance={result.distance}
          time={result.time}
          price={result.price}
        />
      );
    })
  )}
</div>

    </div>
  );
}
