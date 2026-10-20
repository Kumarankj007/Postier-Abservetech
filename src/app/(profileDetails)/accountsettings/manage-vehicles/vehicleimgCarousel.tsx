import VehicleStore from "@/app/store/vehicle"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import CarouselNavigate2 from "@/app/component/carouselNavBtn2";

export default function VehicleImgCarousel({ VehicleDoc,baseurl }: any) {
    const UserID = typeof window !== undefined && localStorage.getItem('appUserId')
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
    }
    const handleSlideChange = () => {
        if (swiper.current) {
            setCurrentIndex(swiper.current.swiper.realIndex);
        }
    };
    // console.log('VehicleDoc', VehicleDoc)
    return (
        <div>
            <section className='carousel2 relative'>
                <Swiper
                    ref={swiper}
                    loop={false}
                    freeMode={true}
                    spaceBetween={1}
                    modules={[Navigation]}
                    slidesPerView={1}
                    className="mySwiper"
                    onSlideChange={handleSlideChange}
                >
                    <div className="border border-1 border-btncolor rounded-[21px] p-4">
                        {
                            Array.isArray(VehicleDoc) && VehicleDoc.map((item: any, index: any) => (
                                item.name === "vehicleImage" ?
                                    Array.isArray(item?.fields) && item?.fields.map((val: any, index: any) => (
                                        <SwiperSlide key={index}>
                                            <Image
                                                width={800} height={800}
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${baseurl ? val?.path : val?.value}`}
                                                alt="img"
                                                className={'rounded-[21px] object-cover h-[150px] w-[200px]'}
                                            />
                                        </SwiperSlide>
                                    ))

                                    :

                                    <SwiperSlide key={index}>
                                        <Image
                                            width={800} height={800}
                                            src={baseurl ||  item?.file.startsWith('public/') ? process.env.NEXT_PUBLIC_IMAGE_URL + item?.file : item?.file}
                                            alt="img"
                                            className={'rounded-[21px] object-cover h-[150px] w-[200px] object-fit'}
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
                                <div className={`absolute top-[70px] ${VehicleDoc[0]?.fields ? 'left-[-8px]' : 'left-[-29px]'} z-[999]`}>
                                    <CarouselNavigate2 type="prev" onClick={prevClick} />
                                </div>
                            )}
                            {currentIndex !==  (VehicleDoc[0]?.fields ? VehicleDoc[0]?.fields :VehicleDoc)?.length - 1 && (
                                <div className={`absolute top-[70px]  ${VehicleDoc[0]?.fields ? 'right-[-8px]' : 'right-[-25px]'} z-[999]`}>
                                    <CarouselNavigate2 type="next" onClick={nextClick} />
                                </div>
                            )}

                        </>
                    )}
            </section>
        </div>
    )
}



