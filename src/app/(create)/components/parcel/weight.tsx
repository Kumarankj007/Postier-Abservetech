import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import { usePathname, useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";

export default function Weight() {
  const path = usePathname();
  const pathname = usePathname();
  const { setPacelData, Parceldata } = StoreParcel();
  const { i18 } = useContext(PageContext);
  const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore();
  const { setDisable }: any = useFormContext();
  const [weightT, setweightType] = useState<string | any>("");
  const [weight, setWidth] = useState("");
  const metrics =
    Parceldata?.dimensionType !== undefined
      ? Parceldata?.dimensionType
      : pathname === "/chooseparcel/" && MyTripsDetails?.dimensionType;
  const params = useSearchParams();
  const Suggestion_id = params.get("id");
  const [error, setError] = useState(false);

  const VehicleCapacity = Parceldata?.Vcapacity;

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (
      parseInt(newValue) >
        parseInt(pathname === "/createtrip/" && VehicleCapacity) ||
      parseInt(newValue) >
        parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxWeight) ||
      parseInt(newValue) <
        parseInt(
          pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.weight
        )
    ) {
      setError(true);
      setDisable(true);
    } else {
      setError(false);
      setDisable(false);
    }
  };
  useLayoutEffect(() => {
    if (Parceldata?.weight) {
      setWidth(Parceldata?.weight && Parceldata?.weight);
      setweightType(metrics && metrics);
      // setDisable(false);
      if (Suggestion_id !== null) {
        if (
          parseInt(Parceldata?.weight) >
            parseInt(
              pathname === "/chooseparcel/" && MyTripsDetails?.maxWeight
            ) ||
          parseInt(Parceldata?.weight) <
            parseInt(
              pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.weight
            )
        ) {
          setError(true);
        } else {
          setError(false);
        }
      } else {
        if (
          parseInt(Parceldata?.weight) >
          parseInt(pathname === "/createtrip/" && VehicleCapacity)
        ) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      }
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {pathname === "/createparcel/" || pathname === "/chooseparcel/"
          ? i18?.NEW?.PROVIDEPARCELWEIGHT ||
            "Please provide the parcel weight details"
          : i18?.NEW?.SPECIFYMAXWEIGHTPERPARCEL ||
            "Specify your maximum weight per parcel"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <div className="relative">
          <LabeledInput
            placeholder={
              path === "/createtrip/"
                ? `${
                    i18?.NEW?.WEIGHT_GREATER_ERROR ||
                    "Weight can't be greater than"
                  } ${VehicleCapacity || "N/A"}`
                : Suggestion_id === null
                ? "Parcel Weight"
                : path === "/chooseparcel/"
                ? `${
                    i18?.NEW?.WEIGHT_GREATER_ERROR ||
                    "Weight can't be greater than"
                  } ${MyTripsDetails?.maxWeight || "N/A"}`
                : path === "/choosetrip/"
                ? `${
                    i18?.NEW?.WEIGHT_LESS_ERROR || "Weight can't be less than"
                  } ${MyParcelsDetails?.parcel?.weight || "N/A"}`
                : "Maximum Weight"
            }
            autoFocus
            onChange={(e: any) => {
              setWidth(e.target.value);
              setPacelData("weight", e.target.value);
              if (Suggestion_id !== null) {
              }
              handleChange(e);
            }}
            id={"weight-input"}
            labelId="weight-input"
            error={error}
            value={weight}
          />
          <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
            Kgs
          </div>
        </div>
        {error && (
          <p className="text-[#F72C5B] mt-[10px]">{`${
            pathname === "/createtrip/"
              ? (i18?.NEW?.WEIGHT_GREATER_ERROR ||
                  "Weight can't be greater than") +
                " " +
                VehicleCapacity
              : pathname === "/chooseparcel/"
              ? (i18?.NEW?.WEIGHT_GREATER_ERROR ||
                  "Weight can't be greater than") +
                " " +
                MyTripsDetails?.maxWeight
              : (i18?.NEW?.WEIGHT_LESS_ERROR || "Weight can't be less than") +
                " " +
                MyParcelsDetails?.parcel?.weight
          }`}</p>
        )}
      </div>
    </div>
  );
}
