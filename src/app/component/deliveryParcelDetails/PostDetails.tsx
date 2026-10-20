import PageContext from '@/app/providers/pagecontext';
import PostDetailsStore from '@/app/store/parcelDetails';
import { FormatDate, TimeFormat } from '@/utils'
import React, { useContext } from 'react'

const PostDetails = () => {
    const {ParcelDetailsPostier}:any = PostDetailsStore()
    const { i18 } = useContext(PageContext);
    const data = ParcelDetailsPostier ? ParcelDetailsPostier?.trip[0] : []
    // console.log('ParcelDetailsPostier',data)
  return (
    <div>
      <div className='p-6'>
            <div className='md:flex md:justify-between'>
                <div className='md:w-1/2 md:pr-6'>
                    <div>
                        <p className='font-bold  text-sm'>{ i18?.VIEWPARCEL?.POSTTITLE || 'Post Title:'} <span className='font-normal  text-sm ml-2 capitalize'>{data?.title}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PICKUPLOCATION || 'Pickup Location:'} <span className='font-normal  text-sm ml-2 capitalize'>{data?.location?.pickUp}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{ i18?.VIEWPARCEL?.PICKUPDATE || 'Pickup Date:'} <span className='font-normal  text-sm ml-2'>{FormatDate(data?.startDate)}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{ i18?.VIEWPARCEL?.PRICE || 'Price:'} <span className='font-normal  text-sm ml-2'>${data?.avgPrice}</span></p>
                    </div>
                </div>
                <div className='hidden md:block border-l border-solid border-gray-400 h-auto mx-6'></div>
                <div className='md:w-1/2 md:pl-6'>
                    <div className='mb-6 md:mb-10 mt-6 md:mt-0'>
                        <p className='font-bold font-snas text-sm'>{ i18?.VIEWPARCEL?.PARCELDESCRIPTION || 'Parcel Description:'} <span className='font-normal  text-sm ml-2 capitalize'>{data?.description}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{ i18?.VIEWPARCEL?.DROPDESNITATION || 'Destination Location:'} <span className='font-normal  text-sm ml-2'>{data?.location?.drop}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{ i18?.VIEWPARCEL?.PICKUPTIME || "Pickup Time:"} <span className='font-normal  text-sm ml-2'>{TimeFormat(data?.startDate)}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{ i18?.VIEWPARCEL?.CAPACITY || 'Capacity:'} <span className='font-normal  text-sm ml-2'>{data?.capacity}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostDetails
