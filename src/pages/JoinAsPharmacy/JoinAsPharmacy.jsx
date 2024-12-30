import React from "react";
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
import "leaflet/dist/leaflet.css";
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
  latitude: z
    .string()
    .nonempty("Latitude is required")
    .transform((value) => parseFloat(value)),
  longitude: z
    .string()
    .nonempty("Longitude is required")
    .transform((value) => parseFloat(value)),

  licenseNumber: z
    .string()
    .nonempty("License is a pre-requisite for a legal pharmacy"),
  licenseImage: z.string().nonempty("License image should be provided"),
  pharmacyImage: z.string().nonempty("Pharmacy image should be provided"),
});

function JoinAsPharmacy() {
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
      data = { ...data, latitude: coordinates.lat, longitude: coordinates.lng };
      console.log(data);
      const response = await fetch(
        `${BASE_URL}/applications/createApplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Correct header for JSON requests
          },
          body: JSON.stringify(data), // Send the form data as JSON
        }
      );

      if (!response.ok) {
        // Handle non-2xx status codes
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        console.error("Error Details:", errorData);
        return;
      }

      toast.success("Application Submitted.");
      console.log("Success:", await response.json()); // Log response if needed
    } catch (error) {
      // Handle network or unexpected errors
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    }
  };

  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Join Us As A Pharmacy</h1>
      <p className="mb-4 text-gray-500">
        At PharmaConnect, we’re all about making it easier for you to find the
        medicines you need. Our platform connects you with pharmacies across the
        city, so you can quickly search for medicines, compare prices, and check
        availability—all in one place.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-32 ">
            <div className="flex flex-col gap-8">
              {/* Pharmacy Name */}
              <FormField
                control={form.control}
                name="pharmacyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pharmacy Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pharmacy name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner Name */}
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter owner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Number */}
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Zip Code */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-8">
              {/* License Number */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-10">
                {/* License Image Upload */}
                <FormField
                  control={form.control}
                  name="licenseImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Image *</FormLabel>
                      <FormControl>
                        <ImageUpload onUpload={(url) => field.onChange(url)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pharmacy Image Upload */}
                <FormField
                  control={form.control}
                  name="pharmacyImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Image *</FormLabel>
                      <FormControl>
                        <ImageUpload onUpload={(url) => field.onChange(url)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel>License Number *</FormLabel>
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
                <AutoFocusMarker
                  position={[coordinates.lat, coordinates.lng]}
                />
              </MapContainer>
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default JoinAsPharmacy;
