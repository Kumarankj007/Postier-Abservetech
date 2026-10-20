/* eslint-disable react-hooks/exhaustive-deps */
import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import Utils from "@/app/store/utils";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "@/app/component/threedotloader";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import { usePathname } from "next/navigation";
import ContentTooptip from "@/app/component/contentTooptip";
import { PriceContent } from "@/app/(profileDetails)/accountsettings/content";
import { PriceProvider, usePrice } from "@/app/providers/pricecontext";
import { EstimationProvider, useEstimation } from "@/app/providers/estimationcontext";
import ParcelImage from "../../../../../public/png/imageparcel.png"
import step1 from "../../../../../public/png/step1.png"
import step2 from "../../../../../public/png/step2.png"
import step3 from "../../../../../public/png/step3.png"
import step4 from "../../../../../public/png/step4.png"
import step5 from "../../../../../public/png/step5.png"
import step6 from "../../../../../public/png/step6.png"
import Image from "next/image";

export default function EstimationWrapper({type=""}: {type?: string}) {
    return (
        <PriceProvider>
            <EstimationProvider>
                <Estimation type={type}/>
            </EstimationProvider>
        </PriceProvider>
    );
}

function Estimation({type=""}: {type?: string}) {
    const { price } = usePrice();
    const { estimation } = useEstimation();
    const { Parceldata } = StoreParcel(); // Ensure Parceldata is available
    const [initialvalue, setInitialValue] = useState<number | null>(null);
    const estimatestorage = localStorage.getItem('estimationnew');
    const estimationObj = estimatestorage ? JSON.parse(estimatestorage) : null;
    const getpricestorage = localStorage.getItem('price');
    const { setDisable }: any = useFormContext()
  const { FetchEstimationTrip, EstimationTrip } = Utils();
    // Ensure context is initialized with data if available

    // useEffect(()=>{
    //     if(type == "trip"){
    //         FetchEstimationTrip({
    //             capacity: 1,
    //             vehicleId: "691ea15dec234e91bdd17f96",
    //             routeId: "69200fcbec234e91bdd184c2",
    //             "width": "1",
    //             "height": "1",
    //             "length": "1",
    //             "weight": "0.4",
    //             "pickupLat": 9.9252,
    //             "pickupLng": 78.1198,
    //             "dropLat": 13.0843,
    //             "dropLng": 80.2705,
    //             metrics: {
    //             distanceMetric: "KILOMETER",
    //             timeMetric: "MINUTE",
    //             dimensionalMetric: "CM",
    //             },
    //             "distanceCostFactor": 0.08,
    //             "urgencyLevel": "standard",
    //             "parcelType": "fragile"
    //         });
    //     }
    // },[])

    // console.log("estimatestorage", estimationObj)
    useEffect(() => {

        // console.log("parseFloat", estimationObj?.estimation?.distanceInKM * estimationObj?.estimation?.distanceCostFactor)

        // console.log(
        //     "parseFloat11",
        //     estimationObj?.estimation?.distanceDiscountMultiplier !== undefined
        //         ? parseFloat(estimationObj.estimation.distanceDiscountMultiplier.toString()).toFixed(2)
        //         : "0.00"
        // );

        // console.log("estimatestorage", estimatestorage, estimationObj);
        if (estimatestorage) {
            const value = estimationObj?.estimation?.distanceInKM * estimationObj?.estimation?.distanceCostFactor;
            // Round to two decimal places
            const roundedValue = typeof value === "number" && !isNaN(value) ? Math.round(value * 100) / 100 : null;
            // console.log("roundedValue", roundedValue);

            setInitialValue(roundedValue);
            // console.log("initialvalue", estimationObj?.estimation?.distanceInKM, estimationObj?.estimation?.distanceCostFactor, roundedValue);
        }
        if (getpricestorage) {
            // console.log("getpricestorage", getpricestorage);
        }


    }, [getpricestorage, Parceldata, estimatestorage,estimationObj]);

    // console.log("estimationObj", estimationObj?.estimation?.distanceInKM, estimationObj?.estimation?.distanceCostFactor);

    const AD = (initialvalue !== null && estimationObj?.estimation?.distanceDiscountMultiplier !== undefined)
        ? parseFloat((initialvalue * estimationObj?.estimation?.distanceDiscountMultiplier).toString()).toFixed(2)
        : "0.00";
    const BR = (AD !== null && estimationObj?.estimation?.baseFare !== undefined)
        ? parseFloat((parseFloat(AD) + estimationObj?.estimation?.baseFare).toString()).toFixed(2)
        : "0.00";
    const UL = (BR !== null && estimationObj?.estimation?.urgencyMultiplier !== undefined)
        ? parseFloat((parseFloat(BR) * estimationObj?.estimation?.urgencyMultiplier).toString()).toFixed(2)
        : "0.00";
    const PT = (UL !== null && estimationObj?.estimation?.parcelTypeDiscountMultiplier !== undefined)
        ? parseFloat((parseFloat(UL) * estimationObj?.estimation?.parcelTypeDiscountMultiplier).toString()).toFixed(2)
        : "0.00";
    const WD = (PT !== null && estimationObj?.estimation?.weightDiscountMultiplier !== undefined)
        ? parseFloat((parseFloat(PT) * estimationObj?.estimation?.weightDiscountMultiplier).toString()).toFixed(2)
        : "0.00";
    const SD = (WD !== null && estimationObj?.estimation?.sizeDiscountMultiplier !== undefined)
        ? parseFloat((parseFloat(WD) * estimationObj?.estimation?.sizeDiscountMultiplier).toString()).toFixed(2)
        : "0.00";
    // console.log("AD", AD, "BR", BR, "UL", UL, "PT", PT, "WD", WD, "SD", SD);
    // console.log("ADValue", Number(AD) + estimationObj?.estimation?.baseFare);
    // const distanceCostFactor = estimation?.estimation?.distanceInKM * estimation?.estimation?.distanceCostFactor 
    // console.log("distanceCostFactor", distanceCostFactor);

    // handleContinue button:
    useEffect(()=>{
        setDisable(false);
    },[])

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#F5F7FA] px-2 py-8">
            <h2 className="text-[36px] font-bold mb-8 text-center">Estimation for postier</h2>
            <div className="bg-[#0A3576] text-white text-lg font-semibold rounded-t-xl px-6 py-3 w-full max-w-5xl text-center">Final Calculation</div>
            <div className="bg-white border border-[#004080] w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
                {/* Left Section: Parcel Image & Final Price */}
                <div className="flex flex-col items-center justify-center p-8 md:w-1/3">
                    <div className="border-2 border-[#004080] rounded-[10px] p-4 mb-6">
                        <Image src={ParcelImage.src} alt="Parcel" className="w-[160px] h-[160px] mb-6" width={160} height={160}/>
                    </div>

                    <div className="text-[48px] font-bold text-[#37474F] text-[18px] mb-2">
                        {/* {getpricestorage ? getpricestorage : 0} */}
                        €{estimationObj?.estimation?.finalPrice ? Number(estimationObj?.estimation?.finalPrice || 0).toFixed(2) : 0}

                        </div>
                </div>
                {/* Right Section: Calculation Steps */}
                <div className="flex-1 overflow-auto scroll-container">

                    <div className="flex md:gap-6 border-t border-[#004080] w-full min-w-[500px]">
                        {/* Calculation Steps - Each step in its own div for clarity */}
                        <div className="md:w-[50%] w-[60%] border-r border-[#004080] md:pr-6 sm:p-5 p-3">
                            <div className="flex items-center gap-3 h-[60px]">
                                <Image src={step1.src} className="w-[20px] h-[20px]" alt="image" width={160} height={160}/>
                                <span className="text-[18px] font-bold">Adjusted Distance</span>
                                {/* {estimationObj?.estimation?.distanceInKM} * {estimationObj?.estimation?.distanceCostFactor} */}
                            </div>

                            <div className="flex items-center gap-3 h-[60px]">
                                <Image alt="image" src={step2.src} className="w-[20px] h-[20px]" width={160} height={160}/>
                                <span className="text-[18px] font-bold">Base Rate €{Number(estimationObj?.estimation?.baseFare || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-3 h-[60px]">
                                <Image alt="image" src={step3.src} className="w-[20px] h-[20px]" width={160} height={160}/>
                                <span className="text-[18px] font-bold">{estimationObj?.estimation?.urgencyType === "express" ? "Express" : estimationObj?.estimation?.urgencyType === "sameDay" ? "Same-Day":"Standard" } ({estimationObj?.estimation?.urgencyMultiplier})</span>
                            </div>

                            <div className="flex items-center gap-3 h-[60px]">
                                <Image alt="image" src={step4.src} className="w-[20px] h-[20px]" width={160} height={160} />
                                <span className="text-[18px] font-bold">{estimationObj?.estimation?.parcelType === "fragile" ? "Fragile Items" : estimationObj?.estimation?.parcelType === "oversized" ? "Oversized Packages": estimationObj?.estimation?.parcelType === "temparatureSensitive" ? "Temperature-Sensitive Goods":"Standard Parcel" } </span>
                            </div>

                            <div className="flex items-center gap-3 h-[60px]">
                                <Image alt="image" src={step5.src} className="w-[20px] h-[20px]" width={160} height={160}/>
                                <span className="text-[18px] font-bold">Weight Discount
                                     5% ({estimationObj?.estimation?.highestWeight}kg)
                                     </span>
                            </div>
                            <div className="flex items-center gap-3 h-[60px]">
                                <Image alt="image" src={step6.src} className="w-[20px] h-[20px]" width={160} height={160}/>
                                <span className="text-[18px] font-bold">Size Discount</span>
                            </div>


                        </div>
                        <div className="md:w-[50%] w-[40%] sm:p-5 p-3 flex flex-col md:items-start items-center">
                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">
                                    €{Number(estimationObj?.estimation?.initStep || 0).toFixed(2)} * {estimationObj?.estimation?.distanceDiscountMultiplier}  = 
                                </span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1"> €{Number(estimationObj?.estimation?.step1 || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">€{Number(estimationObj?.estimation?.step1 || 0).toFixed(2)} + €{estimationObj?.estimation?.baseFare} =</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">€{Number(estimationObj?.estimation?.step2 || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">€{Number(estimationObj?.estimation?.step2 || 0).toFixed(2)} x {estimationObj?.estimation?.urgencyMultiplier} =</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">€{Number(estimationObj?.estimation?.step3 || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">€{Number(estimationObj?.estimation?.step3 || 0).toFixed(2)} x {estimationObj?.estimation?.parcelTypeDiscountMultiplier} =</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">€{Number(estimationObj?.estimation?.step4 || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">€{Number(estimationObj?.estimation?.step4 || 0).toFixed(2)} x {estimationObj?.estimation?.weightDiscountMultiplier} =</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">€{Number(estimationObj?.estimation?.step5 || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center h-[60px]">
                                <span className="text-[#37474F] text-[18px] font-bold">€{Number(estimationObj?.estimation?.step5 || 0).toFixed(2)} x {estimationObj?.estimation?.sizeDiscountMultiplier} =</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">€{Number(estimationObj?.estimation?.step6 || 0).toFixed(2)}</span>
                            </div>

                        </div>
                        {/* <div className="flex items-center gap-3 h-[60px] justify-between">
                            <div className="flex items-center gap-3 h-[60px]">
                                <span className="text-[#0A3576] text-2xl">⏱️</span>
                                <span className="text-[18px] font-bold">Express ({estimationObj?.estimation?.step2})</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[#37474F] text-[18px] font-bold">{estimationObj?.estimation?.step2} x {estimationObj?.estimation?.urgencyMultiplier}</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">{estimationObj?.estimation?.step3}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 h-[60px] justify-between">
                            <div className="flex items-center gap-3 h-[60px]">
                                <span className="text-[#0A3576] text-2xl">🥂</span>
                                <span className="text-[18px] font-bold">Fragile</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[#37474F] text-[18px] font-bold">{estimationObj?.estimation?.step3} x {estimationObj?.estimation?.parcelTypeDiscountMultiplier}</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">{estimationObj?.estimation?.step4}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 h-[60px] justify-between">
                            <div className="flex items-center gap-3 h-[60px]">
                                <span className="text-[#0A3576] text-2xl">⚖️</span>
                                <span className="text-[18px] font-bold">Weight Discount 5% (12kg)</span>
                            </div>
                            
                            <div className="flex flex-col items-end">
                                <span className="text-[#37474F] text-[18px] font-bold">{estimationObj?.estimation?.step4} x {estimationObj?.estimation?.weightDiscountMultiplier}</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">{estimationObj?.estimation?.step5}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 h-[60px] justify-between">
                            <div className="flex items-center gap-3 h-[60px]">
                                <span className="text-[#0A3576] text-2xl">📦</span>
                                <span className="text-[18px] font-bold">Size Discount</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[#37474F] text-[18px] font-bold">{estimationObj?.estimation?.step5} x {estimationObj?.estimation?.sizeDiscountMultiplier}</span>
                                <span className="bg-[#BFD7F7] text-[#0A3576] px-4 py-1 rounded-full font-bold mt-1 ml-1">{estimationObj?.estimation?.step2}</span>
                            </div>
                            Final Value: {estimationObj?.estimation?.finalPrice}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}