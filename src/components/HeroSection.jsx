import React, { useState } from 'react'
import HeroIllustration from '../assets/HeroIllustration.svg'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import { useSearchContext } from '@/context/searchContext'
 

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState(''); // State to store search input
  const [searchResults, setSearchResults] = useState([]); // State to store backend response
  const navigate =  useNavigate()
  const {updateSearchResults} = useSearchContext();


  // 
  const handleSearch = async (event) => {
    event.preventDefault();
  
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }
    navigate('/searchResults', { state: { searchQuery } }); 
  }
 
  return (
    <div className='flex flex-col md:flex-row gap-8 md:justify-between md:items-center mt-8'>
      <div className='max-w-[90%] md:max-w-[50%] xl:max-w-[605px]'>
        <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
          Find medicines, compare prices, and <span className='text-primary'>check availability</span> instantly.
        </h1>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center mt-8">
          <Input
            type="text"
            placeholder="Search for Medicine"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit"><Search strokeWidth={4} size={40} /></Button>
        </form>
        <div className='mt-8 flex gap-4'>
          <Button>Sign Up</Button>
          <Button variant="outline">Join As Pharmacy</Button>
        </div>
      </div>
      <div>
        <img src={HeroIllustration} className='h-64 md:h-96 lg:h-[600px] lg:w-[635px] mx-auto' alt="" />
      </div>
      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-2xl">Search Results:</h2>
          <ul className="list-disc pl-5 mt-4">
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li> // Replace with more detailed rendering if needed
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
 
export default HeroSection;
