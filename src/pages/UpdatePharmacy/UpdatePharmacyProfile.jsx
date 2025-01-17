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
import { useState, useEffect } from "react";
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

// Define the validation schema using Zod
const formSchema = z.object({
  name: z.string().nonempty("Pharmacy name is required"),
  contactNumber: z.string().nonempty("Contact number is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  address: z.string().nonempty("Address is required"),
  latitude: z.number({ required_error: "Latitude is required" }),
  longitude: z.number({ required_error: "Longitude is required" }),
  pharmacyImage: z.string().nonempty("Pharmacy image should be provided"),
});

function UpdatePharmacyProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      latitude: 0,
      longitude: 0,
      pharmacyImage: "",
    },
  });

  const { id } = useParams();
  const onSubmit = async (data) => {
    setIsSubmitting(true); // Set the button to disabled state
    try {
      data = { ...data, latitude: coordinates.lat, longitude: coordinates.lng };
      console.log("🚀 ~ file: UpdatePharmacyProfile.jsx:83 ~ onSubmit ~ data:", data);

      const response = await fetch(`${BASE_URL}/pharmacies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        return;
      }
      toast.success("Profile Updated Successfully.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pharmacies/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseJson = await response.json();
        const pharmacy = responseJson.data;

        // Format the data for the form
        form.reset({
          name: pharmacy.name || "",
          contactNumber: pharmacy.contactNumber || "",
          email: pharmacy.email || "",
          address: pharmacy.address || "",
          latitude: pharmacy.latitude || "",
          longitude: pharmacy.longitude || "",
          pharmacyImage: pharmacy.pharmacyImage || "",
        });
      } catch (error) {
        console.error("Error fetching pharmacy:", error);
      }
    };

    fetchPharmacy();
  }, []);

  const [coordinates, setCoordinates] = useState({ lat: 9.03, lng: 38.74 });
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Update Pharmacy Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-32 ">
            <div className="flex flex-col gap-8">
              {/* Pharmacy Name */}
              <FormField
                control={form.control}
                name="name"
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
              <div className="flex flex-col gap-8">
                <FormLabel>Pick a Location</FormLabel>
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
              </div>
            </div>

            <div className="flex gap-10">
              {/* Pharmacy Image Upload */}
              <FormField
                control={form.control}
                name="pharmacyImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pharmacy Image *</FormLabel>
                    <FormControl>
                      <ImageUpload onUpload={(url) => field.onChange(url)} initialImage={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UpdatePharmacyProfile;
