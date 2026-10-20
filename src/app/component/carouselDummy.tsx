"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import CarouselNavigate from './carouselNavBtn';
import { Rating } from '@mui/material';
import  useScreenDetector  from '../hooks/useresize';
import Image from 'next/image';

export default function CarouselDummy({ data }: any) {
    const screen = useScreenDetector();
    const swiper = React.useRef<any>();

    const nextClick = () => {
        if (swiper.current)
            swiper.current.swiper.slideNext();
    };

    const prevClick = () => {
        if (swiper.current)
            swiper.current.swiper.slidePrev();
    };
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

                    {data.map((item: any, index: any) => (
                        <SwiperSlide key={index} >
                            <div className="flex flex-col gap-6">
                               <Image src={item?.img} alt='img' width={800} height={800} className='w-[350px] h-[350px] '/>
                               <p>{item?.text}</p> 
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>

                <div className='mt-[40px] flex justify-end gap-5'>
                    {
                        (screen ==='tablet' || screen==='desktop' &&
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
            </section>

        </>
    )
}