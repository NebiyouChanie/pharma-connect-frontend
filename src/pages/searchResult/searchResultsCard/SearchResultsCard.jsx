import { MapPin } from "lucide-react";
import { useState, useEffect } from 'react';
// import cardImage from "../../../assets/aboutUS.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function SearchResultsCard({pharmacyName, address, price, distance, time, pharmacyId, medicineId, medicineName, inventoryId, isCart, image, updateUserLocation, onLocationUpdate}) {
 
  const user = cookies.get('user');
  const token = localStorage.getItem("authToken");  
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Debug logging for props
  useEffect(() => {
    console.log("SearchResultsCard props:", {
      pharmacyName,
      distance,
      time,
      medicineName,
      hasUpdateUserLocation: !!updateUserLocation,
      hasOnLocationUpdate: !!onLocationUpdate
    });
  }, [pharmacyName, distance, time, medicineName, updateUserLocation, onLocationUpdate]);

  // Additional debug logging for distance/time specifically
  useEffect(() => {
    console.log(`🔍 ${pharmacyName}: distance=${distance}, time=${time}`);
  }, [pharmacyName, distance, time]);

  const requestLocation = () => {
    setIsLocationLoading(true);
    console.log("Requesting location...");
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setShowManualLocation(true);
      setIsLocationLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location obtained successfully:", position.coords);
        const { latitude, longitude } = position.coords;
        
        // Update user location in context
        if (updateUserLocation) {
          updateUserLocation({ latitude, longitude });
          console.log("✅ User location updated in context");
        }
        
        // Show success message
        toast.success("Location enabled! Refreshing search results with distance calculations.");
        
                 // Trigger new search with location
         if (onLocationUpdate) {
           console.log("✅ Triggering location update callback");
           setTimeout(() => {
             onLocationUpdate();
           }, 500); // Reduced delay but still enough for context update
         }
        
        setIsLocationLoading(false);
      },
      (error) => {
        console.error("❌ Location error:", error);
        setIsLocationLoading(false);
        
        let errorMessage = "Failed to get location. Please try again.";
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access denied. Please allow location access in your browser settings and refresh the page.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location unavailable. Please check your internet connection or try manual location.";
            setShowManualLocation(true);
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "Failed to get location. Please try again.";
        }
        
        toast.error(errorMessage);
      },
      options
    );
  };

  const handleManualLocationSet = () => {
    if (!manualLatitude || !manualLongitude) {
      toast.error("Please enter both latitude and longitude");
      return;
    }

    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid coordinates");
      return;
    }

    console.log("✅ Setting manual location:", { lat, lng });
    
    if (updateUserLocation) {
      updateUserLocation({ latitude: lat, longitude: lng });
    }
    
    toast.success("Manual location set! Refreshing search results.");
    
    if (onLocationUpdate) {
      setTimeout(() => {
        onLocationUpdate();
      }, 1000);
    }
    
    setShowManualLocation(false);
  };

  const handleAddToMyMedicines = async () => {
    const data = {inventoryId: inventoryId};
    try {
      if (!user) {
        toast.error("Sign in to save searched Pharmacies.");
        return;
      }

      const response = await fetch(`${BASE_URL}/users/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data), 
      });
      toast.success("Pharmacy and Medicine saved in MY Medicines.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  const handleRemoveFromMyMedicines = async () => {
    const data = {pharmacyId: pharmacyId, medicineId: medicineId};
    try {
      const response = await fetch(`${BASE_URL}/users/my-medicines`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data), 
      });
      navigate(0);
      toast.success("Pharmacy and Medicine Removed from MY Medicines.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <Card className="w-full md:w-[47%] shadow-md border-gray-300 grid grid-cols-2 overflow-hidden">
      {/* Image Section */}
      <div className="max-h-48">
        <img
          src={image}
          alt="pharmacy entrance"
          className="h-full w-full object-cover col-span-1"
        />
      </div>

      {/* Content Section */}
      <CardContent className="col-span-1 p-4 flex flex-col gap-2">
        {/* Pharmacy Name */}
        <CardHeader className="p-0">
          <CardTitle className="font-bold text-start text-lg sm:text-xl">{pharmacyName}</CardTitle>
          <CardTitle className="text-start text-sm text-gray-600">{medicineName}</CardTitle>
        </CardHeader>

        {/* Address */}
        <div className="flex text-sm text-gray-600 gap-2">
          <MapPin className="w-4 h-4" />
          <span>{address}</span>
        </div>

        {/* Distance and Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
          <span className="flex gap-2">
            {distance !== undefined && distance !== null && time !== undefined && time !== null ? (
              <div>
                <p className="font-medium text-green-600">
                  ✅ Around {Number(Math.round(time))} Min | {Number(Math.round(distance*10)/10)} Km
                </p>
                <p className="text-xs text-gray-500">Distance calculated from your location</p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                  onClick={() => {
                    console.log("Location button clicked");
                    requestLocation();
                  }}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? "Loading..." : "Enable location to see distance"}
                </button>
                
                {showManualLocation && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600 mb-2">Alternative: Get your coordinates from <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">latlong.net</a></p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Latitude"
                        value={manualLatitude}
                        onChange={(e) => setManualLatitude(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-xs"
                        step="any"
                      />
                      <input
                        type="number"
                        placeholder="Longitude"
                        value={manualLongitude}
                        onChange={(e) => setManualLongitude(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-xs"
                        step="any"
                      />
                      <button
                        onClick={handleManualLocationSet}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </span>
        </div>

        {/* Price */}
        <span className="font-semibold text-gray-800">Br {price}</span>

        {/* Footer Section */}
        <CardFooter className="flex justify-between pt-2 p-0">
          <Link
            to={`/pharmacy-profile/${pharmacyId}`}
            className="text-blue-700 underline text-sm"
          >
            See pharmacy detail
          </Link>

          {/* Add/Remove Button */}
          {(!user || user?.role === "user") && (
          <div>
            {!isCart ? (
              <Button
                className="py-1 px-2 h-fit text-xs"
                onClick={handleAddToMyMedicines}
              >
                Add to cart
              </Button>
            ) : (
              <Button
                className="py-1 px-2 h-fit text-xs"
                onClick={handleRemoveFromMyMedicines}
              >
                Remove
              </Button>
            )}
          </div>
        )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
