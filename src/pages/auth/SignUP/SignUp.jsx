import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import {useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom";
import { useState } from "react";


import * as z from "zod";

// Zod schema for validation
const signupSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    confirmPassword: z
      .string()
      .nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

function SignupForm() {
  const navigate =  useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
      try {
        setIsSubmitting(true)
        const response = await fetch(
          `${BASE_URL}/users/signUp`,
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
  
        toast.success("Signed Up Succesfully.");
        navigate('/sign-in')
      } catch (error) {
        // Handle network or unexpected errors
        toast.error("Something went wrong. Please try again.");
        console.error("Error Details:", error);
      }finally {
        setIsSubmitting(false)
      }
    };
    

  return (
    <div className=" container max-w-[90%] md:max-w-[600px] mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
      {/* Additional Links */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;

