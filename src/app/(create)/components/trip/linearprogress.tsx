"use client";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Utils from "@/app/store/utils";
import { useContext, useEffect } from "react";
import StoreParcel from "@/app/store/store-parcel";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import PageContext from "@/app/providers/pagecontext";

export default function LinearProgressBar({ Price, instruction = false }: any) {
  const { Parceldata } = StoreParcel();
  const { i18 } = useContext(PageContext);
  const { FetchEstimationTrip, EstimationTrip } = Utils();
  const DimentionalMetric = Parceldata?.widthType
    ? Parceldata.widthType.toUpperCase()
    : "";

  const color = Price
    ? Price < EstimationTrip?.minPrice
      ? "#FF8205"
      : Price >= EstimationTrip?.minPrice && Price < EstimationTrip?.avgFare
      ? "#FF8205"
      : Price >= EstimationTrip?.avgFare && Price <= EstimationTrip?.maxPrice
      ? "#00FF62"
      : Price > EstimationTrip?.maxPrice
      ? "#FF0000"
      : null
    : "#D9D9D9";

  const Value: any = Price
    ? Price < EstimationTrip?.minPrice
      ? 20
      : Price >= EstimationTrip?.minPrice && Price <= EstimationTrip?.avgFare
      ? 40
      : Price > EstimationTrip?.avgFare && Price <= EstimationTrip?.maxPrice
      ? 60
      : Price > EstimationTrip?.maxPrice
      ? 80
      : Price
    : "0";

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#D9D9D9",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 999,
      backgroundColor: instruction ? "#407BFF" : color,
    },
  }));
  // console.log("Parceldata", EstimationTrip);
  // useEffect(() => {
  //   if (!instruction) {
  //     FetchEstimationTrip({
  //       capacity: Parceldata.VehicleCapacity,
  //       vehicleId: Parceldata.vehicleId,
  //       routeId: Parceldata.wayPointId,
  //       metrics: {
  //         distanceMetric: "KILOMETER",
  //         timeMetric: "MINUTE",
  //         dimensionalMetric: DimentionalMetric,
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return Price == 0 || (Price && Price < 100) ? (
    <div className="md:m-5 m-3 min-h-3 relative flex items-center lg:p-0 p-2">
      <>
        {instruction ? (
          <div
            className={` absolute inset-0 size-full top-0 left-0 rounded-full shadow-md overflow-hidden `}
          >
            <div 
    style={{ width: `${Price ?? 25}%` }} className="absolute left-0 top-0 h-full bg-[#407BFF]"></div>
          </div>
        ) : (
          <BorderLinearProgress
            variant="determinate"
            value={Price <= 25 ? 25 : Price}
            className=" absolute inset-0 size-full top-0 left-0 rounded-full shadow-md overflow-hidden -z-10"
          />
        )}
        {instruction && (
          <>
            <div style={{ width: `${Price ?? 25}%` }} className={`min-w-[25%] px-5`}>
              <span
                className={
                  (Price == 0 ? "" : "text-white") +
                  ` block md:text-base text-sm font-bold drop-shadow-md ${
                    Price < 20 ? "lg:text-start" : "lg:text-end"
                  } px-3 h-full p-1`
                }
              >
                {i18?.PROFILE_COMPLETION || "Profile Completion:"}{" "}
                {instruction ? Price : Value}%
              </span>
            </div>
            <Link
              href="/accountsettings/profileDetails/"
              className={`w-[${100 - Price}%]` + "ml-auto underline text-center md:text-base text-sm font-bold drop-shadow-md"}
            >
              {i18?.COMPLETE_YOUR_PROFILE ||
                "Complete your profile to unlock full access"}
            </Link>
          </>
        )}
      </>
    </div>
  ) : null;
}
