import React from 'react';
import  { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from 'react';
import {toast} from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import Cookies from 'universal-cookie'; 
import {useParams} from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const cookies = new Cookies()

// Define the validation schema using Zod
const formSchema = z.object({
  
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 10,
      price: 15,
      expiryDate: '',
    }
  });

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null); 
  const  {pharmacyId, inventoryId} = useParams()
  const [inventoryData, setInventoryData] = useState()


  //  handle submit
  const onSubmit = async (data) => {
    try {

      const dataToSend = {...data,medicineId:inventoryData.medicine,updatedBy:user.userId}
      const response = await fetch(`${BASE_URL}/pharmacies/${pharmacyId}/inventory/${inventoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(dataToSend), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Request failed"}`);
        return;
      }
  
      toast.success("Medicine Updated Successfully.");
      navigate(-1);
    } catch (error) {
      // Handle network or unexpected errors
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    }
  };

 
  // Fetch medicines
  useEffect(() => {
     
    const fetchInventory = async () => {
          try {
            const response = await fetch(`${BASE_URL}/pharmacies/${pharmacyId}/inventory`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const Inventory = await response.json();
      
            if (Inventory.data.length > 0) {
              const fetchedData = Inventory.data[0];  
              setInventoryData(fetchedData);
      
              // Format the data for the form
              form.reset({
                quantity: fetchedData.quantity.toString() || "",
                price: fetchedData.price.toString() || "",
                expiryDate: new Date(fetchedData.expiryDate) || null, // Convert to Date object
              });
      
              // Set the selected date for the DatePicker
              setSelectedDate(new Date(fetchedData.expiryDate));
            }
          } catch (error) {
            console.error("Error fetching inventory:", error);
          }
        };
      
        fetchInventory();
    
  }, []);


  
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Add Medicine to Inventory</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className='grid gap-8 md:grid-cols-2 md:gap-32 items-center'>
          
          
          <div className='flex flex-col gap-8'>
      
            {/* Medicine name */}
            <div className='flex gap-2'>
               <h2 className='font-medium'>Medicine Name :</h2> <p className='font-bold'>{inventoryData?.medicineName}</p> 
            </div>
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
            <Button type="submit">Update Medicine</Button>
          </form>
        </Form>
    </div>
  );
}

export default AddMedicineToInventory;






 