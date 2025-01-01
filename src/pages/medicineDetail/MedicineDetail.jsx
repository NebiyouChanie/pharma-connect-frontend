import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "@/lib/utils";
import { useEffect } from "react";
export default function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const loadMedicine = async (id) => {
    const medicineResponse = await fetch(BASE_URL + `/medicines/${id}`);
    const medicineJson = await medicineResponse.json();
    const medicineData = await medicineJson.data;
    // console.log(medicineData);
    setMedicine(medicineData);
  };
  useEffect(() => {
    loadMedicine(id);
  }, []);
  return (
    <div className="container flex justify-center ">
      <div className="md:w-[80%] mt-8 text-gray-700 md:flex md:justify-center  md:gap-8">
        <img
          src={medicine?.image}
          className="w-full md:w-2/4"
          alt="medicin name"
        />
        <div className="my-7 md:my-0 md:w-2/4">
          <h3 className="text-2xl md:text-3xl font-bold text-black">
            {medicine?.name}
          </h3>
          <span className="text-gray-800 font-semibold">Antibiotics</span>
          <p className="mb-6">{medicine?.description}</p>
          <Button>Search</Button>
        </div>
      </div>
    </div>
  );
}
