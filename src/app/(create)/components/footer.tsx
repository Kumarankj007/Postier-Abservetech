"use client";
import Button from "@/app/component/button";
import ProgressBar from "./progressbar";
import { useFormContext } from "../FormCotext";
import Store from "@/app/store/store";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import StoreParcel from "@/app/store/store-parcel";
import { useContext } from "react";
import { useLinearProgressContinue } from "@/app/(create)/components/parcel/linearprogress";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import useLoaderStore from "@/app/hooks/loader";

export default function Footer() {
  const { i18 } = useContext(PageContext);
  const param = usePathname();
  const { loading } = useLoaderStore();
  const searchparams = useSearchParams();
  const { MyTripsDetails }: any = ParcelStore();
  const Suggestion_id = searchparams.get("id");
  const { disable, step, handleSave, handleBack, setDisable } =
    useFormContext();
  const { setPacelData, Parceldata } = StoreParcel();
  const { setModal } = Store();
  let path = window.location.pathname.replace(/\/$/, ""); // remove trailing slash
  const search = window.location.search.trim();
  const separator = search ? "&" : "?";
  const redirectUrl = encodeURIComponent(
    `${path}${search + "&" || "?"}step=${step}`
  );
  // console.log(`${path}${search+"&" || "?"}step=${step}`,  "redirectUrl")
  // Get price from Parceldata or context (adjust as needed)
  const price = Parceldata?.fare || 0;
  // console.log("Parceldata", Parceldata);
  const getpricestorage = localStorage.getItem("price");
  const continueEstimation = useLinearProgressContinue(
    getpricestorage ? Number(getpricestorage) : price
  );
  const handleNext = async () => {
    setDisable(true);
    if (
      (param === "/createparcel/" && step === 11) ||
      (param === "/createtrip/" && step === 14) ||
      (param === "/chooseparcel/" && step === 6) ||
      (param === "/choosetrip/" && step === 9)
    ) {
      try {
        // debugger
        const response = await continueEstimation(); // Await API for estimation
        // console.log("footer response", response);
      } catch (e) {
        console.error("Estimation API error", e);
      }
    }

    handleSave();
  };
  const handlePrev = () => {
    handleBack();
  };
  const laststep = param === "/createtrip/" ? 18 : 15;
  const laststep2 = param === "/chooseparcel/" ? 10 : 13;
  // console.log('Parceldata', Parceldata)
  // console.log('MyTripsDetails', MyTripsDetails)
  return (
    <div className="w-full fixed bg-[#fff]">
      <ProgressBar next={step} />
      <div
        className={`p-[20px] flex ${
          step === 0 ? "justify-end" : "justify-between"
        }`}
      >
        {step !== 0 && (
          <div className="flex items-center">
            <Button
              onClick={handlePrev}
              className="text-btncolor underline text-center text-[17px] font-[500]"
            >
              {i18?.NEW?.BACK || "Back"}
            </Button>
          </div>
        )}

        <div>
          {step === (Suggestion_id === null ? laststep : laststep2) ? (
            <div className="flex gap-4">
              {Suggestion_id === null && (
                <Button
                  disabled={loading}
                  // onClick={handleNext}
                  onClick={() =>
                    param === "/createtrip/" || param === "/choosetrip/"
                      ? setModal("publishTripmodal", { type: "Schedule" })
                      : setModal("publishmodal", { type: "Schedule" })
                  }
                  className={` rounded-full py-3 px-5 border-2 border-btncolor text-btncolor text-[17px] font-[500]`}
                >
                  {i18?.NEW?.SCHEDULE || "Schedule"}
                </Button>
              )}

              <Button
                disabled={loading}
                onClick={() =>
                  param === "/createtrip/" || param === "/choosetrip/"
                    ? setModal("publishTripmodal", {
                        type: "publish",
                        redirectUrl: redirectUrl,
                      })
                    : setModal("publishmodal", {
                        type: "publish",
                        redirectUrl: redirectUrl,
                      })
                }
                className={`rounded-full py-3 px-5  bg-btncolor text-[#fff] text-[17px] font-[500]`}
              >
                {Suggestion_id === null
                  ? i18?.NEW?.PUBLISH || "Publish"
                  : i18?.NEW?.PUBLISH_REQUEST || "Publish & Request"}
              </Button>
            </div>
          ) : (
            <Button
              disabled={disable}
              onClick={handleNext}
              className={`rounded-full py-3 px-5 ${
                disable ? "bg-gray-500 text-[#000]" : "bg-btncolor text-[#fff]"
              }  text-[#fff] text-[17px] font-[500]`}
            >
              {step !== 0
                ? i18?.NEW?.CONTINUE || "Continue"
                : i18?.NEW?.GETSTARTED || "Get Started"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
