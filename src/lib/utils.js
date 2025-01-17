import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// export const  BASE_URL = "https://pharma-connect-backend.onrender.com/api/v1"
export const  BASE_URL = "http://localhost:5000/api/v1"



