import StoreParcel from "@/app/store/store-parcel";
import DateTimePickers from "../datetimepicker";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import PageContext from "@/app/providers/pagecontext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// dayjs.extend(utc);

export default function DateTime({ type }: any) {
  const [error, setError] = useState(false);
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const { i18 } = useContext(PageContext);
  const today = dayjs();
  // const [date,setDate] = useState('')
  const handleDateChange = (date: any) => {
    if (date) {
      // const data = dayjs(date);
      const data = dayjs.utc(date);
      if (data.isBefore(today)) {
        setError(true);
      } else {
        const dateformat = data.format("YYYY-MM-DDTHH:mm:ss.000Z");
        // console.log(dateformat, "dateformat")
        setPacelData("pickupDate", dateformat);
        setError(false);
      }
    }
  };
  useLayoutEffect(() => {
    if (
      Parceldata?.pickupDate &&
      Parceldata?.pickupDate !== "Invalid Date" &&
      !error
    ) {
      setDisable(false);
      // const date:any = dayjs(Parceldata?.pickupDate).utc()
      // setDate(date)
    } else {
      setDisable(true);
      if (today && Parceldata?.deliveryType === "Today Delivery")
        setPacelData("pickupDate", today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);
  // console.log('date',date)
  useEffect(() => {
    if (error) {
      setDisable(true);
    }
  }, [error, setDisable]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px] ">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {type === "trip"
          ? i18?.NEW?.PICKUPDATETIME2 ||
            "Select the appropriate date and time at which your journey begins"
          : i18?.NEW?.PICKUPDATETIME ||
            "Pick corresponding pick-up date & time for parcel delivery"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <label
          htmlFor="pickupDate"
          className="text-[20px] font-[700] leading-[26px] sr-only"
        >
          {i18?.NEW?.PICK_UP_TIME || "Pick-up Time"}
        </label>
        <DateTimePickers
          id="pickupDate"
          range="from"
          onDate={handleDateChange}
          date={
            Parceldata?.deliveryType === "Express Delivery" &&
            !Parceldata?.pickupDate
              ? today
              : Parceldata?.pickupDate && Parceldata?.pickupDate
          }
          type={Parceldata?.deliveryType}
        />
        {error && (
          <p className="text-[#C5172E]">
            {i18?.NEW?.INVALIDDATES || "Invalid Dates"}
          </p>
        )}
      </div>
    </div>
  );
}
