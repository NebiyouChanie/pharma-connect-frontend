import React from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from '../../components/ImageUpload'; // Import the ImageUpload component
import { Textarea } from '@/components/ui/textarea';

// Define the validation schema using Zod
const formSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Please upload an image."),
});

function AddMedicine() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineName: '',
      category: '',
      description: '',
      imageUrl: ''
    }
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Add Medicine to the platform</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className='grid gap-8 md:grid-cols-2 md:gap-32 items-center'>
          
          
          <div className='flex flex-col gap-8'>
      
            {/* Medicine Name */}
            <FormField
              control={form.control}
              name="medicineName"
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
            
            {/* Medicine Category */}
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
              name="imageUrl"
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
    </div>
  );
}

export default AddMedicine;
