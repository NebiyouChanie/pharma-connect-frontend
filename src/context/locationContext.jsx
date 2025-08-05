import React, { createContext, useState, useContext, useEffect } from "react";

// Create the location context
const LocationContext = createContext();

// Custom hook to use the location context
export const useLocationContext = () => {
    return useContext(LocationContext);
};

// Provider component
export const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
    
    // Load location from localStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const location = JSON.parse(savedLocation);
                // Check if location is not too old (24 hours)
                const locationAge = Date.now() - (location.timestamp || 0);
                if (locationAge < 24 * 60 * 60 * 1000) {
                    setUserLocation(location);
                } else {
                    localStorage.removeItem('userLocation');
                }
            } catch (error) {
                localStorage.removeItem('userLocation');
            }
        }
    }, []);

    // Check location permission status
    useEffect(() => {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setLocationPermission(result.state);
            });
        }
    }, []);

    // Function to save location to localStorage
    const saveLocation = (location) => {
        const locationWithTimestamp = {
            ...location,
            timestamp: Date.now()
        };
        localStorage.setItem('userLocation', JSON.stringify(locationWithTimestamp));
    };

    // Function to update the user location
    const updateUserLocation = (location) => {
        setUserLocation(location);
        setLocationError(null);
        saveLocation(location);
    };

    // Function to clear location
    const clearLocation = () => {
        setUserLocation(null);
        setLocationError(null);
        localStorage.removeItem('userLocation');
    };

    // Function to get approximate location from IP (fallback)
    const getApproximateLocation = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.latitude && data.longitude) {
                const approximateLocation = {
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                    isApproximate: true,
                    city: data.city,
                    country: data.country_name
                };
                return approximateLocation;
            }
        } catch (error) {
            // Silently handle approximate location errors
        }
        return null;
    };

    // Function to request location from browser
    const requestLocation = async (options = {}) => {
        const { force = false, useFallback = true } = options;
        
        // Don't request again if already requested and denied
        if (hasRequestedLocation && locationPermission === 'denied' && !force) {
            throw new Error('Location permission denied');
        }

        setIsLocationLoading(true);
        setLocationError(null);
        setHasRequestedLocation(true);
        
        if (!navigator.geolocation) {
            const error = "Geolocation is not supported by your browser.";
            setLocationError(error);
            setIsLocationLoading(false);
            throw new Error(error);
        }

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Location request timed out'));
            }, 15000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        isApproximate: false,
                        timestamp: position.timestamp
                    };
                    console.log("✅ Precise location obtained:", location);
                    updateUserLocation(location);
                    setLocationPermission('granted');
                    setIsLocationLoading(false);
                    resolve(location);
                },
                async (error) => {
                    clearTimeout(timeoutId);
                    console.error("❌ Location error:", error);
                    
                    let errorMessage = "Failed to get location. Please try again.";
                    
                    switch (error.code) {
                        case 1: // PERMISSION_DENIED
                            errorMessage = "Location access denied. Please allow location access in your browser settings.";
                            setLocationPermission('denied');
                            break;
                        case 2: // POSITION_UNAVAILABLE
                            errorMessage = "Location unavailable. Please check your internet connection and try again.";
                            break;
                        case 3: // TIMEOUT
                            errorMessage = "Location request timed out. Please try again.";
                            break;
                        default:
                            errorMessage = "Failed to get location. Please try again.";
                    }
                    
                    setLocationError(errorMessage);
                    setIsLocationLoading(false);
                    
                    // Try fallback location if enabled
                    if (useFallback && error.code !== 1) {
                        console.log("🔄 Trying fallback location...");
                        try {
                            const fallbackLocation = await getApproximateLocation();
                            if (fallbackLocation) {
                                updateUserLocation(fallbackLocation);
                                resolve(fallbackLocation);
                                return;
                            }
                        } catch (fallbackError) {
                            console.error("❌ Fallback location failed:", fallbackError);
                        }
                    }
                    
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    };

    // Function to check if location is available
    const hasLocation = () => {
        return !!(userLocation && userLocation.latitude && userLocation.longitude);
    };

    // Function to get location coordinates
    const getLocationCoordinates = () => {
        return userLocation;
    };

    // Function to get location status
    const getLocationStatus = () => {
        if (isLocationLoading) return 'loading';
        if (hasLocation()) return 'available';
        if (locationPermission === 'denied') return 'denied';
        if (locationError) return 'error';
        return 'unavailable';
    };

    // Function to get location type
    const getLocationType = () => {
        if (!userLocation) return 'none';
        return userLocation.isApproximate ? 'approximate' : 'precise';
    };

    // Auto-request location on mount (industry standard)
    useEffect(() => {
        const autoRequestLocation = async () => {
            // Only auto-request if we don't have location and haven't been denied
            if (!hasLocation() && locationPermission !== 'denied' && !hasRequestedLocation) {
                console.log("🚀 Auto-requesting location on app load...");
                try {
                    await requestLocation({ useFallback: true });
                } catch (error) {
                    console.log("Auto location request failed, user can request manually");
                }
            }
        };

        // Small delay to let the app load first
        const timer = setTimeout(autoRequestLocation, 1000);
        return () => clearTimeout(timer);
    }, [locationPermission, hasRequestedLocation]);

    return (
        <LocationContext.Provider
            value={{
                userLocation,
                isLocationLoading,
                locationError,
                locationPermission,
                hasRequestedLocation,
                updateUserLocation,
                clearLocation,
                requestLocation,
                hasLocation,
                getLocationCoordinates,
                getLocationStatus,
                getLocationType
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}; 