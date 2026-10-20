"use client";
import BpCheckbox from "@/app/component/checkbox";
import DatePickerComp from "@/app/component/datepicker";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import RangeSlider from "./slider";
import { debounce } from "@/utils";
import useStore from "@/app/store/filterStore";
import RadioButton from "@/app/component/radiobutton";
import RadioButtonGroup from "@/app/component/radiobutton";
import TypeStore from "@/app/store/typeStore";
import PageContext from "@/app/providers/pagecontext";

dayjs.extend(utc);
dayjs.extend(timezone);

const PickUpTime = [
  {
    label: "Before 06:00",
    value: "Before 06:00",
  },
  {
    label: "06:00 - 12:00",
    value: "06:00 - 12:00",
  },
  {
    label: "12:01 - 18:00",
    value: "12:01 - 18:00",
  },
  {
    label: "After 18:00",
    value: "After 18:00",
  },
];

const DropTime = [
  {
    label: "Before 06:00",
    value: "Before 06:00",
  },
  {
    label: "06:00 - 12:00",
    value: "06:00 - 12:00",
  },
  {
    label: "12:01 - 18:00",
    value: "12:01 - 18:00",
  },
  {
    label: "After 18:00",
    value: "After 18:00",
  },
];

const DeliveryType = [
  {
    label: "Express Delivery",
    value: "Express Delivery",
  },
  {
    label: "Schedule Delivery",
    value: "Schedule Delivery",
  },
  {
    label: "Standard Delivery",
    value: "Standard Delivery",
  },
];

const VehiclesType = [
  {
    label: "Van",
    value: "Van",
  },
  {
    label: "Truck",
    value: "Truck",
  },
  {
    label: "Bike",
    value: "Bike",
  },
  {
    label: "Semi-Truck",
    value: "Semi-Truck",
  },
  {
    label: "Car",
    value: "Car",
  },
];

const Ratings = [
  {
    label: "4 & above",
    value: "4",
  },
  {
    label: "3 & above",
    value: "3",
  },
  {
    label: "2 & above",
    value: "2",
  },
  {
    label: "1 & above",
    value: "1",
  },
];
const Section = ({ title, items, valueKey, value, handleChange }: any) => (
  <div className="p-5 border border-1 border-btncolor rounded-[11px]">
    <div className="flex flex-col gap-[30px]">
      <p className="text-[20px] font-[700] leading-[26px]">{title}</p>
      <div className="flex flex-col gap-[30px]">
        <RadioButtonGroup
          onClick={(e: any) => handleChange(valueKey, e)}
          options={items}
          value={value[valueKey] || ""}
        />
      </div>
    </div>
  </div>
);

