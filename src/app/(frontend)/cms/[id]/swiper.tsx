"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import CarouselNavigate2 from "@/app/component/carouselNavBtn2";
import Link from "next/link";

export default function HelpCarousel({ data = [], font = "" }: any) {
  const swiper = React.useRef<any>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const hoverEffect =
    " hover:shadow-2xl hover:ring-4 hover:border-transparent duration-300 group ";

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

  // console.log(currentIndex, "currentIndex");

  return (
    <section>
      <Swiper
        ref={swiper}
        loop={false}
        freeMode={true}
        modules={[Navigation]}
        onSlideChange={handleSlideChange}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="w-full"
        // onSlideChange={handleSlideChange}
      >
        {Array.isArray(data) &&
          data.map((item: any, index: any) => (
            <SwiperSlide key={index}>
              <Link href={item.url} className={font + " hover:text-[#004080]"}>
                <div
                  className={
                    hoverEffect +
                    "border-[1.8px] border-black rounded-xl m-2 p-4 overflow-hidden"
                  }
                >
                  <Image
                    width={300}
                    height={300}
                    src={item.img}
                    alt="img"
                    className={
                      "rounded-[21px] mx-auto object-contain h-[300px] w-[330px] group-hover:scale-110 duration-300"
                    }
                  />
                </div>
                <p className={` mt-5 text-center`}>{item.name}</p>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
      {data?.length > 1 && (
        <div
          className={
            (data?.length > 4
              ? ""
              : data?.length > 3
              ? "lg:hidden"
              : data?.length > 2
              ? "md:hidden"
              : "sm:hidden") +
            " flex gap-5 sm:justify-end justify-center sm:mt-10 mt-4 pr-2"
          }
        >
          <div className={""}>
            <CarouselNavigate2 type="prev" onClick={prevClick} />
          </div>

          <div className={" "}>
            <CarouselNavigate2 type="next" onClick={nextClick} />
          </div>
        </div>
      )}
    </section>
  );
}
