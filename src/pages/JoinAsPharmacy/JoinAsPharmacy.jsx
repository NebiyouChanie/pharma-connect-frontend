import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from "../../components/ImageUpload";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet CSS is imported
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Cookies from "universal-cookie";
import Footer from "@/components/Footer";

// Set default Leaflet icon configuration
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Map click handler component
function MapClickHandler({ setCoordinates }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates({ lat, lng });
    },
  });
  return null;
}

// Autofocus marker when coordinates change
function AutoFocusMarker({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, map.getZoom());
  }
  return null;
}

// Define the validation schema using Zod
const formSchema = z.object({
  ownerName: z.string().nonempty("Owner name is required"),
  pharmacyName: z.string().nonempty("Pharmacy name is required"),
  contactNumber: z.string().nonempty("Contact number is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  zipCode: z.string().nonempty("Zip code is required"),
  latitude: z.number({ required_error: "Latitude is required" }),
  longitude: z.number({ required_error: "Longitude is required" }),
  licenseNumber: z
    .string()
    .nonempty("License is a pre-requisite for a legal pharmacy"),
  licenseImage: z.string().nonempty("License image should be provided"),
  pharmacyImage: z.string().nonempty("Pharmacy image should be provided"),
});

function JoinAsPharmacy() {
  const cookies = new Cookies();
  const user = cookies.get("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      pharmacyName: "",
      contactNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      licenseNumber: "",
      licenseImage: "",
      pharmacyImage: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error("Sign in to proceed with your application.");
        return;
      }

      data = {
        ...data,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        ownerId: user.userId,
      };

      const response = await fetch(
        BASE_URL + `/applications/createApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        console.error("Error Details:", errorData);
        return;
      }

      toast.success("Application Submitted.");
      console.log("Success:", await response.json());
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container py-16">
        <h1 className="text-4xl font-bold mb-4">Join Us As A Pharmacy</h1>
        <p className="mb-16 text-gray-500 lg:max-w-[60%]">
          To join our Pharmacy Partner Program, simply fill out the form below
          with your pharmacy's details, including licensing information and the
          services you offer. Once you submit your application, our team will
          carefully review it to ensure it meets our quality standards. Upon
          approval, you’ll gain access to your personalized dashboard, where
          you can start connecting with more customers and showcasing your
          offerings. To speed up the approval process, make sure all the
          details you provide are accurate and complete.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 md:gap-32">
              <div className="flex flex-col gap-8">
                {/* Input Fields */}
                {/* ... (same input fields as in your original code) */}
              </div>
              <div className="flex flex-col gap-8">
                {/* License and Images */}
                {/* Map */}
                <FormLabel>Choose Location *</FormLabel>
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
                      <strong>Selected Location</strong>
                      <br />
                      Latitude: {coordinates.lat}
                      <br />
                      Longitude: {coordinates.lng}
                    </Popup>
                  </Marker>
                  <MapClickHandler setCoordinates={setCoordinates} />
                  <AutoFocusMarker position={[coordinates.lat, coordinates.lng]} />
                </MapContainer>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

export default JoinAsPharmacy;
