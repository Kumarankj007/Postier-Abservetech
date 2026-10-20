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
    dropLng: number;
    dropLat: number;
    dropAddress: string;
}

export default function DropLocation() {
    const { setDisable }: any = useFormContext()
    const screen = useScreenWidth()
    const { i18 } = useContext(PageContext);
    const { setPacelData, Parceldata } = StoreParcel()
    const [autocompleteDestination, setautocompleteDestination] = useState<any>(null)
    const [value, setValue] = useState<State>({
        dropLng: 10.4515,
        dropLat: 51.1657,
        dropAddress: ''
    });
    const [address, setAddress] = useState('')

    const onLoaddestination = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocompleteDestination(autocomplete)
        }
    }
    const updateValue = (key: string, newValue: string | number) => {
        setValue((prevState: any) => ({
            ...prevState,
            [key]: newValue
        }));
    };
    const onLocationChange = useCallback(({ lat, lng, address , city}: any) => {
        if (lng) {
            updateValue('dropLng', lng);
            setPacelData('dropLng', lng);
        }
        if (lat) {
            updateValue('dropLat', lat);
            setPacelData('dropLat', lat);
        }
        if (address) {
            setAddress(address);
            setPacelData('dropAddress', address);
        }
        if (city){
            setPacelData('dropCity',city)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onPlaceChanged = () => {
        if (autocompleteDestination !== null && autocompleteDestination.getPlace) {
            const placeDetail = autocompleteDestination.getPlace()
            const place = placeDetail.formatted_address
            const lat = placeDetail.geometry?.location.lat()
            const lng = placeDetail.geometry?.location.lng()
            if (lng) {
                updateValue('dropLng', lng);
                setPacelData('dropLng', lng);
            }
            if (lat) {
                updateValue('dropLat', lat);
                setPacelData('dropLat', lat);
            }
            if (place) {
                setAddress(place);
                setPacelData('dropAddress', place);
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    // console.log('value', value)

    const latilon = useMemo(() => {
        return Parceldata?.dropLat ? [Parceldata?.dropLat, Parceldata?.dropLng] : [value.dropLat, value.dropLng]
    }, [value, Parceldata])

    useLayoutEffect(() => {
        if (Parceldata?.dropLng) {
            setDisable(false)
        } 
        else{
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata,address])
    
    useEffect(()=>{
        if (Parceldata?.dropAddress) {
            setAddress(Parceldata?.dropAddress && Parceldata?.dropAddress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <div className={`flex max-w-[1530px] mx-auto ${screen.width && screen.width < 1098 ? 'flex-col items-center relative' : 'flex-row ' } h-full`}>
            <div className={` flex flex-col  ${screen.width && screen.width < 1098 ? 'w-full text-center items-center sticky top-0 z-[999] bg-[#fff] gap-[20px]' : 'w-1/2 gap-[40px]'}  px-[40px]  justify-center  text-[50px] font-bold`}>
                <h3  className={`${screen.width && screen.width < 1098 ? 'text-[20px]' : 'text-[50px]'}`}>{i18?.NEW?.WHATSTHEDESTINATIONPOINT || "What’s the destination point"} {" "}
                {i18?.NEW?.FORTHEPARCEL || "for the parcel?"}</h3>
                <div className={" w-full md:w-[500px]"}>
                <Suggestions/>
                </div>
            </div>
            <div className={`${screen.width && screen.width < 1098 ? 'w-full' : 'w-1/2'}`}>
                <MapComponent latlng={latilon} onLocationChange={onLocationChange} screen={screen} />
            </div>
        </div>
    )
}