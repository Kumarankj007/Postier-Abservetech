"use client";
import { useFormContext } from "../FormCotext";
import Category from "../components/parcel/parcelCategory";
import Width from "../components/parcel/width";
import Height from "../components/parcel/height";
import ParcelImage from "../components/parcel/parcelimages";
import Summary from "../components/parcel/summary";
import Length from "../components/parcel/length";
import Weight from "../components/parcel/weight";
import Price from "../components/parcel/price";
import Describtion from "../components/parcel/describtion";
import Instructions from "./instruction";
import LoaderScript from "@/app/component/loadingscript";
import AveragepriceWrapper from "../components/parcel/averageprice";
import Estimation from "../components/parcel/estimation";

export default function CreateParcel() {
  const { step } = useFormContext();
  return (
    <div className="h-full ">
      {step === 0 && (
        <LoaderScript>
          <Instructions />
        </LoaderScript>
      )}
      {step === 1 && <Category />}
      {step === 2 && <Width />}
      {step === 3 && <Height />}
      {step === 4 && <Length />}
      {step === 5 && <Weight />}
      {step === 6 && <AveragepriceWrapper />}
      {step === 7 && <Estimation />}
      {step === 8 && <ParcelImage />}
      {step === 9 && <Describtion />}
      {step === 10 && <Summary />}
    </div>
  );
}
