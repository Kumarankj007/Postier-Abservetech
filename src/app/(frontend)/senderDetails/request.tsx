import Button from "@/app/component/button";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import RoleStore from "@/app/store/RoleStore";

import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import TypeStore from "@/app/store/typeStore";
import { CreateChannel } from "@/app/tools/mutatefn/chat";
import { RequestForUpdate } from "@/app/tools/mutatefn/request";
import { priceFormat } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";

function Request({ MyParcelsDetails, urlType, Suggestionid }: any) {
  const { i18 } = useContext(PageContext);
  const { setModal } = Store();
  const { RoleSwitch } = RoleStore();
  const { Type } = TypeStore();
  const router = UseLoadingRouter();
  const User_id =
    typeof window !== "undefined" &&
    window.localStorage.getItem("appUserId") !== ""
      ? window.localStorage.getItem("appUserId")
      : null;
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const params = useSearchParams();
  const Trip_id: any = params.get("trip_id") ? params.get("trip_id") : "";
  const Parcel_id: any = params ? params.get("id") : "";
  const ApiStatus = params.get("apistatus") ? params.get("apistatus") : null;
  const Fare = params.get("amount") ? params.get("amount") : null;
  const REQ = useMutation({
    mutationFn: RequestForUpdate,
    onSuccess: (data: any) => {
      showSnackbar(data.message, "success");
      router.push(`/triprequest/?id=${Trip_id}&status=Accepted`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleRequest = (status: any) => {
    REQ.mutateAsync({
      Parcel_id: MyParcelsDetails?._id,
      Trip_id: Trip_id,
      data: { status: status },
    });
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
                <p className="text-[20px] font-[600] leading-[44px] ">
                  {MyParcelsDetails?.location?.pickUpCity ||
                    i18?.NEW?.DEFAULTPICKUPLOCATION ||
                    "Default Pickup Location"}
                </p>
                <Image
                  width={800}
                  height={800}
                  src="/svg/icon/map-pin.svg"
                  alt="img"
                  onClick={() =>
                    setModal("Mapmodal", {
                      lng: MyParcelsDetails?.location?.startCoords
                        ?.coordinates[0],
                      lat: MyParcelsDetails?.location?.startCoords
                        ?.coordinates[1],
                    })
                  }
                  className="w-[25px] h-[25px] cursor-pointer"
                />
              </div>
              <p className="text-[17px] font-[400] leading-[44px] w-[300px] truncate">
                {MyParcelsDetails?.location?.pickUp ||
                  i18?.NEW?.DEFAULTPICKUPADDRESS ||
                  "Default Pickup Address"}
              </p>
            </div>

            <div className="flex flex-col ml-6">
              <div className="flex gap-2 items-center">
                <p className="text-[20px] font-[600] leading-[44px] ">
                  {MyParcelsDetails?.location?.dropCity ||
                    "Default Pickup Location"}
                </p>
                <Image
                  width={800}
                  height={800}
                  src="/svg/icon/map-pin.svg"
                  alt="img"
                  onClick={() =>
                    setModal("Mapmodal", {
                      lng: MyParcelsDetails?.location?.endCoords
                        ?.coordinates[0],
                      lat: MyParcelsDetails?.location?.endCoords
                        ?.coordinates[1],
                    })
                  }
                  className="w-[25px] h-[25px] cursor-pointer"
                />
              </div>
              <p className="text-[17px] font-[400] leading-[44px] w-[300px] truncate">
                {MyParcelsDetails?.location?.drop ||
                  i18?.NEW?.DEFAULTPICKUPADDRESS ||
                  "Default Pickup Address"}
              </p>
            </div>
          </div>
        </div>
        <div className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
        <div className="flex flex-wrap gap-2 justify-start items-center w-full">
          <Image
            src={
              MyParcelsDetails?.consignor?.profile?.startsWith("http")
                ? MyParcelsDetails?.consignor?.profile
                : process.env.NEXT_PUBLIC_IMAGE_URL +
                  MyParcelsDetails?.consignor?.profile
            }
            alt="img"
            width={800}
            height={800}
            className="w-[90px] h-[90px] rounded-full"
          />
          <p className="text-[20px] font-[600] leading-[26px]">
            {MyParcelsDetails?.consignor?.firstName}{" "}
            {MyParcelsDetails?.consignor?.lastName}
          </p>
        </div>
      </div>

      {MyParcelsDetails?.request?.bidding && (
        <div className="flex flex-col items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
          <div className="flex flex-col gap-6 items-center w-full">
            <p className="font-[700] text-[30px] leading-[39px] text-center ">
              {priceFormat(
                Number(
                  MyParcelsDetails?.request?.bidding[
                    MyParcelsDetails?.request?.bidding.length - 1
                  ].amount,
                ),
              )}
            </p>
            {urlType !== "search" && !Fare ? (
              MyParcelsDetails.instantBooking !== "active" &&
              MyParcelsDetails?.request?.status !== "Accepted" &&
              MyParcelsDetails?.request?.bidding[
                MyParcelsDetails?.request?.bidding.length - 1
              ]?.userId !== User_id ? (
                <p
                  className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer"
                  // onClick={() => setModal('CounterOffer', ({ fare: MyParcelsDetails?.request?.bidding[MyParcelsDetails?.request?.bidding.length - 1]?.amount || Fare ? Fare : MyParcelsDetails?.parcel?.fare, Parcel_id: Parcel_id, Trip_id: Trip_id, Type }))}
                  onClick={handleChannel}
                >
                  {i18?.NEW?.COUNTER || "Counter Offer This Price"}
                </p>
              ) : (
                <></>
              )
            ) : (
              // <div className='flex items-center gap-2'>
              //     <Image src='/svg/icon/thunder-svgrepo-com 1.svg' alt="img" width={800} height={800} className="w-[25px] h-[23px] " />
              //     <p className="text-[17px] font-[400] leading-[22px] text-btncolor">
              //         {i18?.NEW?.INSTANTBOOK || "Instant Booking Available"}
              //     </p>
              // </div>
              <></>
            )}
          </div>
        </div>
      )}
      {/* || Fare ? Fare : MyParcelsDetails?.parcel?.fare */}
      {/* {
                (Fare || MyParcelsDetails?.request?.bidding) &&
                <div className="flex flex-col items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
                    <div className="flex flex-col gap-6 items-center w-full">
                        <p className="font-[700] text-[30px] leading-[39px] text-center ">
                            $ { Type === 'request' ? MyParcelsDetails?.request?.bidding[MyParcelsDetails?.request?.bidding.length - 1]?.amount : MyParcelsDetails?.parcel?.fare}
                        </p>
                        {
                            (Type) ?
                                (MyParcelsDetails.instantBooking !== 'active' && MyParcelsDetails?.request?.status !== 'Accepted') &&
                                    MyParcelsDetails?.request?.bidding[MyParcelsDetails?.request?.bidding.length - 1]?.userId !== User_id ?
                                    <p className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer" 
                                    // onClick={() => setModal('CounterOffer', ({ fare: MyParcelsDetails?.request?.bidding[MyParcelsDetails?.request?.bidding.length - 1]?.amount , Parcel_id: Parcel_id, Trip_id: Trip_id, Type }))}
                                    onClick={handleChannel}
                                    >
                                        {i18?.NEW?.COUNTER || "Counter Offer This Price"}
                                    </p>
                                    :
                                    <></>
                                :
                                <></>
                        }
                    </div>
                </div>
            } */}
      {urlType === "search" || Suggestionid !== null ? (
        <>
          <div className="flex flex-col items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
            <div className="flex flex-col gap-6 items-center w-full">
              <p className="font-[700] text-[30px] leading-[39px] text-center ">
                {priceFormat(Number(MyParcelsDetails?.parcel?.fare))}
              </p>
            </div>
          </div>
          {Type === "deliverparcel" && RoleSwitch === "postier" && (
            <Button
              className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full"
              onClick={() =>
                setModal("requestfromhome" as any, { value: MyParcelsDetails })
              }
            >
              {i18?.NEW?.REQFOR || "Request to Pickup"}
            </Button>
          )}
        </>
      ) : (
        <div>
          <div className="flex flex-col gap-6">
            {MyParcelsDetails?.request?.status === "Requested" ? (
              MyParcelsDetails?.request?.bidding[
                MyParcelsDetails?.request?.bidding.length - 1
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
                  {MyParcelsDetails?.request?.status}
                </div>
              )
            ) : MyParcelsDetails?.request?.status === "Accepted" ? (
              <Button
                onClick={() =>
                  router.push(
                    `/tracking?parcelid=${Parcel_id}&tripid=${Trip_id}`,
                  )
                }
                className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
              >
                {i18?.NEW?.TRACKING || "Tracking"}
              </Button>
            ) : (
              <div className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2">
                {MyParcelsDetails?.request?.status}
              </div>
            )}
          </div>

          {urlType === "request" && ApiStatus === null && (
            <p
              className="text-[17px] font-[400] leading-[22px] text-btncolor text-center underline cursor-pointer mt-8"
              onClick={() =>
                setModal("Rules" as any, { head: "Code Of Conduct Rules" })
              }
            >
              {i18?.NEW?.CODEOFCONDUCTRULES || "Code Of Conduct Rules"}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default Request;
