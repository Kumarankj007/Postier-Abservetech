/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { Rating } from '@mui/material';
import Image from 'next/image';
import ReviewData from '@/app/store/reviews';

const GivenTab = () => {
    const {FetchReviews,Reviews} = ReviewData()
    const Value = Reviews ? Reviews.rating : []
    const cards = Array.isArray(Value) && Value.map((card, index) => (
        <div key={index} className='mt-10 border shadow rounded-xl p-5'>
            <div className='flex flex-col md:flex-row justify-start items-center'>
                <div className='mb-4 md:mb-0'>
                <Image  width={500} height={500} src={process.env.NEXT_PUBLIC_IMAGE_URL + card?.reviewed?.profile} alt={card.name} className="w-14 h-14 rounded-full object-cover	" />
                </div>
                <div className='ml-0 md:ml-4'>
                    <div className='text-center md:text-start'>
                        <h3 className='text-lg font-bold  mb-2 md:ml-1 md:mb-0'>{card?.reviewed?.fname}{card?.reviewed?.lname}</h3>
                    </div>
                    <div>
                        <Rating defaultValue={card.rating} max={5} readOnly />
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                <p className=' text-sm leading-8'>{card.comments}</p>
            </div>
        </div>
))
useEffect(()=>{
    FetchReviews({options:'given'})
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[])
  return (
    <div className=''>
      {cards}
    </div>
  )
}

export default GivenTab
