import React,{useEffect,useState} from 'react'
import SearchResultsCard from '../searchResult/searchResultsCard/SearchResultsCard'
import { BASE_URL } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

function MyMedicines() {
  const [myMedicines, setMyMedicines] =useState()
  const isCart= true;
  const token = localStorage.getItem("authToken");  
  const navigate = useNavigate()

  useEffect(()=>{
    const authToken = localStorage.getItem("authToken");
    if(!authToken ){
      return
    }
    const fetchMyMedicines = async () => {
      const response = await fetch(`${BASE_URL}/users/my-medicines`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
        const medicines =await response.json()
        setMyMedicines(medicines.data)
    }

    fetchMyMedicines()
  },[])

  const handleRemoveALLMyMedicines = async() => {
      try {
          const response = await fetch(`${BASE_URL}/users/my-medicines/deleteAll`,{
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", 
              'Authorization': `Bearer ${token}`,
            },
          }
          )
          navigate(0)
          toast.success("All Saved Medicines Removed from MY Medicines.");
        } catch (error) {
          toast.error("Something went wrong. Please try again.");
          console.log(error)
      }
    }

  return (
    <div className='container my-8 md:my-16'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-semibold mb-1'>Saved Medicines</h1>
            <p className='max-w-[80%] md:max-w-full text-gray-600'>You can save pharmacies that stock the medicines you searched for</p>
          </div>
           {!myMedicines?.length  ? <></>: <Button variant='destructive' className='h-fit' onClick={()=>{handleRemoveALLMyMedicines()}}><Trash />Remove All</Button>}
        </div>
        <div className="flex flex-col gap-8 md:flex-row flex-wrap mb-80">
          <Separator />
          {!token && <p className='text-gray-600'>Please log in to save searched medicines and pharmacies.</p>
          }
          {!myMedicines?.length && token  ? (
            <p className='text-gray-600'>You haven't saved any medicine yet.</p>
          ) : (
            myMedicines?.map((result, index) => (
              <SearchResultsCard
              key={index}
              pharmacyName={result.pharmacyName}
              address={result.address}
              distance={result.distance}
              time={result.time}
              price={result.price}
              pharmacyId={result.pharmacyId}
              medicineId={result.medicineId}
              isCart
              />
            ))
          )}
        </div>
    </div>
  )
}

export default MyMedicines
