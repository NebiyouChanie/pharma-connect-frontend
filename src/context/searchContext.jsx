import React, { createContext, useState, useContext } from "react";

// Create the context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearchContext = () => {
    return useContext(SearchContext);
};

// Provider component
export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [userLocation, setUserLocation] = useState({}); 
    
    // Function to update the search results
    const updateSearchResults = (results) => {
        setSearchResults(results);
    };

    function getSearchedResults() {
        return searchResults.data;
    }

    // Function to update the user location
    const updateUserLocation = (location) => {
        setUserLocation(location);
    };

    return (
        <SearchContext.Provider
            value={{
                searchResults,
                updateSearchResults,
                getSearchedResults,
                userLocation,
                updateUserLocation, 
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
