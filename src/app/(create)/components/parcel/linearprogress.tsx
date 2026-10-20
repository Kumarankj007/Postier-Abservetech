import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Utils from "@/app/store/utils";
import { useEffect } from "react";
import StoreParcel from "@/app/store/store-parcel";
import {
  EstimationProvider,
  useEstimation,
} from "@/app/providers/estimationcontext";
import { usePrice } from "@/app/providers/pricecontext";

function LinearProgressBar(props: any) {
  // Get price from Zustand store if not provided as prop
  const priceContext = usePrice();
  const storePrice = priceContext?.price ?? 0;
  const price = typeof props.price === "number" ? props.price : storePrice;

  const { Parceldata } = StoreParcel();
  const { setEstimation } = useEstimation();
  const { FetchEstimation, Estimation } = Utils();

  const DimentionalMetric = Parceldata?.widthType
    ? Parceldata.widthType.toUpperCase()
    : "";

  const color =
    price < Estimation?.minprice
      ? "#F5A623" // orange before min
      : price >= 0.1 && price < 0.15
      ? "#43A047" // green for 0.10 to 0.14
      : price >= Estimation?.minprice && price < 0.1
      ? "#f52323" // red before green
      : price >= 0.15
      ? "#f52323" // red for 0.15 and above
      : price > Estimation?.maxprice
      ? "#f52323" // red above max
      : "#F5A623";

  const min = Estimation?.minprice ?? 0.01;
  const max = Estimation?.maxprice ?? 1.0;
  // const percent = price ? Math.max(0, Math.min(100, ((price - min) / (max - min)) * 100)) : 0;
  const percent =
    price >= 0.8 ? 100 : price >= 0.15 ? 75 : price >= 0.1 ? 50 : 25;

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#D9D9D9",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: color,
    },
  }));
  // console.log('Parceldata11', price, Estimation)

  useEffect(() => {
    if (Estimation) {
      // console.log("Estimationstore", Estimation);
      // localStorage.setItem('estimation', JSON.stringify(Estimation));
    }
  }, [Estimation, price]);

  return (
    <>
      <BorderLinearProgress
        variant="determinate"
        value={percent}
        sx={{ maxWidth: 600, width: "100%" }}
      />
    </>
  );
}

// Export the handler for use in a parent/footer if needed
export function useLinearProgressContinue(price: number) {
  // console.log("useLinearProgressContinue", price);
  // const roundedPrice = Number(price.toFixed(2));
  const { Parceldata } = StoreParcel();

  // console.log("ParceldatauseLinearProgressContinue", Parceldata);
  const { FetchEstimation, Estimation, FetchEstimationTrip } = Utils();
  // console.log("Estimationlinear", Estimation);
  // const getpricestorage = localStorage.getItem('price');
  // console.log("getpricestoragelinear", getpricestorage,roundedPrice);
  const DimentionalMetric = Parceldata?.widthType
    ? Parceldata.widthType.toUpperCase()
    : "";

  const categoryNames = Array.isArray(Parceldata.category)
    ? Parceldata.category.map((item: any) => item.name)
    : [];

  const categoryNamesString = categoryNames.join(", ");

  return async () => {
    if (price) {
      const estData = {
        width: Parceldata.width,
        height: Parceldata.height,
        length: Parceldata.length,
        weight: Parceldata.weight,
        pickupLat: Parceldata.pickupLat,
        pickupLng: Parceldata.pickupLng,
        dropLat: Parceldata.dropLat,
        dropLng: Parceldata.dropLng,
        metric: {
          distanceMetri: "KILOMETER",
          timeMetric: "MINUTE",
          dimensionalMetric: "CM",
        },
        distanceCostFactor: price,
        urgencyLevel:
          Parceldata.deliveryType === "Express Delivery"
            ? "sameDay"
            : Parceldata.deliveryType === "Schedule Delivery"
            ? "express"
            : "standard",
        parcelType:
          categoryNamesString === "Fragile"
            ? "fragile"
            : categoryNamesString === "Electronics"
            ? "fragile"
            : categoryNamesString === "Food Items"
            ? "temparatureSensitive"
            : categoryNamesString === "Kitchen Appliances"
            ? "oversized"
            : "standardParcel",
      };
      // console.log(estData, "estData")
      const response = Parceldata.vehicleId
        ? await FetchEstimationTrip({
            ...estData,
            capacity: Parceldata.VehicleCapacity,
            vehicleId: Parceldata.vehicleId,
            routeId: Parceldata.wayPointId,
          })
        : await FetchEstimation(estData);

      // console.log("FetchEstimation", response);
      if (response) {
        localStorage.setItem('estimationnew', JSON.stringify(response));
      }
      return response;

      // return null;
    }
  };
}

// Wrap the component with EstimationProvider if not already done in a parent layout
export default function LinearProgressBarWrapper(props: any) {
  return (
    <EstimationProvider>
      <LinearProgressBar {...props} onContinue={props.onContinue} />
    </EstimationProvider>
  );
}
