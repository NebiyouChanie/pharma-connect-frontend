import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from 'universal-cookie';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import * as z from "zod";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Zod schema for validation
const signInSchema = z.object({
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
  password: z.string().nonempty("Password is required"),
});

const cookies = new Cookies()

function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${BASE_URL}/users/signIn`, {
        method: "POST",
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
      
      // Access the Authorization header
      const authHeader = response.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        localStorage.setItem("authToken", token); // Store the token in localStorage
      } else {
        console.error("Authorization header missing in the response.");
      }
      
      const userData = await response.json()
      
      // set user
      cookies.set("user",userData.data)
      
      toast.success("Signed In Succesfully.");
      navigate(`/`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error Details:", error);
    }finally {
      setIsSubmitting(false)
    }
  };
  

  return (
    <div className="container max-w-[90%] md:max-w-[600px]  py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
             {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>
      {/* Additional Links */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default SignInForm;

