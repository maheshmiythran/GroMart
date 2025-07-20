import React, { useRef, useEffect } from "react";
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import { useLocation } from "react-router-dom";

    
const Home = () => {
  const bestSellerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#best-sellers' && bestSellerRef.current) {
      bestSellerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories/>
      <div ref={bestSellerRef} id="best-sellers">
        <BestSeller />
      </div>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  )
}

export default Home
