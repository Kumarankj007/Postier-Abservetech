import { useContext, useEffect, useMemo, useState } from "react";
import TypeStore from "../store/typeStore";
import Button from "./button";
import Input from "./input";
// import Select from "./select";
import PageContext from "../providers/pagecontext";
import { Autocomplete } from "@react-google-maps/api";
import LoaderScript from "./loadingscript";
import { getCurrentLocation } from "@/utils";
import ParcelStore from "../store/parcel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import DropDown from "./dropdown";
import useScreenDetector from "../hooks/useresize";
import RoleStore from "../store/RoleStore";
import Store from "../store/store";
import DatePickerComp from "./datepicker";
import dayjs from "dayjs";
import useStore from "../store/filterStore";
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import AutocompleteComp from "./autocomplete";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// import locationicom from "../../../public/png/loca.png";

interface State {
  pickupLng: string;
  pickupLat: string;
  pickupAddress: string;
  dropLng: string;
  dropLat: string;
  dropAddress: string;
  pickupDate: any;
  radius: string;
}

const data = [
  { text: "5 kms", value: "5" },
  { text: "10 kms", value: "10" },
  { text: "20 kms", value: "20" },
  { text: "30 kms", value: "30" },
  { text: "40 kms", value: "40" },
  { text: "50 kms", value: "50" },
];

