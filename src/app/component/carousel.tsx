"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import CarouselNavigate from './carouselNavBtn';
import { Rating, Tooltip } from '@mui/material';
import useScreenDetector from '../hooks/useresize';
import { FormatDate } from '@/utils';
import ParcelSwiper from './swiper';
import Store from '../store/store';
import TypeStore from '../store/typeStore';
import SkeletonComponent from './skeleton';
import TooltipComp from './tooltip';
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import Image from 'next/image';
import Link from 'next/link';
import ImageWithFallback from './imagefallback';

export default function Carousel({ data }: any) {
    const screen = useScreenDetector();
     const  router  = UseLoadingRouter();
    const swiper = React.useRef<any>();
    const { Type } = TypeStore()
    const nextClick = () => {
        if (swiper.current)
            swiper.current.swiper.slideNext();
    };

    const prevClick = () => {
        if (swiper.current)
            swiper.current.swiper.slidePrev();
    };
    // console.log('data11', data)
    return (
        <>
            <section className='carousel'>
                <Swiper
                    ref={swiper}
                    loop={false}
                    freeMode={true}
                    spaceBetween={30}
                    modules={[Navigation]}
                    slidesPerView='auto'
                    className="mySwiper"
                >

                    {Array.isArray(data) && data.map((item: any, index: any) => (
                        <SwiperSlide key={index} >
                            <Link href={`/details/${item._id}`}>
                            <div className="pb-5 w-[260px] md:w-[330px] cursor-pointer" >
                                <div className="bg-[#fff] border shadow rounded-[21px] p-3 flex flex-col gap-3  w-[330px] ">
                                    <SkeletonComponent page='carousel' >
                                        {
                                            Type === 'sendparcel' ?
                                                <ImageWithFallback width={500} height={500} src={item?.postier?.profile.startsWith('http') ?
                                                    item?.postier?.profile
                                                    :
                                                    process.env.NEXT_PUBLIC_IMAGE_URL + item?.postier?.profile}
                                                    alt="Image"
                                                    className="rounded-[21px] object-fit h-[300px] w-[330px]"
                                                    defaultimg={'/png/dummy.jpg'}
                                                />
                                                :
                                                <ParcelSwiper data={item?.parcel?.image} />
                                        }

                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                <p className="font-bold text-[15px] lg:text-[30px] capitalize line-clamp-1">{Type === 'deliverparcel' ?
                                                    `${item?.sender?.firstName ? item?.sender?.firstName : '--'} ${item?.sender?.lastName ? item?.sender?.lastName : '--'}`
                                                    :
                                                    `${item?.postier?.fname ? item?.postier?.fname : '--'} ${item?.postier?.lname ? item?.postier?.lname : '--'}`}
                                                </p>
                                              {  Type === 'sendparcel' &&  <Rating name="read-only" value={item?.postier?.ratings?.totalValue} readOnly />}
                                            </div>
                                          {  Type === 'sendparcel' && <Image width={150} height={150} src={ process.env.NEXT_PUBLIC_IMAGE_URL + item?.postier?.vehicleImage} alt="Image" className='w-[90px] h-[40px] lg:w-[80px] lg:h-[80px]' />}
                                        </div>
                                        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex gap-2 items-center">
                                                <Image width={20} height={20} src='/svg/icon/locationG.svg' alt="Image" className='w-[20px] h-[20px]'/>
                                                <p className="font-bold text-[14px] lg:text-[17px] leading-8">
                                                    From:
                                                </p>
                                                <TooltipComp title={item?.location?.pickUp}>
                                                    <p className="font-normal text-[14px] lg:text-[17px] leading-8  line-clamp-1">{item?.location?.pickUp}</p>
                                                </TooltipComp>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <Image width={20} height={20} src='/svg/icon/locationR.svg' alt="Image" className='w-[20px] h-[20px]'/>
                                                <p className="font-bold text-[14px] lg:text-[17px] leading-8">
                                                    To:
                                                </p>
                                                <TooltipComp title={item?.location?.drop}>
                                                    <p className="font-normal text-[14px] lg:text-[17px] leading-8  line-clamp-1">{item?.location?.drop}</p>
                                                </TooltipComp>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Image width={20} height={20} src='/svg/icon/calendar.svg' alt="Image" />
                                            <p className="font-bold text-xs leading-8">
                                                <span className="font-normal text-[14px] lg:text-[17px] leading-8">{FormatDate(Type === 'deliverparcel' ? item?.parcel?.deliveryDate : item?.startDate)}</span>
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-bold text-[14px] lg:text-[17px] leading-8">
                                                Capacity: <span className="font-normal text-[14px] lg:text-[17px] leading-8">{Type === 'deliverparcel' ? item?.parcel?.apprxSize : item?.capacity}</span>
                                            </p>
                                            <p className="font-bold text-[14px] lg:text-[17px] leading-8">
                                                Price: <span className="font-normal text-[14px] lg:text-[17px] leading-8">{Type === 'deliverparcel' ? '150' : item?.avgPrice}</span>
                                            </p>
                                        </div>
                                    </SkeletonComponent>
                                </div>


                            </div>
                            </Link>
                        </SwiperSlide>
                    ))}

                </Swiper>
                {
                    data.length > 4 &&
                    <div className='mt-[40px] flex justify-end gap-5'>
                        {
                            (screen === 'tablet' || screen === 'desktop' &&
                                <>
                                    <div className="">
                                        <CarouselNavigate type="prev" onClick={prevClick} />
                                    </div>
                                    <div className=" ">
                                        <CarouselNavigate type="next" onClick={nextClick} />
                                    </div>
                                </>
                            )
                        }

                    </div>
                }

            </section>

        </>
    )
}