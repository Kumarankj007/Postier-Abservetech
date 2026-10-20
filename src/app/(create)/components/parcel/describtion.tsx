import StoreParcel from "@/app/store/store-parcel";
import React, { useContext, useLayoutEffect } from "react";
import { useFormContext } from "../../FormCotext";
import { useParams, usePathname } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";

function Describtion() {
  const { i18 } = useContext(PageContext);
  const params = usePathname();
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  useLayoutEffect(() => {
    if (Parceldata?.desc) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);
  // console.log("params", params);
  const noteLabel =
    params === "/createtrip/" || params === "/choosetrip/"
      ? i18?.NEW?.NOTE_TRIP_PLACEHOLDER || "Type a note about trip"
      : i18?.NEW?.NOTE_PARCEL_PLACEHOLDER || "Type a note about parcel";

  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      {params === "/createtrip/" || params === "/choosetrip/" ? (
        <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[490px] text-center leading-[37px] md:leading-[65px]">
          {i18?.NEW?.NOTE_TRIP_TITLE || "Enter A Note About Your Trip"}
        </h3>
      ) : (
        <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[490px] text-center leading-[37px] md:leading-[65px]">
          {i18?.NEW?.NOTE_PARCEL_TITLE || "Enter A Note About Your Parcel"}
        </h3>
      )}

      <textarea
        value={Parceldata?.desc}
        onChange={(e) => setPacelData("desc", e.target.value)}
        aria-label={noteLabel}
        placeholder={noteLabel}
        className="p-4 border border-btncolor rounded-[7px] h-[200px] w-full md:w-[600px] "
      />
    </div>
  );
}

export default Describtion;
