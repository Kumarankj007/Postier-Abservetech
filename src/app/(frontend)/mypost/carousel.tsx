import VehicleStore from "@/app/store/vehicle"
import React, { useEffect, useMemo, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import CarouselNavigate2 from "@/app/component/carouselNavBtn2";

export default function VehicleImgCarousel({ VehicleDoc }: any) {
    const UserID = typeof window !== undefined && localStorage.getItem('appUserId')
    const swiper = React.useRef<any>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextClick = (e: any) => {
        e.stopPropagation();
        if (swiper.current) {
            swiper.current.swiper.slideNext();
        }
    };

    const prevClick = (e: any) => {
        e.stopPropagation();
        if (swiper.current) {
            swiper.current.swiper.slidePrev();
        }
    }
    const handleSlideChange = () => {
        if (swiper.current) {
            setCurrentIndex(swiper.current.swiper.realIndex);
        }
    };
    const images = useMemo(() => {
        
        const data = [
            {
                name: 'frontviewImage',
                image: VehicleDoc && VehicleDoc[0]?.frontviewImage
            },
            {
                name: 'primaryImage',
                image: VehicleDoc && VehicleDoc[0]?.primaryImage
            },
            {
                name: 'sideviewImage',
                image: VehicleDoc && VehicleDoc[0]?.sideviewImage
            },
            {
                name: 'topviewImage',
                image: VehicleDoc && VehicleDoc[0]?.topviewImage
            }
        ]
        return data
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <section className='carousel2 relative'>
                <Swiper
                    ref={swiper}
                    loop={false}
                    freeMode={true}
                    spaceBetween={3}
                    modules={[Navigation]}
                    slidesPerView={1}
                    className="mySwiper"
                    onSlideChange={handleSlideChange}
                >
                    <div className="flex items-center">
                        {
                            Array.isArray(images) && images.map((item: any, index: any) => (
                                <SwiperSlide key={index}>
                                    <Image
                                        width={800} height={800}
                                        src={process.env.NEXT_PUBLIC_IMAGE_URL + item?.image}
                                        alt="img"
                                        className={'rounded-[21px] object-fit h-[165px] object-cover'}
                                    />
                                </SwiperSlide>

                            ))
                        }
                    </div>

                </Swiper>
                {
                    VehicleDoc?.length >= 1 && (
                        <>
                            {currentIndex > 0 && (
                                <div className={`absolute top-[75px]  left-[-29px] z-[999]`}>
                                    <CarouselNavigate2 type="prev" onClick={(e: any) => prevClick(e)} />
                                </div>
                            )}
                            {currentIndex !== images.length - 1 && (
                                <div className={`absolute top-[75px]  right-[-25px] z-[999]`}>
                                    <CarouselNavigate2 type="next" onClick={(e: any) => nextClick(e)} />
                                </div>
                            )}

                        </>
                    )}
            </section>
        </div>
    )
}



