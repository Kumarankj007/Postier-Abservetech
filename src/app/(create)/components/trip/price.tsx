import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import LinearProgressBar from "./linearprogress";
import Utils from "@/app/store/utils";
import ThreeDotLoader from "@/app/component/threedotloader";
import useLoaderStore from "@/app/hooks/loader";
import PageContext from "@/app/providers/pagecontext";

export default function Price({ type }: any) {
  const { i18 } = useContext(PageContext);
  const { setPacelData, Parceldata } = StoreParcel();
  const { setDisable }: any = useFormContext();
  const { EstimationTrip } = Utils();
  const [PriceT, setPriceT] = useState<string | any>("");
  const [Price, setPrice] = useState("");
  const { loading } = useLoaderStore();

  useLayoutEffect(() => {
    if (Parceldata?.Price) {
      setPrice(Parceldata?.Price && Parceldata?.Price);
      setDisable(false);
    } else if (Parceldata?.PriceType) {
      setPriceT(Parceldata?.PriceType && Parceldata?.PriceType);
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Parceldata]);
  useEffect(() => {
    if (EstimationTrip.avgFare) setPrice(EstimationTrip?.avgFare);
    setPacelData("Price", EstimationTrip && EstimationTrip.avgFare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EstimationTrip]);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full  p-5">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center">
        {type === "trip"
          ? i18?.NEW?.AVERAGE_PRICE2 ||
            "Estimated total price you could achieve for deliveries with Full Booker"
          : i18?.NEW?.AVERAGE_PRICE ||
            "Average price for sending your parcel to destination"}
      </h3>
      <div className=" w-full md:max-w-[600px] flex flex-col gap-[40px]">
        {loading ? (
          <ThreeDotLoader />
        ) : (
          <div className="relative">
            <>
              <LabeledInput
                placeholder={i18?.NEW?.PRICE || "Price"}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setPacelData("Price", e.target.value);
                }}
                value={Price}
                id="price-input"
                labelId="price-input"
              />

              <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
                USD
              </div>
            </>
          </div>
        )}
        <LinearProgressBar Price={Price} />
      </div>
    </div>
  );
}
