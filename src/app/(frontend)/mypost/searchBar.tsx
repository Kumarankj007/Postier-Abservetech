import { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
// import Select from "./select";
import { Autocomplete } from "@react-google-maps/api";
import { getCurrentLocation } from "@/utils";
import { useSearchParams } from 'next/navigation'
import Image from "next/image";
import useScreenDetector from "@/app/hooks/useresize";
import PageContext from "@/app/providers/pagecontext";
import TypeStore from "@/app/store/typeStore";
import LoaderScript from "@/app/component/loadingscript";
import DropDown from "@/app/component/dropdown";
import Button from "@/app/component/button";
import AutocompleteComp from "@/app/component/autocomplete";
import useStore from "@/app/store/filterStore";
// import locationicom from "../../../public/png/loca.png";

interface State {
    pickupLng: string;
    pickupLat: string;
    pickupAddress: string;
    dropLng: string;
    dropLat: string;
    dropAddress: string;
}


const data = [{ text: 'Instant Delivery', desc: 'Same day delivery' },
{ text: 'Just-In Delivery', desc: 'Same day delivery' },
{ text: 'Standard Delivery', desc: 'Same day delivery' }]

export default function SearchBar({ Params }: any) {
    const searchParams = useSearchParams()
    const screen = useScreenDetector();
    const params = new URLSearchParams(searchParams)
    const { i18 } = useContext(PageContext);
    const { Type } = TypeStore()
    const [autocompletePickup, setautocompletePickup] = useState<any>(null)
    const [Index, setIndex] = useState<any>(null)
    const { value, setValue } = useStore();
    // const [value, setValue] = useState<State>({
    //     pickupLng: '0',
    //     pickupLat: '0',
    //     pickupAddress: '',
    //     dropLng: '0',
    //     dropLat: '0',
    //     dropAddress: ''
    // });
    const disabled = useMemo(() => {
        return Params  ? (Params === null ? false : true) : (value.pickupAddress === '' || value?.dropAddress === '') ? true : false
    }, [value.pickupAddress, value?.dropAddress,Params])

    const [autocompleteDestination, setautocompleteDestination] = useState<any>(null)
    const onLoadpickup = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocompletePickup(autocomplete)
        }
    }
    const updateValue = (key: string, newValue: string | number | any) => {
        setValue({ [key]: newValue },true);
    };
    const onPlaceChangedpickup = (coordinate: any, data: any) => {
        if (coordinate !== null && data !== null) {
            const place = data.description
            const lat = coordinate.lat
            const lng = coordinate.lng
            if (lng) {
                updateValue('pickupLng', lng);
            }
            if (lat) {
                updateValue('pickupLat', lat);
            }
            if (place) {
                updateValue('pickupAddress', place);
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const onLoaddestination = (autocomplete: any) => {
        if (autocomplete !== null && autocomplete.getPlace) {
            setautocompleteDestination(autocomplete)
        }
    }
    const onPlaceChangeddestination = (coordinate: any, data: any) => {
        if (coordinate !== null && data !== null) {
            const place = data.description
            const lat = coordinate.lat
            const lng = coordinate.lng
            if (lng) {
                updateValue('dropLng', lng);
            }
            if (lat) {
                updateValue('dropLat', lat);
            }
            if (place) {
                updateValue('dropAddress', place);
            }
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }
    const handleSearchParcel = () => {
        const data: any = {}
        if (value.pickupLng !== '0') {
            data.pickupLng = value.pickupLng
        }
        if (value.pickupLat !== '0') {
            data.pickupLat = value.pickupLat
        }
        if (value.pickupAddress) {
            data.pickupAddress = value.pickupAddress
        }
        if (value.dropLng !== '0') {
            data.dropLng = value.dropLng
        }
        if (value.dropLat !== '0') {
            data.dropLat = value.dropLat
        }
        if (value.dropAddress) {
            data.dropAddress = value.dropAddress
        }
        const queryString = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
        window.history.replaceState({ path: '/mypost/?' + queryString }, '', '/mypost/?' + queryString);
    }

    useEffect(() => {
        if (searchParams.get('pickupAddress')) {
            updateValue('pickupAddress', searchParams.get('pickupAddress') || '')
        }
        if (searchParams.get('dropAddress')) {
            updateValue('dropAddress', searchParams.get('dropAddress') || '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, Type])
    // console.log('Params', Params)
    return (
        <div className="flex  justify-center w-full">
            <div className="flex flex-col md:flex md:flex-row bg-togglebg md:rounded-[31px] rounded-[18px] gap-7 md:gap-5 shadow px-8 py-4 ">
                <div className="flex flex-col justify-start  gap-2">


                    <p className="font-medium flex items-center">
                        {
                            (screen === 'tablet' || screen === 'mobile') &&
                            <Image src='/svg/icon/locationG.svg' alt="chatIcon" className="h-8 w-8 mr-2" width={800} height={800} />
                        }
                        {i18?.NEW?.ENTERPICKUP || "Enter Your Pick-up Point"}
                    </p>
                    {
                        Params?.pickupAddress === undefined ?
                            <LoaderScript>
                                {/* <Autocomplete
                                    onLoad={onLoadpickup}
                                    onPlaceChanged={onPlaceChangedpickup}
                                    options={{
                                    }}
                                >
                                    <div className="relative">
                                        <input
                                            readOnly={Params === null ? false : true}
                                            value={value.pickupAddress}
                                            placeholder={i18?.NEW?.LOCATION || 'Location'}
                                            className="outline-none text-[14px] text-[#000000] placeholder-black w-[90%] ml-[40px] md:ml-0 w-[200px] truncate"  
                                            onChange={(e) => updateValue('pickupAddress', e.target.value)}
                                        />
                                        {
                                            (value.pickupAddress && Params === null) &&
                                            <div className="absolute inset-y-0 right-[-10px] flex items-center cursor-pointer" onClick={() => {
                                                params.delete('pickupLng')
                                                params.delete('pickupLat')
                                                params.delete('pickupAddress')
                                                updateValue('pickupAddress', '')
                                                window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
                                            }}>
                                                <Image width={20} height={20} src='/svg/icon/close1.svg' alt="img" className="w-[25px] h-[25px]" />
                                            </div>
                                        }

                                    </div>
                                </Autocomplete> */}
                                <AutocompleteComp onPlaceChangedpickup={onPlaceChangedpickup} type='pickup' />
                            </LoaderScript>
                            :
                            <p>{value.pickupAddress}</p>
                    }


                </div>
                <hr className="border-l  border-[#999999] h-full" />
                <div className="flex flex-col justify-start gap-2">
                    <p className="font-medium flex items-center">
                        {
                            (screen === 'tablet' || screen === 'mobile') && <Image src='/svg/icon/locationR.svg' alt="chatIcon" className="h-8 w-8 mr-2" width={800} height={800} />
                        }

                        {i18?.NEW?.ENTERDROP || "Enter Your Drop-Off Point"}
                    </p>
                    {
                        Params?.dropAddress === undefined ?
                            <LoaderScript>
                                {/* <Autocomplete
                                    onLoad={onLoaddestination}
                                    onPlaceChanged={onPlaceChangeddestination}
                                    options={{
                                    }}
                                >
                                    <div className="relative">
                                        <input
                                            readOnly={Params === null ? false : true}
                                            value={value.dropAddress}
                                            placeholder={i18?.NEW?.LOCATION || 'Location'}
                                            className="outline-none text-[14px] text-[#000000] placeholder-black w-[90%] ml-[40px] md:ml-0  w-[200px] truncate"
                                            onChange={(e) => updateValue('dropAddress', e.target.value)}
                                        />
                                        {
                                            (value.dropAddress && Params === null) &&
                                            <div className="absolute inset-y-0 right-[-10px] flex items-center cursor-pointer"
                                                onClick={() => {
                                                    params.delete('dropLng')
                                                    params.delete('dropLat')
                                                    params.delete('dropAddress')
                                                    updateValue('dropAddress', '')
                                                    window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
                                                }}
                                            >
                                                <Image width={20} height={20} src='/svg/icon/close1.svg' alt="img" className="w-[25px] h-[25px]" />
                                            </div>
                                        }
                                    </div>
                                </Autocomplete> */}
                                <AutocompleteComp onPlaceChangeddestination={onPlaceChangeddestination} type='drop' />
                            </LoaderScript>
                            :
                            <p>{value.dropAddress}</p>
                    }



                </div>

                <div className="flex items-center">
                    <Button disabled={disabled} className={`${disabled && 'opacity-25'} bg-btncolor border px-8 py-4 text-[#fff] rounded-[10px] md:rounded-full w-[100%] md:w-[100%]`} onClick={handleSearchParcel}>
                        {i18?.HOMEPAGE?.TOGGLEBTN?.SEND || "Send"}
                    </Button>
                </div>
            </div>
        </div>
    )
}