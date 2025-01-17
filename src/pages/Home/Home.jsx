import React, { useEffect, useState } from "react";
import HeroSection from '../../components/HeroSection'
import whytojoinUSimg from '../../assets/pharmacist-min.jpg'
import aboutUsImg from '../../assets/aboutus.png'
import productDemoIllustration from '../../assets/productDemoIllustration.svg'
import { NearbyCarousel } from '@/components/NearbyCarousel'
import {BASE_URL} from '../../lib/utils'
import Footer from "@/components/Footer";


function Home() {
  const [nearBypharmacies, setNearBypharmacies] = useState([]);
  
  useEffect(() => {
      async function fetchData() {
        try {
  
          const response = await fetch(`${BASE_URL}/pharmacies`)
          const responseJson = await response.json()
          const pharmacies = responseJson.data
          setNearBypharmacies(pharmacies)

      } catch (err) {
        console.log(err)
      }  
      }
  
      fetchData();
      
    }, []);

  return (
    <main>
      {/* hero section */}
      <div className="container">
        <HeroSection />
      </div>
      <div className="container">
        <div className="mb-24 mt-8">
          <h3 className='text-2xl font-semibold mb-3'>Nearby pharmacies</h3>
          <NearbyCarousel pharmacies={nearBypharmacies}/>
        </div>
      </div>


      {/* about us */}
      <section className='bg-lightbg py-32'>
        <div className='container grid lg:grid-cols-2 gap-8 items-center'>
            <div className='order'>
              <img src={aboutUsImg} alt="pharma connect team members"  />
            </div>
            <div>
              <h2 className='font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-primary'>About US</h2>
              <div className='text-bodyText lg:max-w-[90%]'>
                <p className='mb-4'>At Pharma Connect, we’re all about making it easier for you to find the medicines you need. Our platform connects you with pharmacies across the city, so you can quickly search for medicines, compare prices, and check availability all in one place.</p>
                <p className='mb-4'>At Pharma Connect, we’re all about making it easier you need. Our platform connects you with pharmacies across the city, so you can quickly search for medicines, compare prices, and check availability all in one place.</p>
                <p className='mb-4'>At Pharma Connect, we’re all about making it easie with pharmacies across the city, so you can quickly search for medicines, compare prices, and check availability all in one place.</p>
              </div>
            </div>
          </div>
      </section>
      
      {/* Why to join us */}
      <section className='py-16 md:py-24 lg:py-52'>
        <div className='container grid lg:grid-cols-2 gap-8 items-center'>
            <div className='order'>
              <img src={whytojoinUSimg} alt="pharma connect team members"  />
            </div>
            <div className='order-first lg:max-w-[90%]'>
              <h2 className='font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-primary'>Why to join us?</h2>
              <p className='text-bodyText mb-4'>PharmaConnect is more than just a platform—it’s a gateway for pharmacies to expand their reach and connect with a broader audience. By joining PharmaConnect, your pharmacy can:</p>
              <div className='text-bodyText '>
                <ul className='list-disc flex flex-col gap-4'>
                  <li>Boost Visibility: Showcase your products to thousands of potential customers searching for medicines in their area.</li>
                  <li>Increase Sales: Make it easy for users to find your pharmacy, view your stock, and choose your store for their medical needs.</li>
                  <li>Streamline Communication: Provide accurate pricing, availability, and location details to users instantly, enhancing customer satisfaction.</li>
                </ul>
               </div>
            </div>
          </div>
      </section>
      

      {/* product demo */}
      <section className='bg-lightbg py-32'>
        <div className='container text-center'>
              <h2 className='font-bold text-3xl md:text-4xl lg:text-5xl mb-1 text-primary'>Product Demo</h2>
              <p className='mb-6 text-bodyText'>Our platform is easy to use. Here is a short demo of our product.</p>
            <div className='grid lg:grid-cols-2 gap-8 items-center justify-center'>
              <div className='lg:max-w-[90%]'>
                <div className='bg-gray-400 w-full h-80'>
                </div>
              </div>
              <div className=''>
                <img src={productDemoIllustration} alt="pharma connect team members"  />
              </div>
            </div>
          </div>
      </section>
      <Footer />
    </main>
  )
}

export default Home

