import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import  ImageModal  from "@/components/Modal";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { set } from "react-hook-form";
import { useLocationContext } from "@/context/locationContext";
// Set default Leaflet icon configuration
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;



const cookies = new Cookies();




// function MapClickHandler({ setCoordinates }) {
//   useMapEvents({
//     click: (e) => {
//       const { lat, lng } = e.latlng;
//       setCoordinates({ lat, lng });
//     },
//   });
//   return null;
// }

 

export default function PharmacyDetail() {
  const { id } = useParams();
  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });
  const [pharmacy, setPharmacy] = useState(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  
  const { userLocation, hasLocation, requestLocation } = useLocationContext();

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

  const user = cookies.get('user');

  const loadPharmacyDetail = async (id) => {
    try {
      const response = await fetch(BASE_URL + `/pharmacies/${id}`);
      const pharmacyJson = await response.json();
      const pharmacyData = pharmacyJson.data;

      const lat = parseFloat(pharmacyData.latitude);
      const lng = parseFloat(pharmacyData.longitude);
      setCoordinates({ lat, lng });
      setPharmacy(pharmacyData);
    } catch (error) {
      console.error("Error loading pharmacy details:", error.message);
    }
  };
  useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(`${BASE_URL}/pharmacies/${id}/inventory`);
          const responseJson = await response.json();
          const formattedData = responseJson.data.map(item => ({
            medicineName: item.medicineName,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            expiryDate: item.expiryDate,
            createdAt: item.createdAt,
            medicineId: item.medicine,
            inventoryId: item._id,
            pharmacyId: item.pharmacy,
            
          }));
          setData(formattedData);
        } catch (err) {
          // Silently handle errors
        }  
      }
      fetchData();
    }, []);

  useEffect(() => {
    loadPharmacyDetail(id);
  }, [id]);



  useEffect(() => {
    if (
      userLocation?.latitude &&
      userLocation?.longitude &&
      pharmacy?.latitude &&
      pharmacy?.longitude
    ) {
      calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );
    }
  }, [userLocation, pharmacy]);

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const calculatedDistance = R * c;
    const calculatedTime = Math.round(calculatedDistance * 3); // 3 minutes per km, rounded
    setDistance(calculatedDistance);
    setTime(calculatedTime);
  }

  if (!pharmacy) {
    return 
  }


  const renderDetailRow = (label, value) => (
    <div className="flex justify-between py-2 ">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-600">{value || "N/A"}</span>
    </div>
  );


  return (
    <div className="container lg:px-24  mb-24">
      <div className="flex justify-between items-center mt-10 mb-10">
        <h3 className="text-3xl md:text-4xl  font-bold text-black  ">
          {pharmacy.name}
        </h3>
        <div>
        {   user?.role === "owner" || user?.role === "pharmacist" ?
            <div>
                <Link to={`/pharmacy-profile/${id}/update`}>
              <Button variant="outline">
                  Update profile
              </Button>
                </Link>
            </div>:
            <div>
            <Button> <Phone /> <a href={`tel:${pharmacy.contactNumber}`}>Call</a></Button>
          </div>
      }
        </div>
      </div>
      
        <div className="  w-full   mb-24 text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-12 ">
          
          {/* description */}
          <div className="xl:max-w-[70%]">
            <div>
              {renderDetailRow("Owner Name", pharmacy.ownerName)}
              {renderDetailRow("License Number", pharmacy.licenseNumber)}
              {renderDetailRow("Email", pharmacy.email)}
              {renderDetailRow("Contact Number", pharmacy.contactNumber)}
              {renderDetailRow("Location", `${pharmacy.address}`)}
              {renderDetailRow("City", `${pharmacy.city}`)}
              {renderDetailRow("State", pharmacy.state)}
              {renderDetailRow("Zip Code", pharmacy.zipCode)}
            </div>
                        
                         <div className="flex items-center gap-4 my-8">
               {hasLocation() && distance > 0 ? (
                 <>
                   <p className="font-medium text-gray-700">Distance:</p> 
                   <span>Around {Number(Math.round(distance*10)/10)} KM</span>
                   <span className="flex gap-1 items-center font-semibold">
                     <Clock className="w-4 h-4" />
                     ~{time} Min
                   </span>
                 </>
               ) : (
                <div className="flex items-center gap-4">
                  <p className="font-medium text-gray-700">Distance:</p>
                  <button
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                    onClick={() => requestLocation()}
                  >
                    Enable location to see distance
                  </button>
                </div>
              )}
            </div>

          </div>
          {/* image */}
          <div>
            <img
              src={pharmacy.pharmacyImage}
              className="w-full object-cover h-[400px] cursor-pointer"
              alt={pharmacy.name}
              onClick={() => openModal(pharmacy.pharmacyImage, "Pharmacy Image")}
            />
          </div>

      </div>
      <div className="mb-8">
             <MapContainer
         center={[coordinates.lat, coordinates.lng]}
         zoom={15}
         scrollWheelZoom={true}
         style={{ width: "100%", height: "400px" }}
         key={`${coordinates.lat}-${coordinates.lng}`}
       >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
                          {/* Pharmacy Location Marker */}
         <Marker position={[coordinates.lat, coordinates.lng]}>
           <Popup>
             <strong>{pharmacy?.name || 'Pharmacy Location'}</strong>
             <br />
             Address: {pharmacy?.address}
             <br />
             Latitude: {coordinates.lat}
             <br />
             Longitude: {coordinates.lng}
           </Popup>
         </Marker>
      </MapContainer>

      </div>

      <Button 
          variant="outline" 
          className="self-start"
          onClick={() => {
            const googleMapsUrl = `https://www.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}&ll=${pharmacy.latitude},${pharmacy.longitude}&z=15`; 
            window.open(googleMapsUrl, "_blank"); // Opens the Google Maps link in a new tab
          }}
        >
          Open in Google Maps
        </Button>

      
     {
      user?.role === "owner" || user?.role === "pharmacist" ?
            <></>:
            <div className="mx-auto py-10">
                <h2 className="font-semibold text-2xl">Medicine List</h2>
                <DataTable columns={columns} data={data} searchKey="medicineName" />
            </div>
      }
       <ImageModal
          imageSrc={modalImage} // The image to display in the modal
          isOpen={isModalOpen}  // Controls whether the modal is open or not
          onClose={closeModal}  // Handles closing the modal
          title={modalTitle}    // Pass the title to the modal
        />
    </div>
  );
}
