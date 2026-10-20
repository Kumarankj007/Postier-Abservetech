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
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useContext } from "react";

function MobileFooter({ MyParcelsDetails, urlType, Suggestionid }: any) {
    const router = UseLoadingRouter();
    const { setModal } = Store();
    const { Type } = TypeStore();
    const { RoleSwitch } = RoleStore();
    const { MyTripsDetails }: any = ParcelStore();
    const User_id =
        typeof window !== "undefined" &&
            window.localStorage.getItem("appUserId") !== ""
            ? window.localStorage.getItem("appUserId")
            : null;
    const { i18 } = useContext(PageContext);
    const params = useSearchParams();
    const Parcel_id: any = params ? params.get("id") : "";
    const Trip_id: any = params.get("trip_id")
        ? params.get("trip_id")
        : params.get("suggestionid");
    const Status = params ? params.get("status") : "";
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
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
        <div className="w-full">
            <div className="flex gap-[30px] justify-between items-center">
                <div>
                    <p className="text-[20px] sm:text-[30px] font-[700]">
                        {" "}
                        ${" "}
                        {urlType === "request"
                            ? MyParcelsDetails?.request?.bidding[
                                MyParcelsDetails?.request?.bidding.length - 1
                            ]?.amount
                            : MyParcelsDetails?.parcel?.fare}
                    </p>
                    {urlType === "request" ? (
                        MyParcelsDetails.instantBooking !== "active" &&
                            MyParcelsDetails?.request?.status !== "Accepted" &&
                            MyParcelsDetails?.request?.bidding[
                                MyParcelsDetails?.request?.bidding.length - 1
                            ]?.userId !== User_id ? (
                            <p
                                className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer w-[100px] sm:w-[200px] truncate"
                                // onClick={() => setModal('CounterOffer', ({ fare: MyParcelsDetails?.request?.bidding[MyParcelsDetails?.request?.bidding.length - 1]?.amount , Parcel_id: Parcel_id, Trip_id: Trip_id, Type }))}
                                onClick={handleChannel}
                            >
                                {i18?.NEW?.COUNTER || "Counter Offer This Price"}
                            </p>
                        ) : (
                            <></>
                        )
                    ) : (
                        <></>
                    )}
                </div>

                <div className="flex">
                    {urlType === "search" || Suggestionid !== null ? (
                        Type !== "deliverparcel" &&
                            RoleSwitch === "user" &&
                            MyTripsDetails?.instantBooking === "inactive" ? (
                            <Button
                                className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full"
                                onClick={() =>
                                    setModal("requestfromhome" as any, {
                                        value: MyParcelsDetails,
                                    })
                                }
                            >
                                {i18?.NEW?.REQFOR || "Request to Pickup"}
                            </Button>
                        ) : (
                            <Button
                                className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full"
                                onClick={() =>
                                    router.push(
                                        `/tracking?parcelid=${Parcel_id}&tripid=${Trip_id}`
                                    )
                                }
                            >
                                {i18?.NEW?.BOOKNOW || "Book Now"}
                            </Button>
                        )
                    ) : (
                        <div>
                            <div className="flex flex-col gap-6">
                                {Suggestionid === null &&
                                    urlType === null &&
                                    MyParcelsDetails?.status !== "Pending" ? (
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                        onClick={() =>
                                            router.push(`/request?id=${Parcel_id}&status=${Status}`)
                                        }
                                    >
                                        {i18?.NEW?.VIEWPOSTIERREQ || "View Postier Requests"}
                                    </Button>
                                ) : MyParcelsDetails?.request?.status === "Requested" ? (
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
                                                `/tracking?parcelid=${Parcel_id}&tripid=${Trip_id}`
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

                            {/* {
                            (Type === 'request' && ApiStatus === null) &&
                            <p className='text-[17px] font-[400] leading-[22px] text-btncolor text-center underline cursor-pointer mt-8' onClick={() => setModal('Rules' as any)}>Code Of Conduct Rules</p>
                        } */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobileFooter;
