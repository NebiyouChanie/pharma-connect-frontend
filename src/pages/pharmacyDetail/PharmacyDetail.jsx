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
import { useState } from "react";

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
    map.setView(position, map.getZoom()); // Update the map view to focus on the marker
  }

  return null;
}
export default function PharmacyDetail() {
  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });

  return (
    <div className="container mb-8">
      <div className="flex items-center flex-col gap-8 mb-5">
        <div className="mt-8 w-full text-gray-700 md:flex md:justify-center md:gap-8">
          <div className="my-7 md:my-0 md:w-2/4">
            <h3 className="text-2xl md:text-3xl mb-5 font-bold text-black">
              Lion Pharmacy
            </h3>
            <p>Location: Addisu Gebeya</p>
            <p>Owner: Abebe Kebede</p>
            <p className="flex items-center gap-4 mb-8">
              Distance: Around 4.6KM{" "}
              <p className="flex gap-1 items-center font-semibold">
                <Clock className="w-4 h-4" />
                20Min
              </p>
            </p>
          </div>
          <img
            src={medicineImage}
            className="w-full md:w-2/4"
            alt="medicine name"
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
