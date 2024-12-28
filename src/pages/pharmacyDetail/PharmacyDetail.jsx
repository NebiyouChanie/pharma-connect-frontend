import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import medicineImage from "../../assets/medicine.png";
import { Clock } from "lucide-react";
export default function PharmacyDetail() {
  return (
    <div>
      <div className="container flex items-center flex-col gap-8 ">
        <div className="md:w-3/4 mt-8 text-gray-700 md:flex md:justify-center  md:gap-8">
          <div className="my-7 md:my-0 md:w-2/4">
            <h3 className="text-2xl md:text-3xl mb-5 font-bold text-black">
              Lion Pharmacy
            </h3>
            <p>Location: Addisu Gebeya</p>
            <p>Owner: Abebe Kebede</p>
            <p className="flex items-center gap-4 mb-8">
              Destance: Around 4.6KM{" "}
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
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: "80%", height: "50vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
