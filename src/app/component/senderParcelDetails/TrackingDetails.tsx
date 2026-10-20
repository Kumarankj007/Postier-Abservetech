/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState } from 'react'
import Button from '../button'
import { trackingCardData } from '../../../../content'
import Image from 'next/image'

const TrackingDetails = () => {


  const [showDropdown, setShowDropdown] = useState(false);
  const handleSortByDropdown = () => {
    setShowDropdown(!showDropdown)
  }
  // const handleSortOptionClick = (option: string) => {
  //   console.log(option);
  //   setShowDropdown(false);
  // };
  const cards = trackingCardData.map((card, index) => (
    <div key={index} className='mx-auto md:flex md:justify-between border rounded-xl p-6 md:p-10 shadow mb-20'>
      <div className=''>
        <div>
          <p className='font-bold  text-sm'>Post Title: <span className='font-normal  text-sm ml-3'>{card.postTitle}</span></p>
        </div>
        <div className='mt-6 md:mt-10'>
          <p className='font-bold  text-sm'>Parcel Description: <span className='font-normal  text-sm ml-3'>{card.parcelDescription}</span></p>
        </div>
        <div className='mt-6 md:mt-10'>
          <p className='font-bold  text-sm'>Parcel Images:</p>
          <div className='md:flex mt-6'>
            <Image width={20} height={20} src={card.imageUrl} alt={card.postTitle} className='md:mr-10 mb-4 md:mb-0' />
            <Image width={20} height={20} src={card.imageUrl2} alt={card.postTitle} />
          </div>
        </div>
        <div className='mt-6 md:mt-10'>
          <p className='font-bold  text-sm'>Parcel Pickup Location: <span className='font-normal  text-sm ml-3'>{card.parcelPickUpLocation}</span></p>
        </div>
        <div className='mt-6 md:mt-10'>
          <p className='font-bold  text-sm'>Parcel Destination Location: <span className='font-normal  text-sm ml-3'>{card.parcelDestinationLocation}</span></p>
        </div>
      </div>
      <div className=' md:mt-0 mt-6'>
        <div className="mb-4 md:mr-0 mr-2">
          <Button className=" border p-3 md:p-4 text-white rounded-md w-full md:w-52 shadow-md bg-btncolor" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}>
            View Post
          </Button>
        </div>
      </div>
    </div>
  ));
  return (
    <>
      <div className='mx-auto flex flex-col md:flex-row justify-between mb-20'>
        <div className='flex flex-row md:flex-row'>
          <Button className="flex justify-center border bg-btncolor leading-tight p-5 md:p-5 rounded-l-md rounded-tl-xl rounded-bl-xl border-r-0" style={{ width: '175px', color: 'white' }}>
            Published
          </Button>
          <Button className="flex justify-center border leading-tight p-5 md:p-5 rounded-r-md rounded-tr-xl rounded-br-xl border-l-0" style={{ width: '175px', borderTopRightRadius: '17px', borderBottomRightRadius: '17px', borderColor: '#004080', color: "#004080", borderLeftColor: "white" }}>
            Saved
          </Button>
        </div>
        <div className='mt-4 md:mt-0'>
          <Button className="flex justify-center border leading-tight p-5 md:p-5 rounded-xl" style={{ width: '174.5px', borderRadius: '17px', borderColor: '#004080', color: "#004080" }} onClick={handleSortByDropdown}>
            <Image width={20} height={20} src="/svg/icon/proposalsFilter.svg" alt="Filter" className="mr-2" style={{ width: '25.5px', height: '17px', marginTop: "3px", color: '#004080' }} />
            Sort By
          </Button>
          {showDropdown && (
            <div className="absolute mt-2 ">
              <div className='relative mt-4 md:mt-0'>
                <Button className=" flex justify-center border leading-tight p-5 md:p-5 bg-white rounded-tr-xl rounded-tl-xl border-b-0 border-white" style={{ width: '174.5px', color: "black" }}>
                  Oldest
                </Button>
                <hr />
                <Button className=" flex justify-center border leading-tight p-5 md:p-5 bg-white rounded-br-xl rounded-bl-xl border-t-0 border-white" style={{ width: '174.5px', color: "black" }}>
                  Newest
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        {cards}
      </div>
    </>
  )
}

export default TrackingDetails;
