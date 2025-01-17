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
import { useState } from "react";



// Define the validation schema using Zod
const formSchema = z.object({
 name: z.string().min(1, "Medicine name is required"),
  description: z.string().min(1, "Category is required"),
  
  image: z.string().min(1, "Please upload an image."),
  category: z.string().min(1, "Description is required"),
});

function AddMedicine() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      category: '',
    }
  });

 
   const onSubmit = async (data) => {
      try {
        setIsSubmitting(true)
        const response = await fetch(`${BASE_URL}/medicines`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Correct header for JSON requests
          },
          body: JSON.stringify(data), // Send the form data as JSON
        });
    
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
      }finally {
        setIsSubmitting(false)
      }
    };
    

  return (
    <div className="container py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Add Medicine to the platform</h1>
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
                  <FormLabel></FormLabel>
                  <FormControl>
                    <ImageUpload onUpload={(url) => field.onChange(url)} />
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

export default AddMedicine;
