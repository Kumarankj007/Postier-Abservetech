import Button from "@/app/component/button";
import PageContext from "@/app/providers/pagecontext";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import { RequestFor, RequestForUpdate } from "@/app/tools/mutatefn/request";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import React, { useContext, useMemo } from "react";
import { CreateChannel } from "@/app/tools/mutatefn/chat";
import { priceFormat } from "@/utils";

function Request({ MyTripsDetails, Type, Suggestionid, isPaid }: any) {
  const User_id =
    typeof window !== "undefined" &&
    window.localStorage.getItem("appUserId") !== ""
      ? window.localStorage.getItem("appUserId")
      : null;
  const token =
    typeof window !== "undefined" && window.localStorage.getItem("appToken");
  const { i18 } = useContext(PageContext);
  const { setModal } = Store();
  const router = UseLoadingRouter();
  const params = useSearchParams();
  const path = usePathname();
  const Parcel_id: any = params.get("parcel_id") ? params.get("parcel_id") : "";
  const Trip_id: any = params.get("id") ? params.get("id") : "";
  const ApiStatus = params.get("apistatus") ? params.get("apistatus") : null;
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const REQ = useMutation({
    mutationFn: RequestForUpdate,
    onSuccess: (data: any) => {
      showSnackbar(data.message, "success");
      router.push(`/request/?id=${Parcel_id}&status=Accepted`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleRequest = (status: any) => {
    REQ.mutateAsync({
      Trip_id: MyTripsDetails?._id,
      Parcel_id: Parcel_id,
      data: { status: status },
    });
  };

  const handleUrl = () => {
    router.push(`/account/register/?auth=signup`);
  };

  const Channel = useMutation({
    mutationFn: CreateChannel,
    onSuccess: (data) => {
      router.push(`/message/${data?.data?.channel?._id}`);
    },
    onError: (data) => {
      showSnackbar(data.message, "error");
    },
  });
  const handleChannel = () => {
    const data: any = {};
    if (Trip_id) {
      data.tripId = Trip_id;
    }
    if (Parcel_id) {
      data.postId = Parcel_id;
    }
    Channel.mutateAsync(data);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start border border-1 border-btncolor  p-[30px] rounded-[20px] w-full  ">
        <div className="flex h-[240px] items-center justify-start w-full">
          <div className="border border-r-1 border-btncolor h-[170px] relative circle" />
          <div className=" h-[240px] flex flex-col justify-between ">
            <div className="flex flex-col ml-6">
              <div className="flex gap-2 items-center">
                <p className="text-[20px] font-[600] leading-[44px]  truncate">
                  {MyTripsDetails?.location?.pickUpCity ||
                    i18?.NEW?.DEFAULT_PICKUP_LOCATION ||
                    "Default Pickup Location"}
                </p>
                <Image
                  width={800}
                  height={800}
                  src="/svg/icon/map-pin.svg"
                  alt="img"
                  onClick={() =>
                    setModal("Mapmodal", {
                      lng: MyTripsDetails?.location?.startCoords
                        ?.coordinates[0],
                      lat: MyTripsDetails?.location?.startCoords
                        ?.coordinates[1],
                    })
                  }
                  className="w-[25px] h-[25px] cursor-pointer"
                />
              </div>
              <p className="text-[17px] font-[400] leading-[44px] max-w-[250px] truncate">
                {MyTripsDetails?.location?.pickUp ||
                  i18?.NEW?.DEFAULT_PICKUP_ADDRESS ||
                  "Default Pickup Address"}
              </p>
            </div>

            <div className="flex flex-col ml-6">
              <div className="flex gap-2 items-center">
                <p className="text-[20px] font-[600] leading-[44px] truncate">
                  {MyTripsDetails?.location?.dropCity ||
                    i18?.NEW?.DEFAULT_PICKUP_LOCATION ||
                    "Default Pickup Location"}
                </p>
                <Image
                  width={800}
                  height={800}
                  src="/svg/icon/map-pin.svg"
                  alt="img"
                  onClick={() =>
                    setModal("Mapmodal", {
                      lng: MyTripsDetails?.location?.endCoords?.coordinates[0],
                      lat: MyTripsDetails?.location?.endCoords?.coordinates[1],
                    })
                  }
                  className="w-[25px] h-[25px] cursor-pointer"
                />
              </div>
              <p className="text-[17px] font-[400] leading-[44px] max-w-[250px] truncate ">
                {MyTripsDetails?.location?.drop ||
                  i18?.NEW?.DEFAULT_PICKUP_ADDRESS ||
                  "Default Pickup Address"}
              </p>
            </div>
          </div>
        </div>
        <div className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
        <div className="flex flex-wrap gap-2 justify-start items-center w-full">
          <Image
            src={
              MyTripsDetails?.postier?.profile?.startsWith("http")
                ? MyTripsDetails?.postier?.profile
                : process.env.NEXT_PUBLIC_IMAGE_URL +
                  MyTripsDetails?.postier?.profile
            }
            alt="img"
            width={800}
            height={800}
            className="w-[90px] h-[90px] rounded-full"
          />
          <p className="text-[20px] font-[600] leading-[26px]">
            {MyTripsDetails?.postier?.fname} {MyTripsDetails?.postier?.lname}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
        <div className="flex flex-col gap-6 items-center w-full">
          <p className="font-[700] text-[30px] leading-[39px] text-center ">
            {priceFormat(
              Number(
                Type === "request"
                  ? MyTripsDetails?.request?.bidding[
                      MyTripsDetails?.request?.bidding.length - 1
                    ]?.amount
                  : MyTripsDetails?.avgPrice,
              ),
            )}
          </p>
          {Type === "request" ? (
            MyTripsDetails.instantBooking !== "active" &&
            MyTripsDetails?.request?.status !== "Accepted" &&
            MyTripsDetails?.request?.bidding[
              MyTripsDetails?.request?.bidding.length - 1
            ]?.userId !== User_id ? (
              <p
                className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer"
                // onClick={() => setModal('CounterOffer', ({ fare: MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.amount, Parcel_id: Parcel_id, Trip_id: Trip_id, Api: MyTripsDetails?.request?.bidding ? true : false }))}
                onClick={handleChannel}
              >
                {i18?.NEW?.COUNTER || "Counter Offer This Price"}
              </p>
            ) : (
              <></>
            )
          ) : (
            // <div className='flex items-center gap-2'>
            //      <Image src='/svg/icon/thunder-svgrepo-com 1.svg' alt="img" width={800} height={800} className="w-[25px] h-[23px] " />
            //     <p className="text-[17px] font-[400] leading-[22px] text-btncolor">
            //         {i18?.NEW?.INSTANTBOOK || "Instant Booking Available"}
            //     </p>
            // </div>
            <></>
          )}
        </div>
      </div>
      {Type === "search" || Suggestionid !== null ? (
        token ? (
          <Button
            className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
            onClick={() =>
              setModal("requestfromhome" as any, { value: MyTripsDetails })
            }
          >
            {MyTripsDetails.instantBooking === "active" && (
              <Image
                src="/svg/icon/thunder-svgrepo-com 1.svg"
                alt="img"
                width={800}
                height={800}
                className="w-[25px] h-[23px] "
              />
            )}

            {MyTripsDetails.instantBooking !== "active"
              ? i18?.NEW?.REQFORPICK || "Request For Pickup"
              : i18?.NEW?.BOOKNOW || "Book Now"}
          </Button>
        ) : (
          <Button
            className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
            onClick={handleUrl}
          >
            {i18?.NEW?.BOOK_NOW || "Book Now"}
          </Button>
        )
      ) : (
        <div className="flex flex-col gap-8">
          {/* {
                            (MyTripsDetails?.request?.status !== 'Accepted' || MyTripsDetails?.request?.status !== 'Declined') &&
                                MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.userId !== User_id ?
                                <>
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                        onClick={() => handleRequest('Accepted')}
                                    >
                                        {i18?.NEW?.VIEWPARCEL?.ACCEPT || "Accept"}
                                    </Button>
                                    <Button
                                        className="border border-1 border-btncolor w-full p-5 flex items-center justify-center text-btncolor rounded-full gap-2"
                                        onClick={() => handleRequest('Declined')}
                                    >

                                        {i18?.NEW?.VIEWPARCEL?.DECLINE || "Decline"}
                                    </Button>
                                </>
                                :
                                <>
                                {
                                    MyTripsDetails?.request?.status === 'Accepted' ?
                                    <Button onClick={()=>router.push(`/tracking/payments?parcelid=${Parcel_id}&tripid=${Trip_id}`)}
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    >
                                        Tracking
                                    </Button>
                                    :
                                    <div
                                        className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    >
                                        {MyTripsDetails?.request?.status}
                                    </div>

                                }
                                    
                                </>
                        } */}
          {MyTripsDetails?.request?.status === "Requested" ? (
            MyTripsDetails?.request?.bidding[
              MyTripsDetails?.request?.bidding.length - 1
            ]?.userId !== User_id ? (
              <>
                <Button
                  className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                  onClick={() => handleRequest("Accepted")}
                >
                  {i18?.NEW?.VIEWPARCEL?.ACCEPT || "Accept"}
                </Button>
                <Button
                  className="border border-1 border-btncolor w-full p-5 flex items-center justify-center text-btncolor rounded-full gap-2"
                  onClick={() => handleRequest("Declined")}
                >
                  {i18?.NEW?.VIEWPARCEL?.DECLINE || "Decline"}
                </Button>
              </>
            ) : (
              <div className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2">
                {MyTripsDetails?.request?.status}
              </div>
            )
          ) : MyTripsDetails?.request?.status === "Accepted" ? (
            <Button
              onClick={() =>
                router.push(
                  `/tracking/details?parcelid=${Parcel_id}&tripid=${Trip_id}`,
                )
              }
              className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
            >
              {isPaid
                ? i18?.NEW?.VIEW_TRACKING_STATUS || "View Tracking Status"
                : i18?.NEW?.MAKE_PAYMENT || "Make Payment"}
            </Button>
          ) : (
            <div className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2">
              {MyTripsDetails?.request?.status}
            </div>
          )}
        </div>
      )}

      {Type === "search" && MyTripsDetails.instantBooking === "active" && (
        <p className="text-center text-[17px] font-[400] leading-[22px]">
          {i18?.NEW?.INSTANTBOOK || "Instant Booking Available"}
        </p>
      )}
      {Type === "request" && ApiStatus === null && (
        <p
          className="text-[17px] font-[400] leading-[22px] text-btncolor text-center underline cursor-pointer"
          onClick={() =>
            setModal("Rules" as any, {
              head: i18?.NEW?.CODE_OF_CONDUCT_RULES || "Code Of Conduct Rules",
            })
          }
        >
          {i18?.NEW?.CODE_OF_CONDUCT_RULES || "Code Of Conduct Rules"}
        </p>
      )}
    </>
  );
}

export default Request;