const SliderSec = ({ title, items, value, updateQuery, values }: any) => (
  <div className="p-5 border border-1 border-btncolor rounded-[11px]">
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-[700] leading-[26px]">{title}</p>
      <p className="text-[17px] font-[400] leading-[26px]">
        {value[`min${items}`] || "0"} - {value[`max${items}`] || "10"}{" "}
      </p>
      <RangeSlider items={items} updateQuery={updateQuery} values={values} />
    </div>
  </div>
);
function Filters() {
  const { i18 } = useContext(PageContext);
  const SortByFilter = [
    {
      label: i18?.NEW?.EARLIEST_DEPARTURE || "Earliest departure",
      value: "Earliest departure",
    },
    {
      label: i18?.NEW?.LOWEST_PRICE || "Lowest price",
      value: "Lowest price",
    },
    {
      label:
        i18?.NEW?.CLOSE_TO_DESTINATION_POINT || "Close to destination point",
      value: "Close to destination point",
    },
    {
      label: i18?.NEW?.CLOSE_TO_START_POINT || "Close to start point",
      value: "Close to start point",
    },
    {
      label: i18?.NEW?.SHORTEST_RIDE || "Shortest ride",
      value: "Shortest ride",
    },
  ];
  const { Type } = TypeStore();
  const searchParams = useSearchParams();
  const { value, setValue } = useStore();
  const paramsObject: any = Object.fromEntries(searchParams.entries());

  // const [value, setValue] = useState<any>(
  //     {
  //         sortby: '',
  //         pickupDate: '',
  //         pickupTime: '',
  //         deliveryTime: '',
  //         deliveryType: '',
  //         vehicleType: '',
  //         rating: '',
  //         minHeight:'',
  //         maxHeight:'',
  //         minWeight:'',
  //         maxWeight:''
  //     }
  // );
  React.useEffect(() => {
    return () => {
      // console.log("filter component unmounted");
    };
  }, []);

  const handleChange = (
    name: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = typeof event === "string" ? event : event.target.value;
    setValue({ [name]: newValue });
  };

  const handleRadioChange = (
    name: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = typeof event === "string" ? event : event.target.value;
    setValue({ [name]: newValue });
  };

  const updateQueryParams = (items: any, newValue: any) => {
    setValue({
      [`min${items}`]: newValue[0],
      [`max${items}`]: newValue[1],
    });
  };

  const handleDateChange = (date: any) => {
    if (date) {
      const data = dayjs(date);
      // const dateformat = data.format('YYYY-MM-DDT00:00:00.00') + "Z"
      const dateformat = dayjs(data).utc().startOf("day").toISOString();
      // const adjustedDate = dateformat.add(5, 'hours').add(30, 'minutes');
      setValue({ pickupDate: dateformat as any });
    }
  };
  useEffect(() => {
    const UserID =
      typeof window !== undefined && localStorage.getItem("appUserId");
    const updateQueryParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (value.sortby) {
        searchParams.set("sortby", value.sortby);
      } else if (searchParams.get("sortby")) {
        searchParams.delete("sortby");
      }
      if (value.pickupDate) {
        searchParams.set("pickupDate", value?.pickupDate as any);
      }
      // if (UserID) {
      //     searchParams.set('userId', UserID);
      // }
      if (value.pickupTime) {
        if (value?.pickupTime === "Before 06:00") {
          searchParams.set(
            "pickupStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "pickupEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(5)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else if (value?.pickupTime === "06:00 - 12:00") {
          searchParams.set(
            "pickupStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(5)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "pickupEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(11)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else if (value?.pickupTime === "12:01 - 18:00") {
          searchParams.set(
            "pickupStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(12)
              .minute(1)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "pickupEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(17)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else {
          searchParams.set(
            "pickupStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(18)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "pickupEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(24)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        }
        searchParams.set("pickupTime", value.pickupTime);
      } else if (
        searchParams.get("pickupStart") &&
        searchParams.get("pickupEnd")
      ) {
        searchParams.delete("pickupStart");
        searchParams.delete("pickupEnd");
      }
      if (value.deliveryTime) {
        if (value?.deliveryTime === "Before 06:00") {
          searchParams.set(
            "deliveryStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "deliveryEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(5)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else if (value?.deliveryTime === "06:00 - 12:00") {
          searchParams.set(
            "deliveryStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(6)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "deliveryEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(11)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else if (value?.deliveryTime === "12:01 - 18:00") {
          searchParams.set(
            "deliveryStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(12)
              .minute(1)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "deliveryEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(17)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        } else {
          searchParams.set(
            "deliveryStart",
            dayjs(value?.pickupDate)
              .utc()
              .hour(18)
              .minute(0)
              .second(0)
              .millisecond(0)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
          searchParams.set(
            "deliveryEnd",
            dayjs(value?.pickupDate)
              .utc()
              .hour(23)
              .minute(59)
              .second(59)
              .millisecond(59)
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          );
        }
        searchParams.set("deliveryTime", value.deliveryTime);
      } else if (
        searchParams.get("deliveryStart") &&
        searchParams.get("deliveryEnd")
      ) {
        searchParams.delete("deliveryStart");
        searchParams.delete("deliveryEnd");
      }
      if (value.deliveryType) {
        searchParams.set("deliveryType", value.deliveryType);
      } else if (searchParams.get("deliveryType")) {
        searchParams.delete("deliveryType");
      }
      if (value.vehicleType) {
        searchParams.set("vehicleType", value.vehicleType);
      } else if (searchParams.get("vehicleType")) {
        searchParams.delete("vehicleType");
      }
      if (value.rating) {
        searchParams.set("rating", value.rating);
      } else if (searchParams.get("rating")) {
        searchParams.delete("rating");
      }
      if (value.minHeight || value.minHeight === (0 as any)) {
        searchParams.set("minHeight", value.minHeight);
      }
      if (value.maxHeight) {
        searchParams.set("maxHeight", value.maxHeight);
      }
      if (value.minWeight || value.minWeight === (0 as any)) {
        searchParams.set("minWeight", value.minWeight);
      }
      if (value.maxWeight) {
        searchParams.set("maxWeight", value.maxWeight);
      }

      const queryString = searchParams.toString();

      window.history.replaceState(
        { path: `/search/?${queryString}` },
        "",
        `/search/?${queryString}`
      );
    };

    updateQueryParams();
  }, [value]);
  // console.log("value", value);
  useEffect(() => {
    if (searchParams.size > 0 && paramsObject) {
      // const params: Record<string, any> = {};
      // Object.entries(paramsObject).forEach(([key, value]) => {
      //     params[key] = value;
      // });
      setValue(paramsObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClear = () => {
    const items = [
      "sortby",
      "pickupDate",
      "pickupTime",
      "deliveryTime",
      "deliveryType",
      "vehicleType",
      "rating",
      "minHeight",
      "maxHeight",
      "minWeight",
      "maxWeight",
    ];

    const url = new URL(window.location.href);
    const paramsObject = url.searchParams;

    items.forEach((param) => {
      paramsObject.delete(param);
    });
    url.search = paramsObject.toString();

    updateQueryParams("Height", [0, 10]);
    updateQueryParams("Weight", [0, 10]);

    setValue({
      sortby: "",
      pickupDate: "",
      pickupTime: "",
      deliveryTime: "",
      deliveryType: "",
      vehicleType: "",
      rating: "",
      minHeight: "",
      maxHeight: "",
      minWeight: "",
      maxWeight: "",
    });

    window.history.replaceState({}, "", url.pathname + url.search);
  };
  const result = dayjs(value?.pickupDate)
    .utc()
    .hour(6)
    .minute(0)
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  // console.log("paramsObject", paramsObject);
  return (
    <div className="flex flex-col gap-[50px]">
      <div className="flex justify-between sticky top-0 bg-[#fff] p-2 z-[999]">
        <p className="text-[20px] font-[700] leading-[26px]">
          {i18?.NEW?.FILTERS || "Filters"}
        </p>
        {value.sortby ||
        value.deliveryType ||
        value.vehicleType ||
        value.rating ? (
          <p
            className="text-[20px] font-[400] leading-[26px] underline text-btncolor cursor-pointer"
            onClick={handleClear}
          >
            {i18?.NEW?.CLEAR_ALL || "Clear all"}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className=" p-5 border border-1 border-btncolor rounded-[11px]">
        <div className="flex flex-col gap-[30px] ">
          <p className="text-[20px] font-[700] leading-[26px]">
            {i18?.NEW?.SORT_BY || "Sort By"}
          </p>
          <div>
            <RadioButtonGroup
              onClick={(e: any) => handleRadioChange("sortby", e)}
              // onChange={(e:any) => handleChange('sortby', e)}
              options={SortByFilter}
              value={value.sortby || ""}
            />
          </div>
        </div>
      </div>

      {/* <div className=' p-5 border border-1 border-btncolor rounded-[11px]'>
                <div className='flex flex-col gap-[30px] '>
                    <p className='text-[20px] font-[700] leading-[26px]'>Pick-up Date</p>
                    <DatePickerComp
                        onDate={handleDateChange}
                        date={value.pickupDate}
                    />
                </div>
            </div> */}

      {paramsObject?.pickupDate && (
        <>
          <Section
            title={i18?.NEW?.PICK_UP_TIME || "Pick-up Time"}
            items={PickUpTime}
            value={value}
            valueKey="pickupTime"
            handleChange={handleChange}
          />
          <Section
            title={i18?.NEW?.DROP_OFF_TIME || "Drop-Off Time"}
            items={DropTime}
            value={value}
            valueKey="deliveryTime"
            handleChange={handleChange}
          />
        </>
      )}
      {Type === "deliverparcel" && (
        <>
          <div className=" p-5 border border-1 border-btncolor rounded-[11px]">
            <div className="flex flex-col gap-[30px] ">
              <label
                htmlFor="pickup-date"
                className="text-[20px] font-[700] leading-[26px]"
              >
                {i18?.NEW?.PICK_UP_DATE || "Pick-up Date"}
              </label>
              <DatePickerComp
                id="pickup-date"
                onDate={handleDateChange}
                date={value.pickupDate}
              />
            </div>
          </div>
          {/* <SliderSec title="Search Radius" items={DeliveryType} valueKey="deliveryType" handleChange={handleChange} /> */}
          <SliderSec
            title={i18?.NEW?.PARCEL_HEIGHT || "Parcel Height"}
            items="Height"
            updateQuery={updateQueryParams}
            value={value}
            values={[value["minHeight"] || 0, value["maxHeight"] || 10]}
          />
          <SliderSec
            title={i18?.NEW?.PARCEL_WEIGHT || "Parcel Weight"}
            items="Weight"
            updateQuery={updateQueryParams}
            value={value}
            values={[value["minWeight"] || 0, value["maxWeight"] || 10]}
          />
        </>
      )}
      <Section
        title={i18?.NEW?.DELIVERY_TYPE || "Delivery Type"}
        items={DeliveryType}
        valueKey="deliveryType"
        handleChange={handleChange}
        value={value}
      />
      <Section
        title={i18?.NEW?.VEHICLE_TYPE || "Vehicle Type"}
        items={VehiclesType}
        valueKey="vehicleType"
        handleChange={handleChange}
        value={value}
      />
      <Section
        title={i18?.NEW?.RATINGS || "Ratings"}
        items={Ratings}
        valueKey="rating"
        handleChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default Filters;