export default function SearchBar({ toggle }: any) {
  const router = UseLoadingRouter();
  const searchParams = useSearchParams();
  const screen = useScreenDetector();
  const path = usePathname();
  const { value, setValue } = useStore();
  const params = new URLSearchParams(searchParams);
  const paramsObject: any = Object.fromEntries(searchParams.entries());
  const { i18 } = useContext(PageContext);
  const { Type } = TypeStore();
  const { RoleSwitch } = RoleStore();
  const { token } = Store();
  const [autocompletePickup, setautocompletePickup] = useState<any>(null);
    const { FetchSearchTrip, FetchSearchParcel} = ParcelStore()
  const disabled = useMemo(() => {
    return (path === "/search/" || path === "/") &&
      (value.pickupAddress === "" || value?.dropAddress === "")
      ? true
      : false;
  }, [value,path]);

  // console.log("disabled", value.pickupAddress);
  // const [value, setValue] = useState<State>({
  //     pickupLng: '0',
  //     pickupLat: '0',
  //     pickupAddress: '',
  //     dropLng: '0',
  //     dropLat: '0',
  //     dropAddress: '',
  //     pickupDate: null,
  //     radius: '',
  //     ...paramsObject
  // });
  const [autocompleteDestination, setautocompleteDestination] =
    useState<any>(null);
  // useEffect(()=>{
  //     // change object to query string
  //     const params = new URLSearchParams(value as any);
  //     window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());

  // }, [value])
  const onLoadpickup = (autocomplete: any) => {
    if (autocomplete !== null && autocomplete.getPlace) {
      setautocompletePickup(autocomplete);
    }
  };
  const updateValue = (key: string, newValue: string | number | any) => {
    setValue({ [key]: newValue }, true);
  };
  const handleDateChange = (date: any) => {
    if (date) {
      const data = dayjs(date);
      const dateformat: any = data.format("YYYY-MM-DDTHH:mm:ss.000Z");
      console.log(dateformat, "dayjs")
      setValue({ pickupDate: dateformat });
    }
  };
  const onPlaceChangedpickup = (coordinate: any, data: any) => {
    // console.log("coordinate", coordinate, data);
    if (coordinate !== null && data !== null) {
      const place = data.description;
      const lat = coordinate.lat;
      const lng = coordinate.lng;
      if (lng) {
        updateValue("pickupLng", lng);
      }
      if (lat) {
        updateValue("pickupLat", lat);
      }
      if (place) {
        updateValue("pickupAddress", place);
      }
    } else {
      // console.log("Autocomplete is not loaded yet!");
    }
  };
  const onLoaddestination = (autocomplete: any) => {
    if (autocomplete !== null && autocomplete.getPlace) {
      setautocompleteDestination(autocomplete);
    }
  };
  const onPlaceChangeddestination = (coordinate: any, data: any) => {
    // console.log("coordinate2", coordinate, data);
    if (coordinate !== null && data !== null) {
      const place = data.description;
      const lat = coordinate.lat;
      const lng = coordinate.lng;
      if (lng) {
        updateValue("dropLng", lng);
      }
      if (lat) {
        updateValue("dropLat", lat);
      }
      if (place) {
        updateValue("dropAddress", place);
      }
    } else {
      // console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleSearchParcel = () => {
    const data: any = {};
    if (value.pickupLng !== "0") {
      data.pickupLng = value.pickupLng;
    }
    if (value.pickupLat !== "0") {
      data.pickupLat = value.pickupLat;
    }
    if (value.pickupAddress) {
      data.pickupAddress = value.pickupAddress;
    }
    if (value.dropLng !== "0") {
      data.dropLng = value.dropLng;
    }
    if (value.dropLat !== "0") {
      data.dropLat = value.dropLat;
    }
    if (value.dropAddress) {
      data.dropAddress = value.dropAddress;
    }
    if (value.pickupDate) {
      data.pickupDate =  encodeURIComponent(String(value.pickupDate));
    }
    if (value.radius) {
      data.radius = value.radius;
    }
    console.log(data, "data")
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    if (path === "/search/") {
      window.history.replaceState(
        { path: `?${queryString}` },
        "",
        `?${queryString}`
      );
    } else {
      router.push(`/search/?${queryString}`);
    }
    if (Object?.keys(data).length > 3){
      if (Type === 'deliverparcel') {
                FetchSearchParcel(data)
            } else {
                FetchSearchTrip(data)
            }
    }
  };

  useEffect(() => {
    if (searchParams.get("pickupAddress")) {
      updateValue("pickupAddress", searchParams.get("pickupAddress") || "");
    }
    if (searchParams.get("dropAddress")) {
      updateValue("dropAddress", searchParams.get("dropAddress") || "");
    }
    if (searchParams.get("pickupLng")) {
      updateValue("pickupLng", searchParams.get("pickupLng") || "");
    }
    if (searchParams.get("pickupLat")) {
      updateValue("pickupLat", searchParams.get("pickupLat") || "");
    }
    if (searchParams.get("dropLng")) {
      updateValue("dropLng", searchParams.get("dropLng") || "");
    }
    if (searchParams.get("dropLat")) {
      updateValue("dropLat", searchParams.get("dropLat") || "");
    }
    if (searchParams.get("pickupDate")) {
      updateValue("pickupDate", searchParams.get("pickupDate") || "");
    }
    if (searchParams.get("radius")) {
      updateValue("radius", searchParams.get("radius") || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Condition = useMemo(() => {
    if (token) {
      return RoleSwitch === "user" ? "sendparcel" : "deliverparcel";
    } else {
      return Type;
    }
  }, [RoleSwitch, Type, token]);
  // console.log("paramsObject", disabled);
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col items-center md:flex md:flex-row bg-togglebg md:rounded-full rounded-[18px] gap-7 md:gap-5 shadow px-8 py-4 ">
          <div className="flex flex-col justify-start  gap-2">
            <p className="font-medium flex items-center">
              {(screen === "tablet" || screen === "mobile") && (
                <Image
                  src="/svg/icon/locationG.svg"
                  alt="chatIcon"
                  className="h-8 w-8 mr-2"
                  width={800}
                  height={800}
                />
              )}
              {i18?.HOMEPAGE?.TOGGLEBTN?.PICKUPLOC ||
                "Where do you send parcel from?"}
            </p>
            {/* <LoaderScript>
                        <Autocomplete
                            onLoad={onLoadpickup}
                            onPlaceChanged={onPlaceChangedpickup}
                            options={{
                            }}
                        >
                            <div className="relative">
                                <input
                                    value={value.pickupAddress}
                                    placeholder="Pickup Location"
                                    className="outline-none text-[14px] text-[#000000] placeholder-black w-[90%] ml-[40px] md:ml-0"
                                    onChange={(e) => updateValue('pickupAddress', e.target.value)}
                                />
                                {
                                    value.pickupAddress &&
                                    <div className="absolute inset-y-0 right-0 flex items-center cursor-pointer" onClick={() => {
                                        updateValue('pickupAddress', '')
                                        params.delete('pickupLng')
                                        params.delete('pickupLat')
                                        params.delete('pickupAddress')
                                        window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
                                    }}>
                                        <Image width={20} height={20} src='/svg/icon/close1.svg' alt="img" className="w-[25px] h-[25px]" />
                                    </div>
                                }

                            </div>
                        </Autocomplete>
                    </LoaderScript> */}
            <LoaderScript>
              <AutocompleteComp
                onPlaceChangedpickup={onPlaceChangedpickup}
                type="pickup"
                placeholder={"Address"}
              />
            </LoaderScript>
          </div>
          <hr className="border-l  border-[#999999] h-4/5" />
          <div className="flex flex-col justify-start gap-2">
            <p className="font-medium flex items-center">
              {(screen === "tablet" || screen === "mobile") && (
                <Image
                  src="/svg/icon/locationR.svg"
                  alt="chatIcon"
                  className="h-8 w-8 mr-2"
                  width={800}
                  height={800}
                />
              )}

              {i18?.HOMEPAGE?.TOGGLEBTN?.DELIVERYLOC ||
                "Choose your parcel destination"}
            </p>
            {/* <LoaderScript>
                        <Autocomplete
                            onLoad={onLoaddestination}
                            onPlaceChanged={onPlaceChangeddestination}
                            options={{
                            }}
                        >
                            <div className="relative">
                                <input
                                    value={value.dropAddress}
                                    placeholder="Destination Location"
                                    className="outline-none text-[14px] text-[#000000] placeholder-black w-[90%] ml-[40px] md:ml-0"
                                    onChange={(e) => updateValue('dropAddress', e.target.value)}
                                />
                                {
                                    value.dropAddress &&
                                    <div className="absolute inset-y-0 right-0 flex items-center cursor-pointer"
                                        onClick={() => {
                                            updateValue('dropAddress', '')
                                            params.delete('dropLng')
                                            params.delete('dropLat')
                                            params.delete('dropAddress')
                                            window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
                                        }}
                                    >
                                        <Image width={20} height={20} src='/svg/icon/close1.svg' alt="img" className="w-[25px] h-[25px]" />
                                    </div>
                                }
                            </div>
                        </Autocomplete>
                    </LoaderScript> */}
            <LoaderScript>
              <AutocompleteComp
                onPlaceChangeddestination={onPlaceChangeddestination}
                type="drop"
              />
            </LoaderScript>
          </div>
          {(toggle ? RoleSwitch === "user" : Type === "sendparcel") && (
            <>
              <hr className="border-l border-[#999999] h-4/5" />
              <div className="flex flex-col justify-between gap-2">
                <label
                  htmlFor="pickup-date"
                  className="font-medium flex items-center"
                >
                  <Image
                    src="/svg/icon/Package.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 mr-2"
                    width={800}
                    height={800}
                  />
                  Pickup Date
                </label>

                <div className="relative">
                  <DatePickerComp
                    id="pickup-date"
                    onDate={handleDateChange}
                    searchBar={true}
                    date={value.pickupDate}
                  />

                  {value?.pickupDate && (
                    <button
                      type="button"
                      aria-label="Clear selected date"
                      onClick={() => {
                        updateValue("pickupDate", null);
                        params.delete("pickupDate");
                        window.history.replaceState(
                          { path: params.toString() },
                          "",
                          "?" + params.toString()
                        );
                      }}
                      className="absolute inset-y-0 right-[30px] flex items-center cursor-pointer bg-transparent"
                    >
                      <Image
                        width={20}
                        height={20}
                        src="/svg/icon/close1.svg"
                        alt=""
                        aria-hidden="true"
                        className="w-[25px] h-[25px]"
                      />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          {(toggle ? RoleSwitch === "postier" : Type === "deliverparcel") && (
            <>
              <hr className="border-l border-[#999999] h-4/5" />
              <div className="flex flex-col justify-between gap-2">
                <p className="font-medium flex items-center">
                  {(screen === "tablet" || screen === "mobile") && (
                    <Image
                      src="/svg/icon/Package.svg"
                      alt="chatIcon"
                      className="h-8 w-8 mr-2"
                      width={800}
                      height={800}
                    />
                  )}
                  {i18?.HOMEPAGE?.TOGGLEBTN?.RADIUS || "Search Radius"}
                </p>
                <div className="relative">
                  <DropDown
                    text={value.radius || "Select"}
                    img2="/svg/icon/dropdown2.svg"
                    className="flex gap-2 items-center justify-between text-[14px] text-[#000] ml-[40px] md:ml-0 w-full"
                    Width="300px"
                    data={data.map((item: any) => ({
                      text: item?.text,
                      fnc: () => setValue({ radius: item?.value }),
                    }))}
                  />
                  {value?.radius && (
                    <div
                      className="absolute inset-y-0 right-[30px] flex items-center cursor-pointer"
                      onClick={() => {
                        updateValue("radius", null);
                        params.delete("radius");
                        window.history.replaceState(
                          { path: params.toString() },
                          "",
                          "?" + params.toString()
                        );
                      }}
                    >
                      <Image
                        width={20}
                        height={20}
                        src="/svg/icon/close1.svg"
                        alt="img"
                        className="w-[25px] h-[25px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* {
                    Type === 'deliverparcel' &&
                    <>
                        <hr className="border-l border-[#999999] h-full" />
                        <div className="flex flex-col justify-start gap-2">
                            <p className="font-medium">
                                {i18?.HOMEPAGE?.TOGGLEBTN?.RADIUS || "Search Radius"}
                            </p>
                            <select className="outline-none flex justify-start bg-transparent text-[14px] text-[#000000] w-[70%]">
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>
                    </>
                } */}
          <div className="flex items-center">
            {Type === "deliverparcel" ? (
              <Button
                disabled={disabled}
                className={`${
                  disabled && "opacity-25"
                } bg-btncolor border px-8 py-4 text-[#fff] rounded-[10px] md:rounded-full w-[100%] md:w-[100%]`}
                onClick={handleSearchParcel}
              >
                {/* <Image width={25} height={25} src="/svg/icon/searchwhite.svg" alt="" /> */}
                {i18?.HOMEPAGE?.TOGGLEBTN?.TOGGLE2 || "Search Parcel"}
              </Button>
            ) : (
              <Button
                disabled={disabled}
                className={`${
                  disabled && "opacity-25 cursor-not-allowed"
                } bg-btncolor border px-8 py-4 text-[#fff] rounded-[10px] md:rounded-full w-[100%] md:w-[100%]`}
                onClick={handleSearchParcel}
              >
                {i18?.HOMEPAGE?.TOGGLEBTN?.TOGGLE1 || "Search Postier"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* <pre className="w-full overflow-auto">{JSON.stringify(value)}</pre> */}
    </>
  );
}
