"use client";
import { useContext, useEffect, useRef, useState } from "react";
import AutocompleteComp from "@/app/component/autocomplete";
import Button from "@/app/component/button";
import Cardblue from "@/app/component/cardblue";
import LoaderScript from "@/app/component/loadingscript";
import PopoverComponent from "@/app/component/popover";
import Image from "next/image";
import { FetchDynamicCalc } from "@/app/tools/queryfn/fetch";
import { useMutation } from "@tanstack/react-query";
import useSnackbarStore from "@/app/store/toaster";
import Store from "@/app/store/store";
import FormulaCard from "@/app/component/formulaCard";
import PageContext from "@/app/providers/pagecontext";

// fonts
const fonts: Record<string, string> = {
  titleStyle:
    "font-bold text-[21px] sm:text-[30px] lg:text-[45px] xl:text-[55px] text-[#004080] ",
  price:
    "font-bold text-[20px] sm:text-[27px] md:text-[35px] lg:text-[45px] text-[#F7941D] ",
  pNormal: "text-[16px] sm:text-[18px] md:text-[20px] font-normal ",
  pBold: "text-[16px] sm:text-[18px] md:text-[20px] font-semibold ",
  whiteBtn:
    "text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-black ",
  inpFont: "text-[12px] md:text-[14px] font-normal ",
  smFont: "text-[9px] md:text-[12px] font-medium ",
  tabFont: "md:text-[17px] text-[15px] ",
};

// Define reusable error message shape
type FieldError = {
  required: string;
  invalid?: string;
};

// Define the full error message type
type ErrorMessages = {
  pickup: FieldError;
  destination: FieldError;
  weight: FieldError;
  dimension: FieldError;
  avgPrice: FieldError;
  urgency: FieldError;
  delType: FieldError;
};

