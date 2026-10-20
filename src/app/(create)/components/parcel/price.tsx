import LabeledInput from "@/app/component/input";
import StoreParcel from "@/app/store/store-parcel";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import LinearProgressBar from "./linearprogress";
import Utils from "@/app/store/utils";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "@/app/component/threedotloader";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import { usePathname } from "next/navigation";
import ContentTooptip from "@/app/component/contentTooptip";
import { PriceContent } from "@/app/(profileDetails)/accountsettings/content";

export default function Price() {
  const path = usePathname();
  const { setPacelData, Parceldata } = StoreParcel();
  const { loading } = useLoaderStore();
  const { i18 } = useContext(PageContext);
  const { Estimation } = Utils();
  const { MyTripsDetails }: any = ParcelStore();
  const { setDisable }: any = useFormContext();
  const [PriceT, setPriceT] = useState<string | any>("");
  const [Price, setPrice] = useState("");

  useLayoutEffect(() => {
    if (Parceldata?.fare) {
      setPrice(Parceldata?.fare && Parceldata?.fare);
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
    if (Estimation.avgPrice) {
      setPrice(Estimation?.avgPrice);
      setPacelData("fare", Estimation?.avgPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Estimation]);
  // console.log("MyTripsDetails", MyTripsDetails);
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full px-[20px]">
      <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center leading-[37px] md:leading-[65px]">
        {i18?.NEW?.AVERAGEPRICEFORPARCEL ||
          "Average price for sending your parcel to destination"}
      </h3>
      <div className=" w-full md:max-w-[600px] flex flex-col gap-[40px]">
        {loading ? (
          <ThreeDotLoader />
        ) : (
          <div className="relative">
            <LabeledInput
              // disabled={MyTripsDetails?.instantBooking === "active"}
              placeholder={i18?.NEW?.PRICE || "Price"}
              labelId="price-input"
              id="price-input"
              onChange={(e) => {
                setPrice(e.target.value);
                setPacelData("fare", e.target.value);
              }}
              value={Price}
              // value={
              //   path === "/createparcel/"
              //     ? Price
              //     : MyTripsDetails?.instantBooking === "inactive" &&
              //       MyTripsDetails?.avgPrice
              // }
            />
            <div className="border border-[#D9D9D9] bg-[#D9D9D9] p-3  h-[60%] rounded-full outline-none absolute inset-y-0 right-3 top-[11px] flex items-center cursor-pointer justify-center ">
              USD
            </div>
          </div>
        )}
        {path === "/createparcel/" ? (
          <LinearProgressBar Price={Price} />
        ) : (
          MyTripsDetails?.instantBooking === "inactive" && (
            <LinearProgressBar Price={Price} />
          )
        )}
      </div>
      <p className="text-[16px] font-[500] max-w-[450px] leading-[31px] text-center">
        {i18?.NEW?.AVERAGEPRICECONTENT ||
          "The average price for sending your parcel is based on factors like distance, weight, size, and urgency."}
        <span className="inline-flex">
          <ContentTooptip value={PriceContent()} />
        </span>
      </p>
    </div>
  );
}
