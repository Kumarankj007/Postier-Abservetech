import DropDown from "@/app/component/dropdown";
import LabeledInput from "@/app/component/input";
import LoaderScript from "@/app/component/loadingscript";
import Suggestion from "@/app/store/suggestion";
import { Autocomplete, AutocompleteProps } from "@react-google-maps/api";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoComplete from "./autocomplete";
import Width from "./parcel/width";
import StoreParcel from "@/app/store/store-parcel";


export default function Suggestions({ type, stoppoint,handleStopPoint }: any) {
    const { GetSuggestion, SuggestionData } = Suggestion()
    const { setPacelData } = StoreParcel()
    // const [mergedSuggestions, setMergedSuggestions] = useState<string[]>([]);
    const [address, setAddress] = useState('')
    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [prediction, setPrediction] = useState<any>([]);
    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(window.google.maps.places.AutocompleteService);
    };


    const mergedSuggestions = useMemo(() => {
        const value: any = SuggestionData?.map((item: any) => ({
            primaryAddress: item?.primaryAddress,
            secondaryAddress: item?.secondaryAddress,
            latLng: item?.coordinates,
            place_id: item?.place_id,
            city: item?.city
        }));
        if (!address) {
            return value
        }
        return [...value, ...prediction]
    }, [SuggestionData, prediction, address]);



    //   useEffect(() => {
    //     const mergeData = async () => {
    //       if (prediction && prediction.length) {
    //         const googleSuggestionsList = await fetchGooglePrediction();
    //         setMergedSuggestions(googleSuggestionsList);
    //       }
    //     };

    //     apiSuggestions();
    //     mergeData();
    //   }, [apiSuggestions, prediction]);


    useEffect(() => {
        if (address.length > 2) {
            GetSuggestion(address)
        } else {
            GetSuggestion()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    const fetchGoogleSuggestions = (query: string) => {
        
        const service = new window.google.maps.places.AutocompleteService();
        if (query && query.trim()) {
            if(type === 'pickup'){
                setPacelData('pickup',query)
            }
            else if(type === 'stoppoint'){
               null
            }
            else{
                setPacelData('drop',query)
            }
            service.getPlacePredictions({ input: query }, async (predictions: google.maps.places.AutocompletePrediction[] | null) => {
                if (predictions) {
                    const mappedPrediction = await Promise.all(predictions.map(async (item: any) => ({
                        primaryAddress: item?.structured_formatting?.main_text,
                        secondaryAddress: item?.structured_formatting?.secondary_text,
                        latLng: item.place_id,
                        place_id: item.place_id
                    })))

                    setPrediction(mappedPrediction)
                } else {
                    setPrediction([])
                }

            });
        } else {
            setPrediction([])
        }
    };
    const handleState = (value: any) => {
        setAddress(value)
    }
    // console.log('mergedSuggestions', mergedSuggestions)
    return (
        <>
            {/* <LoaderScript> */}
                <AutoComplete
                    stoppoint={stoppoint}
                    handleStopPoint={handleStopPoint}
                    fetchGoogleSuggestions={fetchGoogleSuggestions}
                    handleState={handleState}
                    address={address}
                    mergedSuggestions={mergedSuggestions}
                    type={type}
                    sx={{ Width: '100%' }}
                />
            {/* </LoaderScript> */}
        </>
    )
}