'use client'
import LoaderScript from "@/app/component/loadingscript"
import Describtion from "../components/parcel/describtion"
import Height from "../components/parcel/height"
import Length from "../components/parcel/length"
import Category from "../components/parcel/parcelCategory"
import Summary from "../components/parcel/summary"
import Weight from "../components/parcel/weight"
import Width from "../components/parcel/width"
import InstantBooking from "../components/trip/instantBooking"
import Routes from "../components/trip/routes"
import StopPoint from "../components/trip/stoppoint."
import TransportationType from "../components/trip/transporttype"
import { useFormContext } from "../FormCotext"
import Instructions from "../chooseparcel/instruction"
import { useEffect } from "react"
import AveragepriceWrapper from "../components/parcel/averageprice"
import EstimationWrapper from "../components/parcel/estimation"
import StoreParcel from "@/app/store/store-parcel"

export default function CreateParcel() {
  const { step, setStep } = useFormContext();
  const { Parceldata } = StoreParcel();
  // console.log("step", step);

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
                {
                    step === 0 && <Instructions type='trip' />
                }
                {
                    step === 1 && <Routes />
                }
                {
                    step === 2 && <StopPoint />
                }
                {
                    step === 3 && <Category />
                }
                {
                    step === 4 && <TransportationType step={step} />
                }
                {/* {
                    step === 5 && <Capacity />
                } */}
                {
                    step === 5 && <Weight />
                }
                {
                    step === 6 && <Width type={"trip"} />
                }
                {
                    step === 7 && <Height />
                }
                {
                    step === 8 && <Length />
                }
                {
                    step === 9 && <AveragepriceWrapper type="trip" />
                }
                {step === 10 && <EstimationWrapper type="trip" />}
                {
                    step === 11 && <InstantBooking />
                }
                {
                    step === 12 && <Describtion />
                }
                {
                    step === 13 && <Summary />
                }
            </LoaderScript>
        </div>
    )
}