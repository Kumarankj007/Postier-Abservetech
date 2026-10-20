'use client'
import LabeledInput from "@/app/component/input";
import LoaderScript from "@/app/component/loadingscript";
import MapComponent from "@/app/component/mapComp";
import StoreParcel from "@/app/store/store-parcel";
import { Autocomplete } from "@react-google-maps/api";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useFormContext } from "../../FormCotext";
import Suggestions from "../suggestionautocomplete";
import RouteMap from "@/app/component/routemap";
import Store from "@/app/store/store";
import LocationStore from "@/app/store/locations";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "@/app/component/threedotloader";
import { useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import useScreenWidth from "@/app/hooks/usescreenwidth";
import CustomModal from "@/app/component/modal";

interface State {
    pickupLng: number;
    pickupLat: number;
    pickupAddress: string;
    dropLng: number;
    dropLat: number;
    dropAddress: string;
}

export default function Route() {
    const param = useSearchParams()
    const { setDisable }: any = useFormContext()
    const { i18 } = useContext(PageContext);
    const screen = useScreenWidth()
    const { setPacelData, Parceldata } = StoreParcel()
    const { RouteIndex, setRouteIndex } = Store()
    const [result, setResult] = useState([])
    const { Routes, FetchRoutes } = LocationStore()
    const { loading } = useLoaderStore()
    const [modal, setModal] = useState(false)
    const handleReult = (value: any) => {
        setResult(value)
    }
    // console.log(RouteIndex, 'RouteIndex')
    useLayoutEffect(() => {
        if (Parceldata?.wayPointId) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata, RouteIndex])

    useEffect(() => {
        if (Parceldata?.wayPointId) {
            setRouteIndex(Parceldata?.wayPointId && Parceldata?.wayPointId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata?.wayPointId])
    // console.log('Parceldata', Parceldata)
    useEffect(() => {

        if (param.size > 0 && Routes && Parceldata?.wayPointId) {
            const index = Routes.findIndex((items: any) => items._id === Parceldata?.wayPointId)
            if (index !== -1) {
                setPacelData('routeObject', Routes[index]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [param, Routes, Parceldata?.wayPointId])
    useEffect(() => {
        FetchRoutes(
            {
                startCoords: [parseFloat(Parceldata.pickupLng), parseFloat(Parceldata.pickupLat)],
                endCoords: [parseFloat(Parceldata.dropLng), parseFloat(Parceldata.dropLat)]
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata.pickupLng,Parceldata.pickupLat,Parceldata.dropLng,Parceldata.dropLat])
    return (
        <div className={`flex h-full max-w-[1530px] mx-auto`}>
            <div className={` flex flex-col  ${screen.width && screen.width < 1098 ? 'w-full text-center items-center sticky top-0 z-[999] bg-[#fff] gap-[20px]' : 'w-1/2 gap-[40px]'} px-[20px] md:px-[40px]  justify-center text-[30px] md:text-[50px] font-bold`}>
                <h3>{i18?.NEW?.SPECIFYTHEROUTE || "Specify the route of"}<br />
                    {i18?.NEW?.YOURTRIP || "your trip"}</h3>
                {
                    loading ?
                        <ThreeDotLoader />
                        :
                        <div className="w-full md:max-w-[500px] flex flex-col gap-4">
                            {
                                Array.isArray(Routes) && Routes.map((item: any, index) => {
                                    // console.log('index1', index, RouteIndex)
                                    return (
                                        <div key={index} onClick={() => {
                                            // setRouteIndex(index);
                                            setPacelData('wayPointId', item._id);
                                            setPacelData('routeIndex', index);
                                            setPacelData('routeObject', item);
                                            setModal(true)
                                        }} className={`flex flex-col gap-3 border ${RouteIndex === item?._id ? 'border-2' : 'border-1 '} border-btncolor p-4 rounded-[7px] cursor-pointer`}>
                                            <div className="flex flex-col gap-3 items-start">
                                                <div className="flex gap-2">
                                                    <p className="text-[17px] font-[400] leading-[22px]">{item.durationText}</p><p className="text-[13px] text-center">-</p><p className="text-[17px] font-[400] leading-[22px]">{item.hasTolls ? 'Toll' : 'No Toll'}</p>
                                                </div>
                                                <p className="text-[17px] font-[400] leading-[22px]">{item.distanceText}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                }

            </div>
            {
                screen.width && screen.width > 1098 ?
                    <div className='w-1/2'>
                        <RouteMap
                            startCoords={[parseFloat(Parceldata.pickupLng), parseFloat(Parceldata.pickupLat)]}
                            endCoords={[parseFloat(Parceldata.dropLng), parseFloat(Parceldata.dropLat)]}
                            handleReult={handleReult}
                            screen={screen}
                        />
                    </div>
                    :
                    <CustomModal className2={'h-[500px]'} open={screen.width && screen.width < 1098 && modal} onClose={() => setModal(false)}>
                        <div className="w-full h-full">
                            <RouteMap
                                startCoords={[parseFloat(Parceldata.pickupLng), parseFloat(Parceldata.pickupLat)]}
                                endCoords={[parseFloat(Parceldata.dropLng), parseFloat(Parceldata.dropLat)]}
                                handleReult={handleReult}
                                screen={{ width: '1200' }}
                            />
                        </div>
                    </CustomModal>

            }

        </div>
    )
}