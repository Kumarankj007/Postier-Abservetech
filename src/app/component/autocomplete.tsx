import { Autocomplete } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import LabeledInput from "./input";
import { fetchAddress } from "@/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import PageContext from "../providers/pagecontext";
import useStore from "../store/filterStore";

function AutocompleteComp({
  onPlaceChangedpickup,
  type,
  onPlaceChangeddestination,
  placeholder = "",
  onClose = () => {},
  resetTrigger,
}: any) {
  const { i18 } = useContext(PageContext);
  const searchparams = useSearchParams();
  const { value, setValue } = useStore();

  const pickup = searchparams.get("pickupAddress");
  const drop = searchparams.get("dropAddress");

  const [prediction, setPrediction] = useState<any>([]);
  const [address, setAddress] = useState<any>({
    pickup: pickup || "",
    drop: drop || "",
  });

  const updateValue = (key: string, newValue: string | number | any) => {
    setValue({ [key]: newValue }, true);
  };

  const fetchGoogleSuggestions = (query: string) => {
    const service = new window.google.maps.places.AutocompleteService();
    if (query && query.trim()) {
      service.getPlacePredictions({ input: query }, (predictions) => {
        setPrediction(predictions || []);
      });
    } else {
      setPrediction([]);
    }
  };

  const handleAddressChange = async (e: any, data: any) => {
    const coordinate = await fetchAddress(data?.place_id);
    console.log(data, "data")
    if (type === "pickup") {
      onPlaceChangedpickup(coordinate, data);
    } else {
      onPlaceChangeddestination(coordinate, data);
    }
  };

  const handleClose = () => {
    console.log("handleClose called");
    onClose();
    const params = new URLSearchParams(searchparams.toString());

    if (type === "pickup") {
      params.delete("pickupLng");
      params.delete("pickupLat");
      params.delete("pickupAddress");
      updateValue("pickupLng", 0);
      updateValue("pickupLat", 0);
      updateValue("pickupAddress", "");
      setAddress({ pickup: "" });
    } else {
      params.delete("dropLng");
      params.delete("dropLat");
      params.delete("dropAddress");
      updateValue("dropLng", 0);
      updateValue("dropLat", 0);
      updateValue("dropAddress", "");
      setAddress({ drop: "" });
    }

    window.history.replaceState(
      { path: params.toString() },
      "",
      "?" + params.toString()
    );
  };

  useEffect(() => {
    setAddress({
      pickup: pickup || value?.pickupAddress,
      drop: drop || value?.dropAddress,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  setAddress({
    pickup: "",
    drop: "",
  });

  setPrediction([]);
}, [resetTrigger]);

  const labelText =
    type === "pickup"
      ? i18?.NEW?.PICKUPADDRESS || "Pickup address"
      : i18?.NEW?.DROPADDRESS || "Drop address";

  const currentValue = type === "pickup" ? address.pickup : address.drop;

  return (
    <Autocomplete
      id={`${type}-autocomplete`}
      options={prediction}
      autoComplete
      disableClearable
      forcePopupIcon={false}
      filterSelectedOptions
      onInputChange={(event, newInputValue) => {
        if (event !== null && event.type !== "blur") {
          fetchGoogleSuggestions(newInputValue);
          setAddress((prev: any) => ({
            ...prev,
            [type]: newInputValue,
          }));
        }
      }}
      inputValue={currentValue}
      onChange={(e, data) => handleAddressChange(e, data)}
      noOptionsText=""
      getOptionLabel={(option: any) => option.description || ""}
      renderOption={(props, option) => (
        <li {...props} className="w-full">
          <div
            key={option.place_id}
            className="bg-[#fff] gap-2 px-[30px] py-5 border-b cursor-pointer"
          >
            <div className="flex justify-between">
              <div className="flex gap-4 items-center justify-between w-full">
                <p className="text-[16px] truncate max-w-[170px]">
                  {option?.description}
                </p>
                <Image
                  width={10}
                  height={10}
                  src="/svg/icon/rightarrow.svg"
                  alt="arrow"
                />
              </div>
            </div>
          </div>
        </li>
      )}
      renderInput={(params) => {
        return (
          <div className="flex items-center w-full">
            <LabeledInput
              {...params}
              id={params.id}
              // label={labelText}
              labelId={params.id}
              aria-labelledby={params.id}
              placeholder={placeholder != "" ? placeholder : labelText}
              autoFocus
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
              className="outline-none text-[12px]"
            />
            {currentValue !== "" && (
              <Image
                src="/svg/icon/close1.svg"
                alt="Clear address input"
                width={20}
                height={20}
                className="w-[20px] h-[20px] ml-2 cursor-pointer"
                onClick={handleClose}
              />
            )}
          </div>
        );
      }}
    />
  );
}

export default AutocompleteComp;
