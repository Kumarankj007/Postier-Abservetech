/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useContext, useEffect, useState } from "react";
import { carouselData } from "../../../../content";
import SearchBar from "@/app/component/searchbar";
import ToggleButton from "@/app/component/togglebtn";
import dynamic from "next/dynamic";
import PageContext from "@/app/providers/pagecontext";
import { getCookie, getCurrentLocation } from "@/utils";
import ParcelStore from "@/app/store/parcel";
import TypeStore from "@/app/store/typeStore";
import { useSearchParams } from "next/navigation";
import EmptyPage from "@/app/component/emptydatapage";

const Carousel = dynamic(() => import('@/app/component/carousel'))
const CarouselDummy = dynamic(() => import('@/app/component/carouselDummy'))

export default function HomePage() {
    const searchParams = useSearchParams()
    const { i18 } = useContext(PageContext);
    const { FetchParcelLocation, parcel } = ParcelStore()
    const { Type } = TypeStore()
    const [locations, setLocation] = useState({ latitude: null, longitude: null });
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const coords: any = await getCurrentLocation();
                setLocation(coords);
            } catch (err: any) {
                console.log(err.message);
            }
        };

        fetchLocation();
    }, []);
    // console.log('locations', locations)
    useEffect(() => {
        const data: any = {}

        if (searchParams.size === 0) {
            if(locations.latitude){
                data.pickupLat = locations.latitude
            }
            if(locations.longitude){
                data.pickupLng = locations.longitude
            }

        }else if(searchParams.size > 0) {
            if (searchParams.get('pickupLat')) {
                data.pickupLat =  searchParams.get('pickupLat')
            }
            if (searchParams.get('pickupLng')) {
                data.pickupLng =  searchParams.get('pickupLng')
            }
            if (searchParams.get('dropLat')) {
                data.dropLat =  searchParams.get('dropLat')
            }
            if (searchParams.get('dropLng')) {
                data.dropLng =  searchParams.get('dropLng')
            }
        }
        FetchParcelLocation(data, Type)
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locations, Type,searchParams])
    const lang = getCookie('NEXT_LOCALE') 
   
    return (
        <div>
            <div className=" bg-center h-screen background-image">
                <div className="">
                    <div className=" mt-[0px] md:mt-[50px] flex flex-col align-center justify-center gap-10 ">
                        <p className="font-bold text-xl sm:text-3xl md:text-5xl max-w-[700px] mx-auto text-center leading-[30px] sm:leading-[45px] md:leading-[65px]">
                            {i18?.HOMEPAGE?.HEADER?.HEADING || "Send, Deliver a Parcel From Anywhere to Anyplace"}
                        </p>
                        <p className="text-center font-normal text-xs md:text-base max-w-[734px] mx-auto leading-8">
                            {i18?.HOMEPAGE?.HEADER?.SUBHEADING || " Provide a brief overview of your parcel delivery services, emphasizing reliability, speed, and customer satisfaction."}
                        </p>
                        <ToggleButton />
                        <SearchBar />
                    </div>
                </div>
            </div>
            <div className=" flex flex-col gap-5">
                <h2 className="font-bold text-[25px] md:text-[40px] leading-10	mt-[50px]">
                    {i18?.HOMEPAGE?.HEADER?.TRIPSIN || "Trips in the city"}

                </h2>
                <p className="font-normal text-base	">
                    {i18?.HOMEPAGE?.HEADER?.SUBTRIPSIN || "Here is the list of postiers traveling within your current location"}
                </p>
                {
                    Array.isArray(parcel) && parcel.length > 0 ?
                        <Carousel data={parcel} />
                        :
                        <EmptyPage image='/png/homepageEmpty.png' text={ i18?.HOMEPAGE?.HEADER?.NOPARCEL|| 'No Parcel Send Requests From This Location'}/>
                }

            </div>

            {/* <div className="p-[30px] flex flex-col gap-5">
                <h2 className="font-bold text-[40px] leading-10">
                    {i18?.HOMEPAGE?.HEADER?.TRIPSOUTSIDE || "Trips outside the city"}
                </h2>
                <p className="font-normal text-base	">
                    {i18?.HOMEPAGE?.HEADER?.SUBTRIPSOUTSIDE || "Here is the list of postiers traveling within your current location"}
                </p>
                <Carousel data={carouselData} />
            </div> */}
        </div>
    )
}  