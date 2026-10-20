import StoreParcel from "@/app/store/store-parcel";
import DateTimePickers from "../datetimepicker";
import dayjs from "dayjs";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useFormContext } from "../../FormCotext";
import PageContext from "@/app/providers/pagecontext";

export default function DropDateTime({ type }: any) {
  const { i18 } = useContext(PageContext);
  const [error, setError] = useState(false);
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const [date, setDate] = useState("");
  const handleDateChange = (date: any) => {
    if (date && Parceldata?.pickupDate) {
      const selectedDate = dayjs.utc(date);
      const pickupDate = dayjs.utc(Parceldata.pickupDate);
      const isStandard = Parceldata?.deliveryType === "Standard Delivery";

      if (isStandard) {
        const isAfterPickup = selectedDate.isAfter(pickupDate);
        if (!isAfterPickup) {
          setError(true);
          return;
        }
      } else {
        const isSameDay = selectedDate.isSame(pickupDate, "day");
        const isAfterPickup = selectedDate.isAfter(pickupDate);
        const isBeforeEndOfDay = selectedDate.isBefore(pickupDate.endOf("day"));

        if (!isSameDay || !isAfterPickup || !isBeforeEndOfDay) {
          setError(true);
          return;
        }
      }

      // If valid:
      const formatted = selectedDate.format("YYYY-MM-DDTHH:mm:ss.000Z");
      setPacelData("deliveryDate", formatted);
      setError(false);
    }
  };

  const isSameDayDeliveryValid = useMemo(() => {
    if (Parceldata?.deliveryType !== "Today Delivery") {
      const pickup = dayjs(Parceldata?.pickupDate).format("YYYY-MM-DD");
      const delivery = dayjs(Parceldata?.deliveryDate).format("YYYY-MM-DD");
      return pickup === delivery;
    }
    return false;
  }, [Parceldata]);

  // console.log("isSameDayDeliveryValid", error);

  useLayoutEffect(() => {
    if (
      Parceldata?.deliveryDate &&
      Parceldata?.deliveryDate !== "Invalid Date" &&
      !error
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata, error]);
  useEffect(() => {
    if (error) {
      setDisable(true);
    }
  }, [error, setDisable]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {type === "trip"
          ? i18?.NEW?.PICKUPDATETIME3 ||
            "Select the appropriate date and time at which your journey begins"
          : i18?.NEW?.DROPOFF_DATE_TIME ||
            "Pick corresponding drop-off date & time for parcel delivery"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <label
          htmlFor="deliveryDate"
          className="text-[20px] font-[700] leading-[26px] sr-only"
        >
          {i18?.NEW?.DROP_OFF_TIME || "Drop off Time"}
        </label>
        <DateTimePickers
          id="deliveryDate"
          range="to"
          type={Parceldata?.deliveryType}
          onDate={handleDateChange}
          date={Parceldata?.deliveryDate && Parceldata?.deliveryDate}
          pickupDate={Parceldata?.pickupDate && Parceldata?.pickupDate}
        />
        {(Parceldata?.deliveryDate && isSameDayDeliveryValid) ||
          (error && (
            <p className="text-[#C5172E]">
              {i18?.NEW?.INVALIDDATES || "Invalid Dates"}
            </p>
          ))}
      </div>
    </div>
  );
}
