import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { Suggestions } from "@/app/tools/mutatefn/Parcelpost";
import { fetchAddress } from "@/utils";
import { Autocomplete } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useState } from "react";
import PageContext from "@/app/providers/pagecontext";

export default function AutoComplete(props: any) {
  const { i18 } = useContext(PageContext);
  const {
    address,
    fetchGoogleSuggestions,
    handleState,
    mergedSuggestions,
    type,
    stoppoint,
    handleStopPoint,
  } = props;
  const { setPacelData, Parceldata } = StoreParcel();
  const [selectedAddress, setselectedAddress] = useState("");
  const value: any = selectedAddress ? selectedAddress : {};
  // console.log("selectedAddress", value);
  const Post = useMutation({
    mutationFn: Suggestions,
  });
  const handleAddressChange = async (e: any, data: any) => {
    const value: any = {};
    if (data?.primaryAddress) {
      value.primaryAddress = data?.primaryAddress;
    }
    if (data?.secondaryAddress) {
      value.secondaryAddress = data?.secondaryAddress;
    }
    if (data?.place_id) {
      value.place_id = data?.place_id;
    }
    // if (typeof data?.latLng === 'string') {
    //     const coordinate = await fetchAddress(data?.latLng);
    //     if (coordinate?.City) {
    //         value.City = coordinate?.City
    //     }
    //     if (coordinate?.lat) {
    //         value.lat = coordinate?.lat
    //     }
    //     if (coordinate?.lng) {
    //         value.lng = coordinate?.lng
    //     }
    // }

    if (data) setselectedAddress(data);
    if (type === "pickup") {
      setPacelData("pickupAddress", data);
    } else if (type === "stoppoint") {
      null;
    } else {
      setPacelData("dropAddress", data);
    }

    if (typeof data?.latLng === "string") {
      const coordinate = await fetchAddress(data?.latLng);
      value.lat = coordinate?.lat;
      value.lng = coordinate?.lng;
      value.city = coordinate?.City;
      if (type === "pickup") {
        setPacelData("pickupLat", coordinate?.lat);
        setPacelData("pickupLng", coordinate?.lng);
        setPacelData("pickUpCity", coordinate?.City);
      } else if (type === "stoppoint") {
        handleStopPoint(value);
      } else {
        setPacelData("dropLat", coordinate?.lat);
        setPacelData("dropLng", coordinate?.lng);
        setPacelData("dropCity", coordinate?.City);
      }
    } else {
      value.lat = data?.latLng[1];
      value.lng = data?.latLng[0];
      value.city = data?.city;
      if (type === "pickup") {
        setPacelData("pickupLat", data?.latLng[1]);
        setPacelData("pickupLng", data?.latLng[0]);
        setPacelData("pickUpCity", data?.city);
      } else if (type === "stoppoint") {
        handleStopPoint(value);
      } else {
        setPacelData("dropLat", data?.latLng[1]);
        setPacelData("dropLng", data?.latLng[0]);
        setPacelData("dropCity", data?.city);
      }
    }
    Post.mutateAsync(value);
  };
  const valueSelected = !stoppoint
    ? Parceldata?.pickupAddress || Parceldata?.dropAddress
      ? type
        ? Parceldata?.pickupAddress
        : Parceldata?.dropAddress || null
      : null
    : null;

  return (
    <Autocomplete
      id="country-select-demo"
      options={mergedSuggestions}
      autoComplete
      filterSelectedOptions
      onInputChange={(event, newInputValue) => {
        fetchGoogleSuggestions(newInputValue);
        handleState(newInputValue);
      }}
      inputValue={address || ""}
      onChange={(e, data) => handleAddressChange(e, data)}
      noOptionsText={""}
      isOptionEqualToValue={(option, value) => {
        // console.log("value1", value);
        if (value?.pickupAddress || value?.dropAddress) {
          return option.place_id === type
            ? value?.pickupAddress?.place_id
            : value?.dropAddress?.place_id;
        } else {
          return option.place_id === value?.place_id;
        }
      }}
      value={valueSelected}
      getOptionLabel={(option: any) => option.primaryAddress || ""}
      renderOption={(props, option) => {
        return (
          <li {...props} className="w-full">
            <div
              key={option.latlng}
              className="bg-[#fff] gap-2 px-[30px] py-5  border-b cursor-pointer"
            >
              <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                  {Array.isArray(option.latLng) ? (
                    <Image
                      className="w-[25px] h-[25px]"
                      width={800}
                      height={800}
                      src="/svg/icon/clockblack.svg"
                      alt="svg"
                    />
                  ) : null}
                  <div>
                    <p className="font-bold text-[17px] leading-[20px] mb-[10px]">
                      {option.primaryAddress}
                    </p>
                    <p className="font-medium text-[16px] leading-[20px]">
                      {option.secondaryAddress}
                    </p>
                  </div>
                </div>
                <Image
                  width={10}
                  height={10}
                  src="/svg/icon/rightarrow.svg"
                  alt="svg"
                />
              </div>
            </div>
          </li>
        );
      }}
      renderInput={(params) => (
        <LabeledInput
          {...params}
          id={params.id}
          labelId={params.id}
          placeholder={i18?.NEW?.ENTER_FULL_ADDRESS || "Enter full address"}
          autoFocus
          // value={address} onChange={(e) => {
          //     fetchGoogleSuggestions(e.target.value)
          //     handleState(e.target.value)
          // }}
        />
      )}
    />
  );
}
