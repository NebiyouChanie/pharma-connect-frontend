import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import medicineImage from "../../assets/medicine.png";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/utils";
import { useParams } from "react-router-dom";

function MapClickHandler({ setCoordinates }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });
  return null;
}

function AutoFocusMarker({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, map.getZoom());
  }
  return null;
}

export default function PharmacyDetail() {
  const { id } = useParams();
  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });
  const [pharmacy, setPharmacy] = useState(null);
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [distance, setDistance] = useState(0);

  const loadPharmacyDetail = async (id) => {
    try {
      const response = await fetch(BASE_URL + `/pharmacies/${id}`);
      const pharmacyJson = await response.json();
      const pharmacyData = pharmacyJson.data;
      setPharmacy(pharmacyData);
    } catch (error) {
      console.error("Error loading pharmacy details:", error.message);
    }
  };

  useEffect(() => {
    loadPharmacyDetail(id);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error watching location:", error.message);
      }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [id]);

  useEffect(() => {
    if (
      position.lat &&
      position.lng &&
      pharmacy?.latitude &&
      pharmacy?.longitude
    ) {
      calculateDistance(
        position.lat,
        position.lng,
        pharmacy.latitude,
        pharmacy.longitude
      );
    }
  }, [position, pharmacy]);

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
    const distance = R * c;
    setDistance(distance);
  }

  if (!pharmacy) {
    return <p>Loading pharmacy details...</p>;
  }

  return (
    <div className="container mb-8">
      <div className="flex items-center flex-col gap-8 mb-5">
        <div className="mt-8 w-full text-gray-700 md:flex md:justify-center md:gap-8">
          <div className="my-7 md:my-0 md:w-2/4">
            <h3 className="text-2xl md:text-3xl mb-5 font-bold text-black">
              {pharmacy.name}
            </h3>
            <p>Location: {pharmacy.address}</p>
            <p>Owner: {pharmacy.ownerName}</p>
            <p className="flex items-center gap-4 mb-8">
              Distance: Around {distance.toFixed(2)} KM{" "}
              <span className="flex gap-1 items-center font-semibold">
                <Clock className="w-4 h-4" />~{Math.round((distance / 4) * 60)}{" "}
                Min
              </span>
              Distance: Around 4.6KM{" "}
              <span className="flex gap-1 items-center font-semibold">
                <Clock className="w-4 h-4" />
                20Min
              </span>
            </p>
          </div>
          <img
            src={pharmacy.licenseImage || medicineImage}
            className="w-full md:w-2/4"
            alt={pharmacy.name}
          />
        </div>
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "60vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <strong>Clicked Location</strong>
              <br />
              Latitude: {coordinates.lat}
              <br />
              Longitude: {coordinates.lng}
            </Popup>
          </Marker>
          <MapClickHandler setCoordinates={setCoordinates} />
          <AutoFocusMarker position={[coordinates.lat, coordinates.lng]} />
        </MapContainer>
        <Button variant="outline" className="self-start">
          Open in Google Maps
        </Button>
      </div>
      <div className="flex w-full max-w-sm items-center mt-8">
        <Input type="text" placeholder="Search from this pharmacy" />
        <Button type="submit">Search</Button>
      </div>
    </div>
  );
}
