import { MapPin, Clock } from "lucide-react";
// import cardImage from "../../../assets/aboutUS.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function SearchResultsCard({pharmacyName, address, price, distance, time, pharmacyId, medicineId, medicineName, inventoryId, isCart, image}) {
 
  const user = cookies.get('user');
  const token = localStorage.getItem("authToken");  
  const navigate = useNavigate();

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
            {!medicineName && (
              <p className="font-medium">
                Around {time} Min | {distance.toFixed(2)} Km
              </p>
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
