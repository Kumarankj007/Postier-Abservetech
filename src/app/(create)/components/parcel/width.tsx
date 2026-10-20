import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import { usePathname, useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";

export default function Width({ type }: any) {
  const pathname = usePathname();
  const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore();
  const { i18 } = useContext(PageContext);
  const params = useSearchParams();
  const Suggestion_id = params.get("id");
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const [weightT, setwidthType] = useState<string | any>("Centi-Meter");
  const [width, setWidth] = useState("");
  const [error, setError] = useState(false);

  // console.log(MyParcelsDetails, 'MyParcelsDetails')
  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (
      (parseInt(newValue) >
      parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxWidth)) || (
      parseInt(newValue) <
      parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.width)
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
    const resolvedDimensionType =
      Parceldata?.dimensionType !== undefined
        ? Parceldata?.dimensionType
        : pathname === "/chooseparcel/"
        ? MyTripsDetails?.dimensionType
        : MyParcelsDetails?.parcel?.dimensionType;
    if (Parceldata?.width && resolvedDimensionType) {
      setWidth(Parceldata.width);
      setwidthType(resolvedDimensionType);

      if (Suggestion_id !== null) {

        if ((parseInt(Parceldata?.width) >
          parseInt(pathname === "/chooseparcel/" && MyTripsDetails?.maxWidth)) || (
      parseInt(Parceldata?.width) <
      parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.width)
    )) {
          setError(true);
        } else {
          setError(false); // Uncommented to reset error state
        }
      }else {
      setDisable(false);
      }
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);

  useEffect(() => {
    // debugger;
    if (type === "trip" || pathname === "/chooseparcel/") {
      setPacelData(
        "dimensionType",
        MyTripsDetails?.dimensionType && MyTripsDetails?.dimensionType
      );
    } else {
      setPacelData(
        "dimensionType",
        MyParcelsDetails?.parcel?.dimensionType &&
          MyParcelsDetails?.parcel?.dimensionType
      );
    }
    setPacelData("dimensionType", "Centi-Meter");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyTripsDetails]);

  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {pathname === "/createparcel/" || pathname === "/chooseparcel/"
          ? i18?.NEW?.PROVIDEPARCELWIDTH ||
            "Please provide the parcel width details"
          : i18?.NEW?.SPECIFYMAXWIDTHPERPARCEL ||
            "Specify your maximum width per parcel"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <div className="relative">
          <LabeledInput
            placeholder={
              Suggestion_id === null
                ? "Parcel Width"
                : pathname === "/chooseparcel/"
                ? `${i18?.NEW?.WIDTH_GREATER_ERROR || "Width can't be greater than"} ${
                    MyTripsDetails?.maxWidth || "N/A"
                  }`: pathname === "/choosetrip/"
                ? `${i18?.NEW?.WIDTH_LESS_ERROR || "Width can't be less than"} ${
                    MyParcelsDetails?.parcel?.width || "N/A"
                  }`
                : "Maximum Width"
            }
            error={error}
            onChange={(e) => {
              setWidth(e.target.value);
              setPacelData("width", e.target.value);
              if (Suggestion_id !== null) {
                handleChange(e);
              }
            }}
            autoFocus
            value={width}
            type="number"
            id={"width-input"}
            labelId="width-input"
          />
          {Suggestion_id === null ? (
            <div className="border border-[#D9D9D9] overflow-hidden bg-[#D9D9D9] pr-2 h-[60%] rounded-full focus-visible:outline-0 absolute right-3 top-[11px] cursor-pointer ">
            <select
              value={weightT}
              disabled
              className="appearance-none w-full h-full px-2 bg-transparent focus-visible:outline-0 border-0 rounded-full"
              onChange={(e) => {
                setwidthType(e.target.value);
                setPacelData("widthType", e.target.value);
                setPacelData("dimensionType", e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                <em>{i18?.NEW?.SELECT || "Select"}</em>
              </option>
              <option value="Centi-Meter">
                {i18?.NEW?.CENTI_METER || "Centi-Meter"}
              </option>
              <option value="Inch">{i18?.NEW?.INCH || "Inch"}</option>
            </select>
            </div>
          ) : pathname === "/chooseparcel/" || pathname === "/choosetrip/" ? (
            <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
              {pathname === "/chooseparcel/"
                ? MyTripsDetails?.dimensionType
                : MyParcelsDetails?.parcel?.dimensionType}
            </div>
          ) : (
            <select
              value={weightT}
              className="border border-[#D9D9D9] bg-[#D9D9D9] p-1 text-center  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer "
              onChange={(e) => {
                setwidthType(e.target.value);
                setPacelData("widthType", e.target.value);
                setPacelData("dimensionType", e.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                <em>{i18?.NEW?.SELECT || "Select"}</em>
              </option>
              <option value="Centi-Meter">
                {i18?.NEW?.CENTI_METER || "Centi-Meter"}
              </option>
              <option value="Inch" className="text-center">{i18?.NEW?.INCH || "Inch"}</option>
            </select>
          )}
        </div>
        {error && (
          <p className="text-[#F72C5B] mt-[10px]">{`${
            pathname === "/chooseparcel/"
              ? i18?.NEW?.WIDTH_GREATER_ERROR || "Width can't be greater than" + " " + MyTripsDetails?.maxWidth
              : i18?.NEW?.WIDTH_LESS_ERROR || "Width can't be less than" + " " + MyParcelsDetails?.parcel?.width
          }`}</p>
        )}
      </div>
    </div>
  );
}
