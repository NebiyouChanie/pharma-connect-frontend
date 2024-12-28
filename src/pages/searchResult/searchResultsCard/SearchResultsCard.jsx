import { MapPin, Clock } from "lucide-react";
import cardImage from "../../../assets/aboutUS.png";
import { Link } from "react-router-dom";
export default function SearchResultsCard() {
  return (
    <div className="w-full md:w-[47%] text-xs lg:text-sm text-gray-700 rounded-md border-gray-700 border overflow-hidden grid grid-cols-2 gap-4 pr-2">
      <img className="h-full w-full" src={cardImage} alt="pharmacy entrance" />
      <div className="flex flex-col">
        <h3 className="font-bold text-lg sm:text-lg">Soloda Pharmacy</h3>
        <span className="flex items-center justify-start text-gray-700">
          <MapPin className="w-4 h-4" />
          Addisu Gebeya
        </span>
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
          <span>Around 4.6KM</span>
          <span className="flex text-lg items-center justify-start gap-1 text-gray-800">
            <Clock className="w-4 h-4" /> 20 Min
          </span>
        </div>
        <span>Br 489.00</span>
        <Link className="text-blue-700 underline">See pharmacy detail</Link>
      </div>
    </div>
  );
}
