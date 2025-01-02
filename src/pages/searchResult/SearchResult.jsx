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

import { BASE_URL } from "@/lib/utils";

export default function SearchResults() {
  const location = useLocation();
  const { searchQuery: initialSearchQuery } = location.state || {};
  const { updateSearchResults } = useSearchContext();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [userLocation, setUserLocation] = useState({});
  const [displayedResults, setDisplayedResults] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);

  const { getSearchedResults } = useSearchContext();
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
        setUserLocation({ latitude, longitude });
      },
      () => {
        toast.error("Please connect to the internet.");
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
      setResultsFor(inputQuery)
      fetchResults(inputQuery);
  }
  useEffect(() => {
    requestLocation();
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
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Handle input search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchResults(searchQuery);
    } else {
      toast.warn("Please enter a search term.");
    }
  };

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

  return (
    <div className="container">
      <div className="flex w-full max-w-sm items-center mt-8">
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
      <h2 className="my-4 font-bold text-3xl">Results for: {resultsFor}</h2>
      <div className="flex gap-8 mb-5">
        <PriceRangeDropdown onSelect={handleFilter} />
        <LocationFilter onSelect={handleLocationFilter} />
        <Button variant="outline" onClick={requestLocation}>
          Near Me
        </Button>
      </div>
      <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
        <Separator />
        {!displayedResults?.length  ? (
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
