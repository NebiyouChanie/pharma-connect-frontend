import { MapPin } from "lucide-react";
import { useState, useEffect } from 'react';
// import cardImage from "../../../assets/aboutUS.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';
import { useLocationContext } from "@/context/locationContext";

const cookies = new Cookies();

export default function SearchResultsCard({pharmacyName, address, price, distance, time, pharmacyId, medicineId, medicineName, inventoryId, isCart, image, onLocationUpdate, showLocation = true}) {upda
 
  const user = cookies.get('user');
  const token = localStorage.getItem("authToken");  
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  
  const { 
    updateUserLocation, 
    requestLocation: contextRequestLocation,
    isLocationLoading,
    locationError,
    getLocationStatus,
    getLocationType
  } = useLocationContext();



    const requestLocation = async () => {
    try {
      await contextRequestLocation();
      toast.success("Location enabled! Refreshing search results with distance calculations.");
      
      // Trigger new search with location
      if (onLocationUpdate) {
        setTimeout(() => {
          onLocationUpdate();
        }, 500);
      }
    } catch (error) {
      toast.error(locationError || "Failed to get location. Please try again.");
      
      // Show manual location option for POSITION_UNAVAILABLE error
      if (error.code === 2) {
        setShowManualLocation(true);
      }
    }
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

        {/* Distance and Time - Only show if showLocation is true */}
        {showLocation && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
            <span className="flex gap-2">
              {distance !== undefined && distance !== null && time !== undefined && time !== null ? (
                <div>
                  <p className="font-medium text-green-600">
                    Around {Number(Math.round(time))} Min | {Number(Math.round(distance*10)/10)} Km
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                    onClick={() => {
                      requestLocation();
                    }}
                    disabled={isLocationLoading}
                  >
                    {isLocationLoading ? "Getting location..." : "Enable location to see distance"}
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
        )}

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
