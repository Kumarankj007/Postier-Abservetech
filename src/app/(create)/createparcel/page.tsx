'use client'
import Store from "@/app/store/store";
import Instructions from "../components/parcel/instruction";

import { useFormContext } from "../FormCotext";
import PickupLocation from "../components/parcel/pickuplocation";
import DropLocation from "../components/parcel/droplocation";
import ParcelTypes from "../components/parcel/parceltype";
import DateTime from "../components/parcel/pickuptime";
import DropDateTime from "../components/parcel/droptime";
import Category from "../components/parcel/parcelCategory";
import Width from "../components/parcel/width";
import Height from "../components/parcel/height";
import ParcelImage from "../components/parcel/parcelimages";
import Summary from "../components/parcel/summary";
import Length from "../components/parcel/length";
import Weight from "../components/parcel/weight";
import Price from "../components/parcel/price";
import Describtion from "../components/parcel/describtion";
import LoaderScript from "@/app/component/loadingscript";
import Averageprice from "../components/parcel/averageprice";
import Estimation from "../components/parcel/estimation";

export default function CreateParcel() {
    const { step } = useFormContext()
    return (
        <div className="h-full ">
            <LoaderScript>
                {
                    step === 0 && <Instructions />

                    // step === 0 && <Estimation />
                }
                {
                    step === 1 && <PickupLocation />
                }
                {
                    step === 2 && <DropLocation />
                }
                {
                    step === 3 && <ParcelTypes />
                }
                {
                    step === 4 && <DateTime />
                }
                {
                    step === 5 && <DropDateTime />
                }
                {
                    step === 6 && <Category />
                }
                {
                    step === 7 && <Width />
                }
                {
                    step === 8 && <Height />
                }
                {
                    step === 9 && <Length />
                }
                {
                    step === 10 && <Weight />
                }
                {
                    step === 11 && <Averageprice />
                }
                 {
                    step === 12 && <Estimation />
                }
                {/* {
                    step === 13 && <Price />
                } */}
                {
                    step === 13 && <ParcelImage />
                }
                {
                    step === 14 && <Describtion />
                }
                {
                    step === 15 && <Summary />
                }
            </LoaderScript>
        </div>
    )
}