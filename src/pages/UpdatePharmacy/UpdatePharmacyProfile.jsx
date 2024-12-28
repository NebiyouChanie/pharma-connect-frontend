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
  pharmacyName: z.string().min(1, "pharmacy name is required"),
  ownerName: z.string().min(1, "owner name is required"),
  licenseNumber: z.number().min(1, "licensse number is required"),
  location: z.string().min(1, "location is required"),
  imageUrl:z.string().min(1, "Please upload an image."),
});

function UPdatePharmacyProfile() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pharmacyName: '',
      ownerName: '',
      licenseNumber: '',
      location: '',
      imageUrl:''
    }
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Update Pharmacy Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <div className='grid gap-8 md:grid-cols-2 md:gap-32 items-center'>
          
          
          <div className='flex flex-col gap-8'>
      
            {/* Pharmacy  Name */}
            <FormField
              control={form.control}
              name="pharmacyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pharmacy Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pharmacy Name" {...field} />
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
                    <Input placeholder="Enter owner Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            
            {/* license number */}
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number *</FormLabel>
                  <FormControl>
                    <Input  placeholder="Enter license number." {...field} />
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
            <Button type="submit">Update</Button>
          </form>
        </Form>
    </div>
  );
}

export default UPdatePharmacyProfile;
