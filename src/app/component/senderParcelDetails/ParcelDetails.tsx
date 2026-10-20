/* eslint-disable @next/next/no-img-element */
import PageContext from '@/app/providers/pagecontext';
import PostDetailsStore from '@/app/store/parcelDetails';
import Store from '@/app/store/store';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'

const ParcelDetails = ({ PostId }: any) => {
    const { i18 } = useContext(PageContext);
    const { postDetails }:any = PostDetailsStore()
   
    return (
        <>
            <div className='md:flex md:justify-between'>
                <div className=''>
                    <div>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.POSTTITLE||'Post Title:'} <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.title ? postDetails?.parcel?.title : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{i18?.VIEWPARCEL?.PARCELPICLOC||'Parcel Pickup Location:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.location?.pickUp ? postDetails?.location?.pickUp : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELTYPE||'Parcel Type:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.type ? postDetails?.parcel?.type : ''}</span></p>
                    </div>
                    
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELHEIGHT||'Parcel Height:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.height ? postDetails?.parcel?.height : ''} {postDetails?.parcel?.heightType ? postDetails?.parcel?.heightType : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELSIZE||'Parcel Size:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.apprxSize ? postDetails?.parcel?.apprxSize : ''}</span></p>
                    </div>
                </div>
                <div className='hidden md:block border-l border-solid border-gray-400 h-auto mx-6'></div>
                <div className='md:w-1/2 md:pl-6'>
                    <div className='mb-6 md:mb-10 mt-6 md:mt-0'>
                        <p className='font-bold font-snas text-sm'>{i18?.VIEWPARCEL?.PARCELDESCRIPTION||'Parcel Description:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.description ? postDetails?.parcel?.description : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELDESLOC||'Parcel Destination Location:'}  <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.location?.drop ? postDetails?.location?.drop : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{i18?.VIEWPARCEL?.PARCELWIDTH || 'Parcel Width:'} <span className='font-normal  text-sm ml-3 capitalize'>{postDetails?.parcel?.width ? postDetails?.parcel?.width : ''} {postDetails?.parcel?.widthType ? postDetails?.parcel?.widthType : ''}</span></p>
                    </div>
                    <div className='mt-6 md:mt-10'>
                        <p className='font-bold font-snas text-sm'>{i18?.VIEWPARCEL?.PARCLIMAGES||'Parcel Images: '}</p>
                        <div className='flex gap-4 flex-wrap'>
                            {
                                Array.isArray(postDetails?.parcel?.image) && postDetails?.parcel?.image.map((item: any, index: any) => {
                                    return (
                                        <Image key={index}
                                        width={500} height={500}
                                            src={process.env.NEXT_PUBLIC_IMAGE_URL + item}
                                            alt='img'
                                            className='w-[100px] h-[100px] object-cover rounded'
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ParcelDetails
