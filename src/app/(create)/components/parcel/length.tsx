import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import { usePathname, useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";

export default function Length() {
  const pathname = usePathname();
  const { i18 } = useContext(PageContext);
  const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore();
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const [lengthT, setlengthType] = useState<string | any>("");
  const [length, setHeight] = useState("");
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
      parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxLength)) || (
      parseInt(newValue) <
      parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.length)
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
    if (Parceldata?.length && metrics) {
      setlengthType(metrics && metrics);
      setHeight(Parceldata?.length && Parceldata?.length);
      // setDisable(false);
      if (Suggestion_id !== null) {
        if (
          parseInt(Parceldata?.length) >
          parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxLength)
        ) {
          setError(true);
        } else if (
          parseInt(Parceldata?.length) <
          parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.length)
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
  }, [Parceldata]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {pathname === "/createparcel/" || pathname === "/chooseparcel/"
          ? i18?.NEW?.PROVIDEPARCELLENGTH ||
            "Please provide the parcel length details"
          : i18?.NEW?.SPECIFYMAXLENGTHPERPARCEL ||
            "Specify your maximum length per parcel"}{" "}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <div className="relative">
          <LabeledInput
            placeholder={
              Suggestion_id === null
                ? "Parcel Length"
                : pathname === "/chooseparcel/"
                ? `${i18?.NEW?.LENGTH_GREATER_ERROR || "Length can't be greater than"} ${
                    MyTripsDetails?.maxLength || "N/A"
                  }`: pathname === "/choosetrip/"
                ? `${i18?.NEW?.LENGTH_LESS_ERROR || "Height can't be less than"} ${
                    MyParcelsDetails?.parcel?.length || "N/A"
                  }`
                : "Maximum Length"
            }
            onChange={(e) => {
              setHeight(e.target.value);
              setPacelData("length", e.target.value);
              if (Suggestion_id !== null) {
                handleChange(e);
              }
            }}
            autoFocus
            error={error}
            value={length}
            id="length-input"
            labelId="length-input"
          />
          {metrics ? (
            <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
              {metrics}
            </div>
          ) : (
            <select
              value={lengthT}
              className="border border-[#D9D9D9] bg-[#D9D9D9] p-1 w-[14%] h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer"
              onChange={(e) => {
                setlengthType(e.target.value);
                setPacelData("lengthType", e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                <em>{i18?.NEW?.SELECT || "Select"}</em>
              </option>
              <option value="Meters">
                {i18?.NEW?.CENTI_METER || "Centi-Meter"}
              </option>
              <option value="Inch">{i18?.NEW?.INCH || "Inch"}</option>
            </select>
          )}
        </div>
        {error && (
          <p className="text-[#F72C5B] mt-[10px]">{`${
            pathname === "/chooseparcel/"
              ? i18?.NEW?.LENGTH_GREATER_ERROR || "Length can't be greater than" + " " + MyTripsDetails?.maxLength
              : i18?.NEW?.LENGTH_LESS_ERROR || "Length can't be less than" + " " + MyParcelsDetails?.parcel?.length
          }`}</p>
        )}
      </div>
    </div>
  );
}
