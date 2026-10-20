'use client'

import React, { useContext, useState } from 'react'
import Button from './button';
import CustomModal from './modal';
import TrackingModal from './modals/trackingmodal';
import Store from '../store/store';
import PageContext from '../providers/pagecontext';
import Image from 'next/image';

const ParcelRequest = () => {
    const {setModal} = Store()
    const { i18 } = useContext(PageContext);
    return (
        <>
            <div className='p-6'>
                <div className='mx-auto md:flex md:justify-between border rounded-xl p-6 md:p-10 shadow mb-20'>
                    <div className='md:w-3/5'>
                        <div>
                            <p className='font-bold font-sans text-sm'>{ i18?.VIEWPARCEL?.POSTTITLE || 'Post Title:'} <span className='font-normal font-sans text-sm ml-3'>Lorem Ipsum</span></p>
                        </div>
                        <div className='mt-6 md:mt-10'>
                            <p className='font-bold font-sans text-sm'>{ i18?.VIEWPARCEL?.PARCELDESC || 'Parcel Description:'} <span className='font-normal font-sans text-sm ml-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</span></p>
                        </div>
                        <div className='mt-6 md:mt-10'>
                            <p className='font-bold font-sans text-sm'>{ i18?.MYPOST?.PARCELIMAGES ||'Parcel Images:'}</p>
                            <div className='md:flex mt-6'>
                                <Image width={20} height={20} src="/svg/icon/iPhone.svg" alt="iPhone1" className='md:mr-10 mb-4 md:mb-0' />
                                <Image width={20} height={20} src="/svg/icon/iPhone2.svg" alt="iPhone2" />
                            </div>
                        </div>
                        <div className='mt-6 md:mt-10'>
                            <p className='font-bold font-sans text-sm'>{ i18?.VIEWPARCEL?.PARCELTYPE||'Parcel Type:'} <span className='font-normal font-sans text-sm ml-3'>Fragile</span></p>
                        </div>
                        <div className='mt-6 md:mt-10'>
                            <p className='font-bold font-sans text-sm'>{i18?.VIEWPARCEL?.PARCELPICLOC||'Parcel Pickup Location:'} <span className='font-normal font-sans text-sm ml-3'>Simmakkal, Madurai</span></p>
                        </div>
                        <div className='mt-6 md:mt-10'>
                            <p className='font-bold font-sans text-sm'>{i18?.VIEWPARCEL?.PARCELDESLOC||'Parcel Destination Location:'}  <span className='font-normal font-sans text-sm ml-3'>Kalavasal, GG Complex, Madurai, India</span></p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between mt-6 md:mt-8">
                            <div className="flex justify-start items-center">
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20} src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 font-sans">Chat With Poster</h4>
                            </div>
                            <div className="flex justify-start items-center mt-4 md:mt-0">
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20} src="/svg/icon/locationPin.svg" alt="locationPinIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 font-sans">1.3 Kms Between Postier & You</h4>
                            </div>
                            <div className="flex justify-start items-center mt-4 md:mt-0">
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20}  src="/svg/icon/wallClock.svg" alt="wallClockIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 font-sans">2 Days To Deliver The Parcel</h4>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-between md:mt-0 mt-6'>
                        <div>
                            <div className="mr-1 md:mr-0">
                                <Button className="font-bold font-sans border p-3 md:p-4 rounded-md w-full md:w-52 shadow-md" >
                                    $25
                                </Button>
                            </div>
                        </div>
                        <div className="md:mr-0 mr-1 mt-2 md:mt-0">
                            <Button className="font-sans border p-3 md:p-4 text-white rounded-md w-full md:w-52 shadow-md bg-btncolor" onClick={() => setModal('TrackingModal')}>
                                Tracking
                            </Button>
                        </div>
                    </div>
                </div>
                {/* <CustomModal open={open} onClose={() => setOpen(false)} title='Order Tracking'>
                    <TrackingModal />
                </CustomModal> */}
            </div>
        </>
    )
}

export default ParcelRequest
