import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import LinearProgressBar from "./linearprogress";
import Utils from "@/app/store/utils";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "@/app/component/threedotloader";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import { usePathname } from "next/navigation";
import ContentTooptip from "@/app/component/contentTooptip";
import { PriceContent } from "@/app/(profileDetails)/accountsettings/content";
import {  usePrice } from "@/app/providers/pricecontext";

export default function AveragepriceWrapper({type="parcel"}:{type?: string}) {
    return (
            <Averageprice type={type} />
    );
}

function Averageprice({type="parcel"}:{type?: string}) {
    const path = usePathname()
    const { setPacelData, Parceldata } = StoreParcel()
    const { loading } = useLoaderStore()
    const { i18 } = useContext(PageContext);
    const { Estimation } = Utils()
    const { MyTripsDetails }: any = ParcelStore()
    const { setDisable, disable }: any = useFormContext()
    const {price, setprice} = usePrice();
    // const price = priceContext?.price ?? 0;
    // const setprice = priceContext?.setprice ?? (() => {});
    const minPrice = 0.06;
    const maxPrice = 1.00;
    const step = 0.01;
    // console.log(disable, Parceldata?.fare, "disable")

    const fonts = {
        price: " md:text-[70px] sm:text-[60px] text-[40px] font-bold "
    }

    useLayoutEffect(() => {
        setDisable(false)
        // if (Parceldata?.fare && type=="parcel") {
        //     // setprice(Number(Parceldata?.fare))
        // } else if (Parceldata?.Price && type=="trip") {
        //     // setprice(Parceldata?.Price && Number(Parceldata?.Price));
        //     setDisable(false);
        // } else if (Parceldata?.PriceType) {
        //     // setprice(Number(Parceldata?.PriceType))
        //     setDisable(false)
        // }
        // else {
        //     // setDisable(true)
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])
    useEffect(() => {
        if (Estimation.avgPrice) {
            setprice(Number(Estimation?.avgPrice))
            setPacelData(type == "trip" ? "Price" : 'fare', Estimation?.avgPrice)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Estimation])

    const handleDecrease = () => {
        setprice((prev: number) => {
            const newPrice = Math.max(minPrice, +(prev - step).toFixed(2));
            setPacelData(type == "trip" ? "Price" : 'fare', newPrice);
            return newPrice;
        });
    };
    const handleIncrease = () => {
        setprice((prev: number) => {
            const newPrice = Math.min(maxPrice, +(prev + step).toFixed(2));
            setPacelData(type == "trip" ? "Price" : 'fare', newPrice);
            return newPrice;
        });
    };

    // Store price in Zustand store and localStorage when it changes
    useEffect(() => {
        if (price) {
            localStorage.setItem('price', JSON.stringify(price));
            setPacelData(type == "trip" ? "Price" : 'price', price);
        }
    }, [price, setPacelData, type]);
    // console.log("Price1111", price,Parceldata);

    return (
        <div className="flex flex-col gap-6 justify-center items-center h-auto p-[20px]">
            <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">{i18?.NEW?.AVERAGEPRICE || "Average Price you want for this trip"}</h3>
            <div className="w-full md:max-w-[600px] flex flex-col gap-[40px] items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center md:gap-16 sm:gap-10 gap-5">
                        <button
                            type="button"
                            aria-label="Decrease price"
                            onClick={handleDecrease}
                            className={(price !== minPrice ? "border-[#1976D2] text-[#1976D2]" : "border-[#E0E0E0] text-[#A0A0A0]") + " sm:w-[70px] w-[40px] sm:h-[70px] h-[40px] rounded-full border-4 flex items-center justify-center text-4xl hover:bg-[#F5F5F5]"}
                        >
                            -
                        </button>
                        <div className="flex flex-col items-center">

                            <span
                                className={
                                    (price < 0.10
                                        ? "text-[#F5A623]"
                                        : price === 0.10
                                            ? "text-[#43A047]"
                                            : price < 0.15
                                                ? "text-[#43a047]"
                                                : "text-[#f52323]") + fonts.price
                                }
                            >
                                €{price.toFixed(2)}
                            </span>
                        </div>
                        <button
                            type="button"
                            aria-label="Increase price"
                            onClick={handleIncrease}
                            className="sm:w-[70px] w-[40px] sm:h-[70px] h-[40px] rounded-full border-4 border-[#1976D2] flex items-center justify-center text-4xl text-[#1976D2] hover:bg-[#E3F2FD]"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="mt-4 w-full flex flex-col items-left">
                    <div className={`text-white px-4 py-2 rounded font-semibold mb-2 ${price < 0.10 ? 'bg-[#F5A623]' : price >= 0.10 && price < 0.15 ? 'bg-[#43A047]' : 'bg-[#f52323]'}`}>
                        {
                            price < 0.10 ? "Postier Recommendation Price :€0.06 – €0.09 / km." : price >= 0.10 && price < 0.15 ? "Correct Pricing :€0.1 - €0.14 / km." : "Over Pricing:€0.1 - €0.15 / km."
                        }
                    </div>
                    <div className="text-[#1976D2] text-base font-medium text-left mb-2">
                        Consider increasing your price to better share your travel costs for this ride. You will get bookings in no time!
                    </div>
                </div>
                <LinearProgressBar price={price} />
            </div>
            <p className="text-[16px] font-[500] max-w-[450px] leading-[31px] text-center">
                {i18?.NEW?.AVERAGEPRICECONTENT || "The average price for sending your parcel is based on factors like distance, weight, size, and urgency."}
                <span className="inline-flex">
                    <ContentTooptip value={PriceContent()} />
                </span>
            </p>
        </div>
    )
}