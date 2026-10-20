'use client'
import LabeledInput from "@/app/component/input";
import LoaderScript from "@/app/component/loadingscript";
import MapComponent from "@/app/component/mapComp";
import StoreParcel from "@/app/store/store-parcel";
import { Autocomplete } from "@react-google-maps/api";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useFormContext } from "../../FormCotext";
import Suggestions from "../suggestionautocomplete";
import PageContext from "@/app/providers/pagecontext";
import useScreenWidth from "@/app/hooks/usescreenwidth";

interface State {
    pickupLng: number;
    pickupLat: number;
    pickupAddress: string;
    dropLng: number;
    dropLat: number;
    dropAddress: string;
}

export default function PickupLocation() {
    const { setDisable }: any = useFormContext()
    const screen = useScreenWidth()
    const { i18 } = useContext(PageContext);
    const {setPacelData,Parceldata} = StoreParcel()
    const [autocomplete, setautocomplete] = useState<any>(null)
    const [value, setValue] = useState<State>({
        pickupLng: 10.4515,
        pickupLat: 51.1657,
        pickupAddress: '',
        dropLng: 0,
        dropLat: 0,
        dropAddress: ''
    });
    const [address, setAddress] = useState('')

    const onLoadPickup = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocomplete(autocomplete)
        }
    }
    const updateValue = (key: string, newValue: string | number) => {
        setValue((prevState : any) => ({
            ...prevState,
            [key]: newValue
        }));
    };
    const onLocationChange = useCallback(({lat,lng,address,city}:any) => {
        if (lng) {
            updateValue('pickupLng', lng);
            setPacelData('pickupLng', lng);
        }
        if (lat) {
            updateValue('pickupLat', lat);
            setPacelData('pickupLat', lat);
        }
        if (address) {
            setAddress(address);
            setPacelData('pickupAddress', address);
        }
        if (city){
            setPacelData('pickUpCity',city)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const latilon = useMemo(()=>{
        return Parceldata.pickupLat ? [Parceldata.pickupLat,Parceldata?.pickupLng] : [value.pickupLat,value.pickupLng] 
    },[value,Parceldata])

    useLayoutEffect(() => {
        if (Parceldata?.pickupLng) {
            setDisable(false)
        } 
        else{
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata,address])
    
    useEffect(()=>{
        if (Parceldata?.pickupAddress) {
            setAddress(Parceldata?.pickupAddress && Parceldata?.pickupAddress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div className={`flex max-w-[1530px] mx-auto ${screen.width && screen.width < 1098 ? 'flex-col items-center relative' : 'flex-row ' } h-full`}>
            <div className={` flex flex-col  ${screen.width && screen.width < 1098 ? 'w-full text-center items-center sticky top-0 z-[999] bg-[#fff] gap-[20px]' : 'w-1/2 gap-[40px]'}  px-[40px]  justify-center  text-[50px] font-bold`}>
                <h3 className={`${screen.width && screen.width < 1098 ? 'text-[20px]' : 'text-[50px]'}`}>{i18?.NEW?.WHATSTHEPICKUPPOINT || "What’s the pickup point"} {screen.width && screen.width < 1098 ? null : <br />} 
                    {i18?.NEW?.FORTHEPARCEL || "for the parcel?"}</h3>
                <div className={" w-full md:w-[500px]"}>
                    <Suggestions type='pickup'/>
                </div>
            </div>
            <div className={`${screen.width && screen.width < 1098 ? 'w-full' : 'w-1/2'}`}>
                <MapComponent latlng={latilon} onLocationChange={onLocationChange} screen={screen}/>
            </div>
        </div>
    )
}