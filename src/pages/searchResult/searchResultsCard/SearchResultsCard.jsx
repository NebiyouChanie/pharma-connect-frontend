import { MapPin, Clock } from "lucide-react";
import cardImage from "../../../assets/aboutUS.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

export default function SearchResultsCard({pharmacyName, address, price, distance, time,pharmacyId,medicineId,inventoryId,isCart}) {

  const token = localStorage.getItem("authToken");  
  const navigate = useNavigate()
  const handleAddToMyMedicines = async() => {
    const data = {inventoryId: inventoryId}
    try {
        const response = await fetch(`${BASE_URL}/users/addtocart`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data), 
        }
        )
        toast.success("Pharmacy and Medicine saved in MY Medicines.");
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.log(error)
    }
  }
  
  const handleRemoveFromMyMedicines = async() => {
    const data = {pharmacyId: pharmacyId, medicineId:medicineId}
    try {
        const response = await fetch(`${BASE_URL}/users/my-medicines`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data), 
        }
        )
        navigate(0)
        toast.success("Pharmacy and Medicine Removed from MY Medicines.");
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.log(error)
    }
  }

  return (
    <div className="w-full md:w-[47%] text-xs lg:text-sm shadow-md text-gray-700 rounded-md border-gray-300 border overflow-hidden grid grid-cols-2 gap-4 pr-2">
      <img className="h-full w-full object-cover" src={cardImage} alt="pharmacy entrance" />
      <div className="flex flex-col py-2">
        <h3 className="font-bold text-xl sm:text-lg mb-2">{pharmacyName}</h3>
        <span className="flex items-center text-sm text-gray-600 gap-2">
          <MapPin className="w-4 h-4" />
           {address}
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
        <span className="flex items-center gap-1">
          
          <p className="font-medium">Around</p> {Math.round((time / 4) * 60)}{" "}Min {"   "} |  {"   "} {Math.round((distance / 4) * 60) }{" "}Km
        </span>
         
        </div>
         <span className="font-semibold text-gray-800">Br {price}</span>
         <div className="flex justify-between items-center">
           <Link to={`/pharmacy-profile/${pharmacyId}`} className="text-blue-700 underline">
              See pharmacy detail
            </Link>

            <div>
              {
                !isCart ?
                    <Button className="py-1 px-2 h-fit text-xs flex" onClick={()=>{handleAddToMyMedicines()}}> Add to cart</Button>
                :
                    <Button className="py-1 px-2 h-fit text-xs flex" onClick={()=>{handleRemoveFromMyMedicines()}}>Remove</Button>
              }
           </div>
         </div>
      </div>
    </div>
  );
}