// input component for scale
const ScaleInput = ({
  min = 0.5,
  max = 1000,
  step = 0.5,
  scales = "weight",
  placeholder = "0.5",
  scale = {},
  setScale = () => {},
  setErr = () => {},
  errMsg = {},
}: {
  min: number;
  max: number;
  step: number;
  scales: string;
  placeholder?: string;
  setErr: (pre: any) => void;
  scale: any;
  setScale: (pre: any) => void;
  errMsg: any;
}) => {
  const onChange = (e: any) => {
    setScale((prev: any) => {
      if (e.target.value >= 0)
        return {
          ...prev,
          [scales]: max >= e.target.value ? e.target.value : prev[scales],
        };
      return { ...prev, [scales]: null };
    });
    const validate = false;
    const limitValid = e?.target?.value >= min && e?.target?.value <= max;
    setErr((pre: any) => ({
      ...pre,
      weight:
        scales === "weight"
          ? validate
            ? errMsg?.weight?.required
            : !limitValid
            ? errMsg?.weight?.invalid
            : ""
          : pre.weight,

      dimension:
        scales === "length" || scales === "width" || scales === "height"
          ? validate
            ? errMsg?.dimension?.required
            : !limitValid
            ? errMsg?.dimension?.invalid
            : ""
          : pre.dimension,

      avgPrice:
        scales === "avgPrice"
          ? validate
            ? errMsg?.avgPrice?.required
            : !limitValid
            ? errMsg?.avgPrice?.invalid
            : ""
          : pre.avgPrice,
    }));
  };
  const handleArrow = (direction: string) => {
    const validate = scale[scales] == "0" || scale[scales] == "0.0";
    setErr((pre: any) => ({
      ...pre,
      weight:
        scales == "weight"
          ? validate
            ? "Invalid or fill the weight"
            : ""
          : pre.weight,
      dimension:
        scales == "length" || scales == "width" || scales == "height"
          ? validate
            ? "Invalid or fill the length, width and height"
            : ""
          : pre.dimension,
      avgPrice:
        scales == "avgPrice"
          ? validate
            ? "Invalid or fill the Average Price"
            : ""
          : pre.avgPrice,
    }));
    setScale((pre: any) => {
      const prevVal = Number(pre[scales]);
      let current = isNaN(prevVal) ? min - step : prevVal;
      const val = current + (direction === "up" ? step : -step);
      return {
        ...pre,
        [scales]:
          isNaN(val) || val == null
            ? min
            : direction === "up"
            ? Math.min(max, Number(val?.toFixed(2)))
            : Math.max(min, Number(val?.toFixed(2))),
      };
    });
    // setScale((pre: any) => {
    //   const prevVal = Number(pre[scales]);
    //   let current = isNaN(prevVal) ? min - step : prevVal;

    //   const val = current + (direction === "up" ? step : -step);

    //   const next =
    //     isNaN(val) || val == null
    //       ? min
    //       : direction === "up"
    //       ? Math.min(max, Number(val.toFixed(2)))
    //       : Math.max(min, Number(val.toFixed(2)));

    //   return { ...pre, [scales]: next };
    // });
  };
  return (
    <div className="flex items-center border min-w-[70px] border-black rounded-lg box-border overflow-hidden focus-within:border-[#004080]">
      {scales == "avgPrice" && (
        <>
          <Button
            className={
              (scale["avgPrice"] == "0.06" || scale["avgPrice"] == null
                ? "opacity-55"
                : " ") + " bg-[#004080] self-stretch flex items-center"
            }
            onClick={() => handleArrow("down")}
          >
            <span className={"text-5xl text-white px-5"}>-</span>
          </Button>
          <b className={fonts.price + " ml-3"}>€</b>
        </>
      )}
      <input
        type="number"
        min={min}
        aria-label={"scale-" + scales}
        max={max}
        placeholder={placeholder}
        step={step}
        className={
          (scales != "avgPrice" ? fonts.inpFont : fonts.price) +
          " focus:outline-0 rounded-lg p-2 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        }
        value={scale[scales] || ""}
        inputMode="numeric"
        onChange={onChange}
      />
      {/* up and down arrows */}
      {scales != "avgPrice" && (
        <div className="px-1">
          <div
            className="active:opacity-55 w-2 h-2 bg-contain bg-center bg-no-repeat mb-2 "
            style={{
              backgroundImage: "url('/svg/icon/tri_btn.svg')",
            }}
            onClick={() => handleArrow("up")}
          ></div>
          <div
            className="active:opacity-55 w-2 h-2 bg-contain bg-center bg-no-repeat rotate-180"
            style={{
              backgroundImage: "url('/svg/icon/tri_btn.svg')",
            }}
            onClick={() => handleArrow("down")}
          ></div>
        </div>
      )}
      <Button
        className="bg-[#004080] self-stretch flex items-center"
        onClick={() => scales == "avgPrice" && handleArrow("up")}
      >
        <span
          className={
            (scales != "avgPrice"
              ? fonts.pBold + " px-2"
              : "text-5xl" + " px-5") + "  text-white "
          }
        >
          {scales != "avgPrice" ? (scales == "weight" ? "kg" : "cm") : "+"}
        </span>
      </Button>
    </div>
  );
};

export default function DynamicCalculation() {
  const { i18 } = useContext(PageContext);
  // console.log(PageContext, 'PageContext')
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  const dynamic_Calculation = i18?.DYNAMIC_CALCULATION;
  // static block content
  const datas = {
    block1: {
      title: "Calculate actual weight and volumetric weight easily.",
      p: [
        "Volumetric Weight (kg) = (Length × Width × Height) ÷ 5000",
        "We always use the higher of actual weight and volumetric weight.",
      ],
      btn: "Calculate Now",
      img: "/svg/parcel 1.svg",
    },
    block2: {
      title:
        dynamic_Calculation?.DYNAMIC_BLK2_TITLE ||
        "Example For Dynamic Calculation",
    },
    block3: {
      title:
        dynamic_Calculation?.DYNAMIC_BLK3_TITLE || "What is volumetric weight?",
      p:
        dynamic_Calculation?.DYNAMIC_BLK3_DESC ||
        "Volumetric weight or dimensional weight is a weight-measurement technique used in eCommerce logistics in which the weight of a package is calculated as the product of its length, breadth & height divided by a courier-specific constant. Your courier partner charges you based on the higher weight of the package out of the true weight & the dimensional weight.",
      img: "/png/weight_measure.png",
    },
  };
  // Limits values for scale inputs
  const defaultVal = {
    weight: { min: 0.5, max: 1000, step: 0.5 },
    length: { min: 0.5, max: 1000, step: 0.5 },
    width: { min: 0.5, max: 1000, step: 0.5 },
    height: { min: 0.5, max: 1000, step: 0.5 },
    avgPrice: { min: 0.06, max: 1000, step: 0.01 },
    urgency: [
      {
        type: delivery_Cancellation?.STANDARD || "Standard or Schedule",
        img: "/svg/urg02.svg",
        key: "standard",
      },
      {
        type: delivery_Cancellation?.EXPRESS || "Express",
        img: "/svg/urg03.svg",
        key: "express",
      },
      {
        type: delivery_Cancellation?.SAME_DAY || "Same-Day",
        img: "/svg/urg04.svg",
        key: "sameDay",
      },
    ],
    delType: [
      {
        type: delivery_Cancellation?.STANDARD_PARCEL || "Standard Parcel",
        img: "/svg/delType02.svg",
        key: "standard",
      },
      {
        type: delivery_Cancellation?.FRAGILE_ITEMS || "Fragile Items",
        img: "/svg/delType03.svg",
        key: "fragile",
      },
      {
        type: delivery_Cancellation?.OVERSIZED_PACKAGES || "Oversized Packages",
        img: "/svg/delType02.svg",
        key: "oversized",
      },
      {
        type:
          delivery_Cancellation?.TEMPERATURE_SENSITIVE ||
          "Temperature Sensitive Goods",
        img: "/svg/delType04.svg",
        key: "temperatureSensitive",
      },
    ],
  };

  const initialValid = useRef(0);
  const { setModal } = Store();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [location, setLocation] = useState({
    pickup: {
      lat: null,
      lng: null,
      place: "",
    },
    destination: {
      lat: null,
      lng: null,
      place: "",
    },
  });

  const [resetTrigger, setResetTrigger] = useState(0);

  const [scale, setScale] = useState<any>({
    weight: null,
    length: null,
    width: null,
    height: null,
    avgPrice: undefined,
  });

  const [urgency, setUrgency] = useState<any>({});
  const [delType, setDelType] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [validate, setValidate] = useState<boolean>(false);
  const [err, setErr] = useState({
    pickup: "",
    destination: "",
    weight: "",
    dimension: "",
    avgPrice: "",
    urgency: "",
    delType: "",
  });
  const open = Boolean(anchorEl);

  const errMsg: ErrorMessages = {
    pickup: { required: "Invalid or fill the pickup address" },
    destination: { required: "Invalid or fill the dropoff address" },
    weight: {
      required: "Invalid or fill the weight",
      invalid: `Value must be between ${defaultVal?.weight?.min} - ${defaultVal?.weight?.max}`,
    },
    dimension: {
      required: "Invalid or fill the length, width and height",
      invalid: `Value must be between ${defaultVal?.weight?.min} - ${defaultVal?.weight?.max}`,
    },
    avgPrice: {
      required: "Invalid or fill the average price",
      invalid: `Value must be between ${defaultVal?.avgPrice?.min} - ${defaultVal?.avgPrice?.max}`,
    },
    urgency: { required: "Invalid or select the urgency level" },
    delType: { required: "Invalid or select the delivery type" },
  };

  // validation:
  const validNull =
    location?.pickup?.lat == null ||
    location?.pickup?.lng == null ||
    location?.pickup?.place == "" ||
    location?.destination?.lat == null ||
    location?.destination?.lng == null ||
    location?.destination?.place == "" ||
    scale.weight == null ||
    defaultVal?.weight?.min > scale.weight ||
    defaultVal?.weight?.max < scale.weight ||
    scale.length == null ||
    defaultVal?.length?.min > scale.length ||
    defaultVal?.length?.max < scale.length ||
    scale.width == null ||
    defaultVal?.width?.min > scale.width ||
    defaultVal?.width?.max < scale.width ||
    scale.height == null ||
    defaultVal?.height?.min > scale.height ||
    defaultVal?.height?.max < scale.height ||
    scale.avgPrice == null ||
    defaultVal?.avgPrice?.min > scale.avgPrice ||
    defaultVal?.avgPrice?.max < scale.avgPrice ||
    urgency.type == "" ||
    Object.keys(delType).length == 0;

  const valid =
    location?.pickup?.lat != null &&
    location?.pickup?.lng != null &&
    location?.pickup?.place != "" &&
    location?.destination?.lat != null &&
    location?.destination?.lng != null &&
    location?.destination?.place != "" &&
    scale.weight != null &&
    scale.length != null &&
    scale.width != null &&
    scale.height != null &&
    scale.avgPrice != null &&
    urgency.type != "" &&
    Object.keys(delType).length != 0;

  // reset:
  const handleReset = () => {
    onLocationClose("pickup");
    onLocationClose("destination");
    setScale({
      weight: null,
      length: null,
      width: null,
      height: null,
      avgPrice: null,
    });
    handleDropdownClose();
    setDelType({});
    setUrgency({});
    setValidate(false);
    setErr({
      pickup: "",
      destination: "",
      weight: "",
      dimension: "",
      avgPrice: "",
      urgency: "",
      delType: "",
    });
    initialValid.current = 0;
    setResetTrigger(prev => prev + 1);
  };

  // Dropdown functions:
  const handleDropdownClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // Location functions:
  const onLocationChange = (coordinate: any, data: any, type: string) => {
    // console.log(coordinate, "coordinate", type);
    if (coordinate !== null && data !== null) {
      const place = data.description;
      const lat = coordinate.lat;
      const lng = coordinate.lng;
      const locations = {
        lat: lat,
        lng: lng,
        place: place,
      };
      if (lng && lat && place) {
        setLocation((pre: any) => ({ ...pre, [type]: locations }));
      }
      setErr({
        ...err,
        [type]: "",
      });
    } else {
      setErr({
        ...err,
        [type]:
          type != "pickup"
            ? errMsg?.destination?.required
            : errMsg?.destination?.required,
      });
    }
  };

  // location close:
  const onLocationClose = (type = "pickup") => {
    setLocation((pre: any) => ({
      ...pre,
      [type]: {
        lat: null,
        lng: null,
        place: "",
      },
    }));
    setErr({
      ...err,
      [type]:
        type != "pickup"
          ? errMsg?.destination?.required
          : errMsg?.destination?.required,
    });
  };

  // api calculation:
  const calcMutation = useMutation({
    mutationFn: FetchDynamicCalc,
    onSuccess: (data) => {
      if (data?.data?.dynamicCalculation) {
        setModal("calcModal", data?.data?.dynamicCalculation);
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  // validate & submit functions:
  const handleSubmit = () => {
    if (validNull) {
      setValidate(false);
      setErr({
        ...err,
        pickup:
          location?.pickup?.lat == null ||
          location?.pickup?.lng == null ||
          location?.pickup?.place == ""
            ? errMsg?.pickup?.required
            : "",
        destination:
          location?.destination?.lat == null ||
          location?.destination?.lng == null ||
          location?.destination?.place == ""
            ? errMsg?.destination?.required
            : "",
        weight:
          scale.weight == null
            ? errMsg?.weight?.required
            : scale.weight >= defaultVal?.weight?.min &&
              scale.weight <= defaultVal?.weight?.max
            ? ""
            : errMsg?.weight?.invalid || "",
        dimension:
          scale.length == null || scale.width == null || scale.height == null
            ? errMsg?.dimension?.required
            : scale.length >= defaultVal?.length?.min &&
              scale.width >= defaultVal?.width?.min &&
              scale.height >= defaultVal?.height?.min &&
              scale.length >= defaultVal?.length?.max &&
              scale.width >= defaultVal?.width?.max &&
              scale.height >= defaultVal?.height?.max
            ? ""
            : errMsg?.dimension?.invalid || "",
        avgPrice:
          scale.avgPrice == null
            ? errMsg?.avgPrice?.required
            : scale.avgPrice >= defaultVal?.avgPrice?.min &&
              scale.avgPrice <= defaultVal?.avgPrice?.max
            ? ""
            : errMsg?.avgPrice?.invalid || "",
        urgency:
          Object.keys(urgency).length == 0 ? errMsg?.urgency?.required : "",
        delType:
          Object.keys(delType).length == 0 ? errMsg?.delType?.required : "",
      });
    } else if (valid) {
      setValidate(true);
      calcMutation.mutateAsync({
        pickupLat: location?.pickup?.lat,
        pickupLng: location?.pickup?.lng,
        dropLat: location?.destination?.lat,
        dropLng: location?.destination?.lng,
        width: scale?.width,
        height: scale?.height,
        length: scale?.length,
        weight: scale?.weight,
        urgencyLevel: urgency?.key,
        parcelType: delType?.key,
        distanceCostFactor: scale?.avgPrice,
      });
    }
  };

  useEffect(() => {
    if (initialValid.current != 0) {
      if (validNull) {
        setValidate(!false);
      } else if (valid) {
        setValidate(true);
      }
    }
    initialValid.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, scale, urgency, delType]);

  // err component:
  const ErrorText = ({ err = "" }) => (
    <div className="mt-1">
      <p className={fonts.smFont + " text-red-600"}>{err}</p>
    </div>
  );

  return (
    <div className="max-w-[1440px] w-full mx-auto md:py-10 py-4">
      <div className="lg:px-10 md:px-5 px-3 w-full">
        {/* formula */}
        <FormulaCard button={true} />
        {/* dynamic Calculation */}
        <section className="md:mb-20 mb-10">
          {datas?.block2?.title && (
            <h3 className={`${fonts.titleStyle} sm:mb-10 mb-5`}>
              {datas?.block2?.title}
            </h3>
          )}
          <div className="w-full flex lg:flex-row flex-col-reverse rounded-2xl shadow-[0_0_20px_#00000066] bg-btncolor lg:gap-0 gap-5 overflow-hidden">
            {/* left */}
            <div className="lg:w-[62%] w-full relative before:absolute lg:before:-right-[22%] before:bottom-0 lg:before:size-[170%] before:size-full lg:before:rounded-e-[50%] before:rounded-se-3xl before:rounded-ss-3xl  before:bg-white before:-z-10 z-20">
              <div className="lg:w-[122%] h-full p-5 lg:pr-14">
                {/* location */}
                <b className={fonts.pBold + " mb-4 block"}>
                  {i18?.NEW?.LOCATION || "Location"}
                </b>
                <div className="flex xs:flex-nowrap flex-wrap gap-3 justify-between mb-10">
                  <div className="w-full md:w-[49%]">
                    <div className=" p-2 px-4 border border-black rounded-lg box-border focus-within:border-[#004080]">
                      <LoaderScript>
                        <AutocompleteComp
                          onPlaceChangedpickup={(
                            coordinate: any,
                            data: any
                          ) => {
                            onLocationChange(coordinate, data, "pickup");
                          }}
                          onClose={() => onLocationClose("pickup")}
                          type="pickup"
                          placeholder={i18?.NEW?.PICKUP || "Pick-up"}
                          resetTrigger={resetTrigger}
                        />
                      </LoaderScript>
                    </div>
                    {err.pickup != "" && <ErrorText err={err.pickup} />}
                  </div>

                  <div className="w-full md:w-[49%]">
                    <div className="p-2 px-4 border border-black rounded-lg box-border focus-within:border-[#004080]">
                      <LoaderScript>
                        <AutocompleteComp
                          onPlaceChangeddestination={(
                            coordinate: any,
                            data: any
                          ) => {
                            onLocationChange(coordinate, data, "destination");
                          }}
                          onClose={() => onLocationClose("destination")}
                          type="drop"
                          placeholder={i18?.NEW?.DROPOFF || "Drop-off"}
                          resetTrigger={resetTrigger}
                        />
                      </LoaderScript>
                    </div>
                    {err.destination != "" && (
                      <ErrorText err={err.destination} />
                    )}
                  </div>
                </div>
                {/* scale inputs */}
                <div className="flex flex-wrap justify-between sm:gap-0 gap-4">
                  {/* Actual Weight */}
                  <div className="sm:w-4/12 w-full">
                    <b className={fonts.pBold + " mb-4 block"}>
                      {delivery_Cancellation?.ACTUAL_WEIGHT || "Actual Weight"}
                    </b>
                    <ScaleInput
                      max={defaultVal.weight.max}
                      min={defaultVal.weight.min}
                      step={defaultVal.weight.step}
                      scales="weight"
                      scale={scale}
                      setErr={setErr}
                      setScale={setScale}
                      errMsg={errMsg}
                    />
                    {err.weight != "" && <ErrorText err={err.weight} />}
                    <p className={fonts.smFont + " text-[#004080] mt-2"}>
                      {dynamic_Calculation?.MINIMUM_CHARGEABLE ||
                        "Note: Minimum chargeable weight is 0.5Kg"}
                    </p>
                  </div>
                  {/* Dimentions */}
                  <div className="md:w-[49%] sm:w-7/12 w-full">
                    <b className={fonts.pBold + " mb-4 block"}>
                      {delivery_Cancellation?.DIMENSIONS || "Dimensions"}
                    </b>
                    <div className="flex items-center flex-wrap justify-center sm:gap-x-1 gap-y-3 gap-3">
                      <ScaleInput
                        max={defaultVal.length.max}
                        min={defaultVal.length.min}
                        step={defaultVal.length.step}
                        scales="length"
                        scale={scale}
                        setErr={setErr}
                        setScale={setScale}
                        placeholder={i18?.NEW?.LENGTH || "L"}
                        errMsg={errMsg}
                      />
                      <p className={fonts.pNormal + ""}>X</p>
                      <ScaleInput
                        max={defaultVal.width.max}
                        min={defaultVal.width.min}
                        step={defaultVal.width.step}
                        scales="width"
                        scale={scale}
                        setErr={setErr}
                        setScale={setScale}
                        placeholder={i18?.NEW?.WIDTH || "W"}
                        errMsg={errMsg}
                      />
                      <p className={fonts.pNormal + ""}>X</p>
                      <ScaleInput
                        max={defaultVal.height.max}
                        min={defaultVal.height.min}
                        step={defaultVal.height.step}
                        scales="height"
                        scale={scale}
                        setErr={setErr}
                        setScale={setScale}
                        placeholder={i18?.NEW?.HEIGHT || "H"}
                        errMsg={errMsg}
                      />
                    </div>
                    {err.dimension != "" && <ErrorText err={err.dimension} />}
                  </div>
                </div>
                {/* Urgency Level */}
                <div className="my-10">
                  <b className={fonts.pBold + " mb-5 block"}>
                    {delivery_Cancellation?.URGENCY_BLK1_TITLE ||
                      "Urgency Level"}
                  </b>
                  <div className="flex sm:gap-2 gap-4 flex-wrap sm:justify-between justify-center">
                    {defaultVal?.urgency?.map((item: any, ind: number) => (
                      <div
                        key={ind}
                        onClick={() => {
                          setUrgency(item);
                          setErr((pre) => ({
                            ...pre,
                            urgency: "",
                          }));
                        }}
                        className={
                          (item.type == urgency.type
                            ? "outline-2 outline-[#004080] ring-2 ring-[#004080]"
                            : "") +
                          " lg:w-[30%] sm:w-[32%] xs:w-[48%] w-full flex items-center p-2 xl:gap-1 gap-2 rounded-md outline outline-1 box-border hover:outline-2 cursor-pointer duration-200 group"
                        }
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item.img}
                          alt={item.type}
                          className="w-auto h-10 object-contain object-left"
                        />
                        <p className={fonts.pBold + " "}>{item.type}</p>
                      </div>
                    ))}
                  </div>
                  {err.urgency != "" && <ErrorText err={err.urgency} />}
                </div>
                <div className="max-w-[470px] w-full">
                  {/* delivery type */}
                  <div className="my-10">
                    <b className={fonts.pBold + " mb-5 block"}>
                      {delivery_Cancellation?.DELIVERY_TITLE || "Delivery Type"}
                    </b>
                    <Button
                      onClick={handleDropdownClick}
                      className="w-full flex items-center rounded-md border border-black p-2 gap-2"
                    >
                      {Object.keys(delType).length > 0 ? (
                        <>
                          <Image
                            width={30}
                            height={30}
                            src={delType?.img}
                            alt={delType?.type}
                            className="w-6 h-6 object-contain"
                          />
                          <p className={fonts.tabFont + ""}>{delType?.type}</p>
                        </>
                      ) : (
                        <p className={fonts.tabFont + " text-gray-500"}>
                          {delivery_Cancellation?.DELIVERY_TITLE ||
                            "Delivery Type"}
                        </p>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-auto h-4 aspect-square transition-transform transform ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                    {err.delType != "" && <ErrorText err={err.delType} />}
                    {defaultVal.delType.length > 0 && (
                      <PopoverComponent
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleDropdownClose}
                      >
                        <div className="w-[470px]">
                          {defaultVal.delType.map((item: any, ind: number) => (
                            <Button
                              key={ind}
                              onClick={() => {
                                setDelType(item);
                                handleDropdownClose();
                                setErr((pre) => ({
                                  ...pre,
                                  delType: "",
                                }));
                              }}
                              className={
                                "w-full flex items-center last:border-b-0 border-b border-[#00000055] p-2 py-3 gap-2"
                              }
                            >
                              <Image
                                src={item?.img}
                                alt={item?.type}
                                width={30}
                                height={30}
                                className="w-6 h-6 object-contain"
                              />
                              <p className={fonts.tabFont + ""}>{item?.type}</p>
                            </Button>
                          ))}
                        </div>
                      </PopoverComponent>
                    )}
                  </div>
                  {/* Avg Price */}
                  <div className="my-10">
                    <b className={fonts.pBold + " mb-5 block"}>
                      {dynamic_Calculation?.DYNAMIC_AVERAGE_PRICE ||
                        "Average Price"}
                    </b>
                    <ScaleInput
                      max={defaultVal?.avgPrice?.max}
                      min={defaultVal.avgPrice.min}
                      step={defaultVal.avgPrice.step}
                      scales="avgPrice"
                      scale={scale}
                      setErr={setErr}
                      setScale={setScale}
                      placeholder="0.06"
                      errMsg={errMsg}
                    />
                    {err.avgPrice != "" && <ErrorText err={err.avgPrice} />}
                  </div>
                  {/* yellow note */}
                  <p
                    className={
                      fonts.smFont +
                      " bg-[#F7941D] inline-block p-1 rounded-md text-white mb-3"
                    }
                  >
                    {dynamic_Calculation?.POSTIER_RECOMMEND ||
                      "Postier Recommendation Price :€0.06 - €0.09 / km."}
                  </p>
                  <p className={fonts.smFont + " text-[#004080]"}>
                    {dynamic_Calculation?.CONSIDER_INCREASE ||
                      "Note: Consider increasing your price to better share your travel costs for this ride. You&apos;ll get bookings in no time!"}
                  </p>
                  <div className="flex items-center justify-between mt-7">
                    <Button
                      onClick={handleSubmit}
                      disabled={!validate}
                      className={
                        fonts.pNormal +
                        (validate
                          ? "active:opacity-85 bg-btncolor"
                          : "opacity-70 bg-gray-600") +
                        ` w-[48%] md:px-12 px-6 md:py-4 py-3 border rounded-lg  text-[#fff] my-4 `
                      }
                    >
                      {dynamic_Calculation?.CALCULATE || "Calculate"}
                    </Button>
                    <Button
                      onClick={handleReset}
                      className={
                        fonts.pNormal + ` w-[48%] my-4 active:opacity-55`
                      }
                    >
                      <span className="border-b border-dashed border-[#004080]">
                        {dynamic_Calculation?.RESET || "Reset"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div className="lg:w-[38%] w-full flex lg:flex-col justify-between lg:items-start items-center lg:p-0 p-4">
              <div className="lg:ml-[44%] lg:mt-[30%] xs:w-2/4 w-[53%] flex flex-col items-center">
                <Button
                  className={
                    fonts.whiteBtn +
                    ` lg:p-5 p-3 lg:w-full cursor-default  w-3/4 border rounded-lg bg-white text-black shadow-[0_0_20px_5px_#ffffff33]`
                  }
                >
                  Pick-up location
                </Button>
                <div className="w-[0.2px] h-20 border border-dashed"></div>
                <Button
                  className={
                    fonts.whiteBtn +
                    ` lg:p-5 p-3 lg:w-full cursor-default w-3/4 border rounded-lg bg-white text-black shadow-[0_0_20px_5px_#ffffff33]`
                  }
                >
                  Delivery
                </Button>
              </div>
              <Image
                width={400}
                height={400}
                src={"/svg/dis01.svg"}
                alt={"dis01"}
                className=" object-contain lg:w-[calc(100%+30px)] xs:w-72 w-48 h-auto"
              />
            </div>
          </div>
        </section>
        {/* Volumetric Weight */}
        <Cardblue altStyle="p-5 py-14">
          <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
            <div className="xl:w-8/12 md:w-1/2 w-full md:pr-3 pr-0">
              <h4 className={`${fonts.titleStyle} sm:mb-10 mb-5`}>
                {datas?.block3?.title}
              </h4>
              <p className={"mb-2 md:text-[20px] text-[17px] " + fonts.pNormal}>
                {datas?.block3?.p}
              </p>
            </div>
            <div className="xl:w-4/12 sm:w-1/2 w-full">
              <Image
                width={400}
                height={400}
                src={datas?.block3?.img}
                alt={"weight_measure"}
                className=" object-contain w-full lg:h-[350px] h-[290px]"
              />
            </div>
          </div>
        </Cardblue>
      </div>
    </div>
  );
}
