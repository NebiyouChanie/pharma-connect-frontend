import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "@/lib/utils";
import { useEffect } from "react";

import  ImageModal  from "@/components/Modal";


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


      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalImage, setModalImage] = useState("");
      const [modalTitle, setModalTitle] = useState("");

    // Handle opening the modal with image URL and title
    const openModal = (imageUrl, title) => {
      setModalImage(imageUrl);
      setModalTitle(title);
      setIsModalOpen(true);
    };
  
    // Handle closing the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setModalImage(""); // Clear the image when closing the modal
      setModalTitle(""); // Clear the title when closing the modal
    };
  
  return (
    <div className="container ">
      <div className="lg:px-[15%] mt-24 text-gray-700  grid md:grid-cols-2 gap-4 lg:gap-8">
        <div className="">
          <h3 className="text-2xl md:text-3xl font-bold text-black">
            {medicine?.name}
          </h3>
          <span className="text-gray-800 font-semibold">Antibiotics</span>
          <p className="mb-6">{medicine?.description}</p>
          <Button>Search</Button>
        </div>
          <div>
            <img
              src={medicine?.image}
              className="w-full h-[300px] object-cover"
              alt="medicin name"
              onClick={() => openModal(medicine?.image, "Medicine Image")}
            />
          </div>
    </div>
        <ImageModal
          imageSrc={modalImage} // The image to display in the modal
          isOpen={isModalOpen}  // Controls whether the modal is open or not
          onClose={closeModal}  // Handles closing the modal
          title={modalTitle}    // Pass the title to the modal
        />
    </div>
    
  );
}
