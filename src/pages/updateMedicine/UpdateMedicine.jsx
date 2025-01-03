import React from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from '../../components/ImageUpload'; // Import the ImageUpload component
import { Textarea } from '@/components/ui/textarea';
import { BASE_URL } from "@/lib/utils";
import {toast} from "react-toastify";
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";



// Define the validation schema using Zod
const formSchema = z.object({
 name: z.string().min(1, "Medicine name is required"),
  description: z.string().min(1, "Category is required"),
  
  image: z.string().min(1, "Please upload an image."),
  category: z.string().min(1, "Description is required"),
});

function UpdateMedicine() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      category: '',
    }
  });

  const navigate = useNavigate();
  const  {medicineId} = useParams();
  
 
   const onSubmit = async (data) => {
      try {
        const response = await fetch(`${BASE_URL}/medicines/${medicineId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',  
          },
          body: JSON.stringify(data),  
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message || "Request failed"}`);
          console.error("Error Details:", errorData);
          return;
        }
    
        toast.success("Medicine Updated Successfully.");
        navigate(-1)
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error Details:", error);
      }
    };
    
    useEffect(()=>{
      const fetchMedicine = async ()=>{
         try {
            const response = await fetch(`${BASE_URL}/medicines/${medicineId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const responseJson = await response.json();
            const medicine = responseJson.data
              
              // Format the data for the form
              form.reset({
                name: medicine.name || "",
                category: medicine.category || "",
                description: medicine.description || "",
                image: medicine.image || "",
              });


          } catch (error) {
            console.error("Error fetching inventory:", error);
          }
      }
      
      fetchMedicine()
    },[])

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Update Medicine</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className='grid gap-8 md:grid-cols-2 md:gap-32 items-center'>
          
          
          <div className='flex flex-col gap-8'>
      
            {/* Medicine Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Paracetamol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            
            {/* Medicine Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea  placeholder="Enter a description of the medicine..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />

            </div>

            <div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image *</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url)}
                      initialImage={field.value} // Use the current value as the initial image
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

export default UpdateMedicine;
