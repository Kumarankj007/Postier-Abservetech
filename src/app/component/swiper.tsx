"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import useScreenDetector from '../hooks/useresize';
import CarouselNavigate2 from './carouselNavBtn2';
import Image from 'next/image';

export default function ParcelSwiper({ data,props, help_center=false }: any) {
    const screen = useScreenDetector();
    const swiper = React.useRef<any>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextClick = () => {
        if (swiper.current) {
            swiper.current.swiper.slideNext();
        }
    };

    const prevClick = () => {
        if (swiper.current) {
            swiper.current.swiper.slidePrev();
        }
    };

    const handleSlideChange = () => {
        if (swiper.current) {
            setCurrentIndex(swiper.current.swiper.realIndex);
        }
    };

    // console.log('datadatadata', process.env.NEXT_PUBLIC_IMAGE_URL+data);

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
                    onSlideChange={handleSlideChange}
                >
                    {Array.isArray(data) && data.map((item: any, index: any) => (
                        <SwiperSlide key={index}>
                            <div>
                                <Image
                                 width={500} height={500}
                                    src={help_center ? item.img : process.env.NEXT_PUBLIC_IMAGE_URL + item}
                                    alt="img"
                                    className={props === 'parcelInfo' ? 'rounded-[21px] object-cover h-[150px] w-full' : 'rounded-[21px] object-fit h-[300px] w-[330px]'}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                 
                {
                    data?.length > 1 && (
                        <>
                            {currentIndex > 0 && (
                                <div className={props === 'parcelInfo'?'absolute top-[65px] left-4 z-[999]' : 'absolute top-[150px] left-5 z-[999]'}>
                                    <CarouselNavigate2 type="prev" onClick={prevClick} />
                                </div>
                            )}
                            {currentIndex < data?.length - 1 && (
                                 <div className={props === 'parcelInfo'?'absolute top-[65px] right-4 z-[999]' : 'absolute top-[150px] right-6 z-[999]'}>
                                    <CarouselNavigate2 type="next" onClick={nextClick} />
                                </div>
                            )}
                        </>
                    )}
                 
                   
                
                
            </section>
        </>
    );
}
