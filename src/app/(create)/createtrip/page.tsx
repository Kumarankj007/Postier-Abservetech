"use client";
import LoaderScript from "@/app/component/loadingscript";
import Describtion from "../components/parcel/describtion";
import DropLocation from "../components/parcel/droplocation";
import DropDateTime from "../components/parcel/droptime";
import Height from "../components/parcel/height";
import Instructions from "../components/parcel/instruction";
import Length from "../components/parcel/length";
import Category from "../components/parcel/parcelCategory";
import ParcelTypes from "../components/parcel/parceltype";
import PickupLocation from "../components/parcel/pickuplocation";
import DateTime from "../components/parcel/pickuptime";
import Summary from "../components/parcel/summary";
import Weight from "../components/parcel/weight";
import Width from "../components/parcel/width";
import InstantBooking from "../components/trip/instantBooking";
import Price from "../components/trip/price";
import Routes from "../components/trip/routes";
import StopPoint from "../components/trip/stoppoint.";
import TransportationType from "../components/trip/transporttype";
import Capacity from "../components/trip/vehicle";
import { useFormContext } from "../FormCotext";
import { useEffect } from "react";
import AveragepriceWrapper from "../components/parcel/averageprice";
import EstimationWrapper from "../components/parcel/estimation";
import StoreParcel from "@/app/store/store-parcel";

export default function CreateParcel() {
  const { step, setStep } = useFormContext();
  const { Parceldata } = StoreParcel();

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step")
    // console.log(stepParam, 'currentParams')
    if (stepParam !== null && !isNaN(Number(stepParam)) && Object.keys(Parceldata).length > 0) {
      setStep(Number(stepParam));
    }
  }, [setStep])

  return (
    <div className="h-full">
      <LoaderScript>
        {step === 0 && <Instructions type="trip" />}
        {step === 1 && <PickupLocation />}
        {step === 2 && <DropLocation />}
        {step === 3 && <Routes />}
        {step === 4 && <StopPoint />}
        {step === 5 && <ParcelTypes />}
        {step === 6 && <DateTime type="trip" />}
        {step === 7 && <DropDateTime type="trip" />}
        {step === 8 && <Category type="trip" />}

        {step === 9 && <TransportationType step={step} />}
        {/* {step === 10 && <Capacity />} */}
        {step === 10 && <Weight />}
        {step === 11 && <Width type="trip" />}
        {step === 12 && <Height />}
        {step === 13 && <Length />}
        {step === 14 && <AveragepriceWrapper type="trip" />}
        {step === 15 && <EstimationWrapper type="trip" />}
        {step === 16 && <InstantBooking />}
        {step === 17 && <Describtion />}
        {step === 18 && <Summary />}
      </LoaderScript>
    </div>
  );
}
