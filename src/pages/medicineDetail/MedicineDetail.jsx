import { Button } from "@/components/ui/button";
import medicineImage from "../../assets/medicine.png";
export default function MedicineDetail() {
  return (
    <div className="container flex justify-center ">
      <div className="md:w-[80%] mt-8 text-gray-700 md:flex md:justify-center  md:gap-8">
        <img
          src={medicineImage}
          className="w-full md:w-2/4"
          alt="medicin name"
        />
        <div className="my-7 md:my-0 md:w-2/4">
          <h3 className="text-2xl md:text-3xl font-bold text-black">
            Paracetamol
          </h3>
          <span className="text-gray-800 font-semibold">Antibiotics</span>
          <p className="mb-6">
            At PharmaConnect, we’re all about making it easier for you to find
            the medicines you need. Our platform connects you with pharmacies
            across the city, so you can quickly search for medicines, compare
            prices, and check availability—all in one place.
          </p>
          <Button>Search</Button>
        </div>
      </div>
    </div>
  );
}
