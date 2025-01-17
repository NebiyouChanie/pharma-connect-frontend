import React from 'react';
import  { useState } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from 'react';
import {toast} from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import Dropdown from '../../components/Dropdown'
import Cookies from 'universal-cookie'; 



const cookies = new Cookies()

// Define the validation schema using Zod
const formSchema = z.object({
  medicineId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectID format"),
  
  quantity: z
      .string()
      .min(1, "Quantity is required")
      .transform((val) => parseInt(val, 10)) // Transform string to number
      .refine((val) => val >= 1, { message: "Quantity must be at least 1" }),
  price: z
      .string()
      .min(1, "Price is required")
      .transform((val) => parseFloat(val)) // Transform string to number
      .refine((val) => val >= 0.01, { message: "Price must be at least 0.01" }),
  expiryDate: z.date({ required_error: "Expiry date is required" }),
});

  

function AddMedicineToInventory() {
  const user = cookies.get("user")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineName: '',
      quantity: 10,
      price: 15,
      expiryDate: '',
    }
  });

  const [medicines, setMedicines] = useState([])
  const [selectedDate, setSelectedDate] = useState(null); 

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const dataToSend = {...data,updatedBy:user.userId}
      const response = await fetch(`${BASE_URL}/pharmacies/${user?.pharmacyId}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Correct header for JSON requests
        },
        body: JSON.stringify(dataToSend), // Send the form data as JSON
      });
  
      if (!response.ok) {
        // Handle non-2xx status codes
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        console.error("Error Details:", errorData);
        return;
      }
  
      toast.success("Medicine Added Successfully.");
      console.log("Success:", await response.json()); // Log response if needed
    } catch (error) {
      // Handle network or unexpected errors
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    }finally {
      setIsSubmitting(false)
    }
  };

 
  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      const response = await fetch(`${BASE_URL}/medicines`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',  
        },
      });
      const data = await response.json();
      setMedicines(data.data); // Set medicines in state
    };

    fetchMedicines();
  }, []);


  
  return (
    <div className="container py-8">
      <h1 className="text-3xl md:text-4xl  font-bold mb-8">Add Medicine to Inventory</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className='grid gap-8 md:grid-cols-2 md:gap-32 items-center'>
          
          
          <div className='flex flex-col gap-8'>
      
            {/* Medicine Name */}
            <FormField
              control={form.control}
              name="medicineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Name *</FormLabel>
                  <FormControl>
                  <Dropdown medicines={medicines} onSelect={(selectedMedicineId)=>{field.onChange(selectedMedicineId)}} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            
            {/* Medicine Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity *</FormLabel>
                  <FormControl>
                    <Input placeholder="10" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            
            {/* Medicine Price*/}
            
              <FormField
                control={form.control}
                name="price" // Correct field name to match schema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <Input placeholder="100" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* expiration date */}
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date *</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date); // Update local state
                          field.onChange(date); // Update form state
                        }}
                        dateFormat="yyyy-MM-dd" // Set the desired date format
                        placeholderText="Select a date"
                        className="w-full border border-input rounded-md px-3 py-2 text-base"
                      />
              </FormControl>
            <FormMessage />
        </FormItem>
      )}
    />

            </div>

          </div>
            <Button type="submit" disabled={isSubmitting} className="w-fit">
                {isSubmitting ? "Adding Medicine..." : "Add Medicine"}
            </Button>
          </form>
        </Form>
    </div>
  );
}

export default AddMedicineToInventory;
