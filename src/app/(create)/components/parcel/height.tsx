import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import { usePathname, useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";

export default function Height() {
  const pathname = usePathname();
  const { i18 } = useContext(PageContext);
  const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore();
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const [weightT, setheightType] = useState<string | any>("");
  const [height, setHeight] = useState("");
  const metrics =
    Parceldata?.dimensionType !== undefined
      ? Parceldata?.dimensionType
      : pathname === "/chooseparcel/"
      ? MyTripsDetails?.dimensionType
      : MyParcelsDetails?.parcel?.dimensionType;
  const params = useSearchParams();
  const Suggestion_id = params.get("id");
  const [error, setError] = useState(false);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (
      (parseInt(newValue) >
      parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxHeight)) || (
      parseInt(newValue) <
      parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.height)
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
    if (Parceldata?.height && metrics) {
      setHeight(Parceldata?.height && Parceldata?.height);
      setheightType(metrics);
      if (Suggestion_id !== null) {
        if (
          parseInt(Parceldata?.height) >
          parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxHeight)
        ) {
          setError(true);
        } else if (
          parseInt(Parceldata?.height) <
          parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.height)
        ) {
          setError(true);
        }
        else {
            setError(false);
        }
      }else{
      setDisable(false);
      }
    } else {
      setDisable(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata, metrics]);
  // console.log("error", error);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {pathname === "/createparcel/" || pathname === "/chooseparcel/"
          ? i18?.NEW?.PROVIDEPARCELHEIGHT ||
            "Please provide the parcel height details"
          : i18?.NEW?.SPECIFYMAXHEIGHTPERPARCEL ||
            "Specify your maximum height per parcel"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <div className="relative">
          <LabeledInput
            placeholder={
              Suggestion_id === null
                ? "Parcel Height"
                : pathname === "/chooseparcel/"
                ? `${i18?.NEW?.HEIGHT_GREATER_ERROR ||"Height can't be greater than"} ${
                    MyTripsDetails?.maxHeight || "N/A"
                  }`: pathname === "/choosetrip/"
                ? `${i18?.NEW?.HEIGHT_LESS_ERROR || "Height can't be less than"} ${
                    MyParcelsDetails?.parcel?.height || "N/A"
                  }`
                : "Maximum Height"
            }
            onChange={(e) => {
              setHeight(e.target.value);
              setPacelData("height", e.target.value);
              if (Suggestion_id !== null) {
                handleChange(e);
              }
            }}
            autoFocus
            id="height-input"
            labelId="height-input"
            error={error}
            value={height}
          />
          {metrics ? (
            <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
              {metrics}
            </div>
          ) : (
            <select
              value={weightT}
              className="border border-[#D9D9D9] bg-[#D9D9D9] p-1  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer"
              onChange={(e) => {
                setheightType(e.target.value);
                setPacelData("heightType", e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                <em>{i18?.NEW?.SELECT || "Select"}</em>
              </option>
              <option value="Meters">
                {i18?.NEW?.CENTI_METER || "Centi-Meter"}
              </option>
              <option value="Inches">{i18?.NEW?.INCH || "Inch"}</option>
            </select>
          )}
        </div>
        {error && (
          <p className="text-[#F72C5B] mt-[10px]">{`${
            pathname === "/chooseparcel/"
              ? i18?.NEW?.HEIGHT_GREATER_ERROR || "Height can't be greater than" + " " + MyTripsDetails?.maxHeight
              : i18?.NEW?.HEIGHT_LESS_ERROR || "Height can't be less than" + " " + MyParcelsDetails?.parcel?.height
          }`}</p>
        )}
      </div>
    </div>
  );
}
