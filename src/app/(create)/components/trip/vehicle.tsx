import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import PageContext from "@/app/providers/pagecontext";
import { usePathname, useSearchParams } from "next/navigation";
import ParcelStore from "@/app/store/parcel";

export default function Capacity() {
  const { i18 } = useContext(PageContext);
  const pathname = usePathname();
  const { MyParcelsDetails }: any = ParcelStore();
  const { setPacelData, Parceldata } = StoreParcel();
  const params = useSearchParams();
  const Suggestion_id = params.get("id");
  const { setDisable }: any = useFormContext();
  const [capacityT, setcapacityT] = useState<string | any>("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if ((
      parseInt(newValue) <
      parseInt(pathname === "/choosetrip/" && MyParcelsDetails?.parcel?.weight)
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
    if (Parceldata?.VehicleCapacity) {
      setCapacity(Parceldata?.VehicleCapacity && Parceldata?.VehicleCapacity);
      setDisable(false);
    } else if (Parceldata?.VehicleCapacityType) {
      setcapacityT(
        Parceldata?.VehicleCapacityType && Parceldata?.VehicleCapacityType
      );
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full  p-5">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center">
        {i18?.NEW?.VEHICLE_CAPACITY_DETAILS ||
          "Specify the details about Vehicle capacity"}
      </h3>
      <div className=" w-full md:max-w-[600px]">
        <div className="relative">
          <LabeledInput
            autoFocus
          placeholder={
              Suggestion_id === null
                ? i18?.NEW?.VEHICLE_CAPACITY || "Vehicle Capacity"
                : pathname === "/choosetrip/"
                ? `${i18?.NEW?.CAPACITY_LESS_ERROR || "Capacity can't be less than"} ${
                    MyParcelsDetails?.parcel?.weight || "N/A"
                  }`
                : "Maximum capacity"
            }
            onChange={(e) => {
              setCapacity(e.target.value);
              setPacelData("VehicleCapacity", e.target.value);
              if (Suggestion_id !== null) {
                handleChange(e);
              }
            }}
            value={capacity}
            id={"Vehicle-Capacity"}
            labelId="Vehicle-Capacity"
          />
          <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-1 w-[14%] h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center justify-center cursor-pointer">
            {i18?.NEW?.KGS || "kgs"}
          </div>
          {/* <select
                        value={capacityT}
                        className="border border-[#D9D9D9] bg-[#D9D9D9] p-1 w-[14%] h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer"
                        onChange={(e) => {
                            setcapacityT(e.target.value);
                            setPacelData('VehicleCapacityType',e.target.value)
                        }}
                    >
                        <option value="" disabled selected hidden>
                            <em>Select</em>
                        </option>
                        <option value="Meters">Kgs</option>
                    </select> */}
        </div>
        {error && (
          <p className="text-[#F72C5B] mt-[10px]">{`${
            pathname === "/choosetrip/"
              ? i18?.NEW?.CAPACITY_LESS_ERROR || "Capacity can't be less than" + " " + MyParcelsDetails?.parcel?.length :""
          }`}</p>
        )}
      </div>
    </div>
  );
}
