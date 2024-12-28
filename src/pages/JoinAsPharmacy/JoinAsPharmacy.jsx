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
  licenseNumber: z.string().min(1, "licensse number is required"),
  location: z.string().min(1, "location is required"),
  PharmacyimageUrl:z.string().min(1, "Please upload an image."),
  licenseimageUrl:z.string().min(1, "Please upload an image."),

});

function JoinAsPharmacy() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pharmacyName: '',
      ownerName: '',
      licenseNumber: '',
      location: '',
      PharmacyimageUrl:'',
      licenseimageUrl:'',

    }
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-4">Join  Us As A Pharmacy</h1>
      <p className='mb-4 text-gray-500'>At PharmaConnect, we’re all about making it easier for you to find the medicines you need. Our platform connects you with pharmacies across the city, so you can quickly search for medicines, compare prices, and check availability—all in one place.</p>
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
              {/* location */}
               <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input  placeholder="Enter Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />


            </div>

            <div>

            {/* Pharmacy Image Upload */}
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
            {/* license Image Upload */}
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

export default JoinAsPharmacy;


