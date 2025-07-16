import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block'/>
      <img src={assets.main_banner_bg_sm} alt="banner-mobile" className='w-full md:hidden'/>

      {/* Banner Text and Buttons */}
      <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-white md:text-black'>
          GroMart - Just What You Need, Just When You Need It.
        </h1>
        <h4 className="text-white md:text-gray-700 mt-2">Your Neighborhood Store, Online.</h4>

        <div className='flex items-center gap-4 mt-6 font-medium'>
          <Link
            to='/products'
            style={{ backgroundColor: '#4fbf8b' }}
            className='group flex items-center gap-2 px-7 md:px-9 py-3 transition rounded text-white cursor-pointer'
          >
            Shop Now
            <img className='md:hidden transition group-focus:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
          </Link>

          <Link
            to='/products'
            className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-white'
            style={{ backgroundColor: '#4fbf8b' }}>
            Explore Deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
