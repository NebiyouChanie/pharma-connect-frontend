import { MapPin, Clock } from "lucide-react";
import cardImage from "../../../assets/aboutUS.png";
import { Link } from "react-router-dom";
export default function SearchResultsCard({pharmacyName, address, price, distance, time}) {
  return (
    <div className="w-full md:w-[47%] text-xs lg:text-sm shadow-md text-gray-700 rounded-md border-gray-300 border overflow-hidden grid grid-cols-2 gap-4 pr-2">
      <img className="h-full w-full" src={cardImage} alt="pharmacy entrance" />
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
        <Link className="text-blue-700 underline">See pharmacy detail</Link>
      </div>
    </div>
  );
}
