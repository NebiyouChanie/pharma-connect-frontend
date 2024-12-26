import React from 'react'
import HeroIllustration from '../assets/HeroIllustration.svg'
import { Button } from './ui/button'
import { Input } from './ui/input'
function HeroSection() {
  return (
    <div className=' flex flex-col md:flex-row gap-8 md:justify-between md:items-center mt-8 '>
      <div className=' max-w-[90%] md:max-w-[50%] xl:max-w-[605px] '>
        <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>Find medicines, compare prices, and <span className='text-primary'>check availability</span> instantly.</h1>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-8">
          <Input type="text" placeholder="Search for Medicine" />
          <Button type="submit">Search</Button>
        </div>
         <div className='mt-8 flex gap-4'>
           <Button>Sign Up</Button>
           <Button variant="outline">Join As Pharmacy</Button>
         </div>
      </div>
      <div>
          <img src={HeroIllustration} className='h-64 md:h-96 lg:h-[600px] lg:w-[635px] mx-auto ' alt="" />
      </div>
    </div>
  )
}

export default HeroSection