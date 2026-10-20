
import Suggestion from "@/app/store/suggestion";
import { Autocomplete, AutocompleteProps } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoComplete from "./autocomplete";
import LoaderScript from "./LoaderScript";


export default function Suggestions({ type, stoppoint, handleStopPoint }) {
    // const { GetSuggestion, SuggestionData } = Suggestion()
    const { setPacelData } = StoreParcel()
    // const [mergedSuggestions, setMergedSuggestions] = useState < string[] > ([]);
    const [address, setAddress] = useState('')
    const [autocomplete, setAutocomplete] = useState < any > (null);
    const [prediction, setPrediction] = useState < any > ([]);


    const mergedSuggestions = useMemo(() => {
        const value = SuggestionData.map((item) => ({
            primaryAddress: item.primaryAddress,
            secondaryAddress: item.secondaryAddress,
            latLng: item.coordinates,
            place_id: item.place_id,
            city: item.city
        }));
        if (!address) {
            return value
        }
        return [...value, ...prediction]
    }, [SuggestionData, prediction, address]);



    useEffect(() => {
        const mergeData = async () => {
            if (prediction && prediction.length) {
                const googleSuggestionsList = await fetchGooglePrediction();
                setMergedSuggestions(googleSuggestionsList);
            }
        };

        apiSuggestions();
        mergeData();
    }, [apiSuggestions, prediction]);


    useEffect(() => {
        if (address.length > 2) {
            GetSuggestion(address)
        } else {
            GetSuggestion()
        }
    }, [address])

    const fetchGoogleSuggestions = (query) => {

        const service = new window.google.maps.places.AutocompleteService();
        if (query && query.trim()) {
            if (type === 'pickup') {
                setPacelData('pickup', query)
            }
            else if (type === 'stoppoint') {
                null
            }
            else {
                setPacelData('drop', query)
            }
            service.getPlacePredictions({ input: query }, async (predictions) => {
                if (predictions) {
                    const mappedPrediction = await Promise.all(predictions.map(async (item) => ({
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
    const handleState = (value) => {
        setAddress(value)
    }
    console.log('mergedSuggestions', mergedSuggestions)
    return (
        <>
            <LoaderScript>
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
            </LoaderScript>
        </>
    )
}