
'use client'

import CustomBreadCrumb from "@/app/component/breadcrumbs"
import Button from "@/app/component/button"
import PageContext from "@/app/providers/pagecontext"
import ParcelStore from "@/app/store/parcel"
import useSnackbarStore from "@/app/store/toaster"
import { DeleteTrip, PublishTrip } from "@/app/tools/mutatefn/Parcelpost"
import { FormatDateTime, priceFormat } from "@/utils"
import { Breadcrumbs } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect } from "react"
import Request from "./request"
import Details from "./details"
import useScreenWidth from "@/app/hooks/usescreenwidth"
import MobileFooter from "./mobileFooter"
import { RequestFor } from "@/app/tools/mutatefn/request"
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes"
import Store from "@/app/store/store"
import TooltipComp from "@/app/component/tooltip"
import TripandParcelRequests from "@/app/store/requests"
import { CreateChannel } from "@/app/tools/mutatefn/chat"

export default function SenderDetails() {
    const router = UseLoadingRouter();
    const { setModal } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const params = useSearchParams()
    const Screen = useScreenWidth()
    const { i18 } = useContext(PageContext);

    const Trip_id: any = params ? params.get('id') : ''
    const Parcel_id: any = params ? params.get('parcel_id') : ''
    const Status = params ? params.get('status') : ''
    const Type = params.get('type') ? params.get('type') : null
    const Suggestionid = params ? params.get('suggestionid') : null
    const amount = params ? params.get('amount') : ''
    const droplat = params.get('dropLat') ? params.get('dropLat') : null
    const droplng = params.get('dropLng') ? params.get('dropLng') : null
    const { FetchMyTripsDetails, MyTripsDetails, FetchMyparcelsDetails, MyParcelsDetails }: any = ParcelStore()
    const { FetchRequest, TripRequest, total }: any = TripandParcelRequests()
    const Condition = Type === 'request' ? TripRequest : MyTripsDetails
    const pickup = Condition?.pickupDate && FormatDateTime(Condition?.pickupDate);
    const drop = Condition?.deliveryDate && FormatDateTime(Condition?.deliveryDate);
    const TypeArray = MyTripsDetails && MyTripsDetails?.type?.split(',')

    useEffect(() => {
        if (Type === 'request') {
            const data: any = {}
            FetchRequest(Parcel_id, data, Trip_id)
        }
        else {
            FetchMyTripsDetails(Trip_id, Type, droplat, droplng)
        }

        // if (Suggestionid !== null) {
        if (Parcel_id !== null) {
            const Type = 'reqs'
            // FetchMyparcelsDetails(Suggestionid, Type)
            FetchMyparcelsDetails(Parcel_id, Type)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Trip_id, Suggestionid])


    const Grid = [
        {
            img: '/svg/icon/shopping-bag.svg',
            text: i18?.NEW?.WEIGHT || 'Weight',
            value: Condition?.maxWeight
        },
        {
            img: '/svg/icon/Text rotate vertical.svg',
            text: i18?.NEW?.LENGTH || 'Length',
            value: Condition?.maxLength
        },
        {
            img: '/svg/icon/Width.svg',
            text: i18?.NEW?.WIDTH || 'Width',
            value: Condition?.maxWidth
        },
        {
            img: '/svg/icon/Height.svg',
            text: i18?.NEW?.HEIGHT || 'Height',
            value: Condition?.maxHeight
        },
        {
            img: '/svg/icon/truck (1).svg',
            text: i18?.NEW?.DELIVERY_TYPE || 'Delivery Type',
            value: Condition?.deliveryType
        },
        {
            img: '/svg/icon/box.svg',
            text: i18?.NEW?.PARCEL_TYPE || 'Parcel Type',
            value: Condition?.type
        },
    ]

    const REQ = useMutation({
        mutationFn: RequestFor,
        onSuccess: (data: any) => {
            FetchMyTripsDetails(Trip_id, Type, droplat, droplng)
            showSnackbar(data.message, "success");
            router.push('/myrequest/')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    // console.log('MyTripsDetails', MyTripsDetails)
    const PUT = useMutation({
        mutationFn: PublishTrip,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");
            FetchMyTripsDetails(Trip_id)
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const DELETE = useMutation({
        mutationFn: DeleteTrip,
        onSuccess: (data: any) => {
            router.push('/mytrips')
            showSnackbar(data.message, "success");
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const handlePublish = () => {
        PUT.mutateAsync(Trip_id)
    }
    const handleDelete = () => {
        DELETE.mutateAsync(Trip_id)
    }
    const handleRequest = () => {
        REQ.mutateAsync({
            Trip_id: Trip_id,
            Parcel_id: Suggestionid,
            ...(amount && { data: { amount: amount, status: 'Bidded' } })
        });
    }
    const Channel = useMutation({
        mutationFn: CreateChannel,
        onSuccess: (data) => {
            router.push(`/message/${data?.data?.channel?._id}`)
        },
        onError: (data) => {
            showSnackbar(data.message, "error");
        }
    })
    const handleChannel = () => {
        const data: any = {}
        if (Trip_id) {
            data.tripId = Trip_id
        }
        if (Suggestionid || Parcel_id) {
            data.postId = Suggestionid ? Suggestionid : Parcel_id
        }
        Channel.mutateAsync(data)
    }
    // console.log('MyTripsDetails', MyTripsDetails)
    return (
        <div className="m-[20px] md:m-[40px] lg:m-[70px]">
            {
                Type === null &&
                <div className="my-[40px]">
                    <CustomBreadCrumb pathSegments={Status} pathSegments2={`${MyTripsDetails?.location?.pickUpCity !== '' ? MyTripsDetails?.location?.pickUpCity : MyTripsDetails?.location?.pickUp} to ${MyTripsDetails?.location?.dropCity !== '' ? MyTripsDetails?.location?.dropCity : MyTripsDetails?.location?.drop}`} type='My Trips' typeLink={`/mytrips/?status=${Status}`} />
                </div>
            }
            <p className="text-[30px] font-[700] leading-[40px] mb-[30px]">Trip No : {Condition?.uniCode}</p>
            <div className=" flex gap-[40px] justify-between">
                <div className="flex flex-col gap-[50px] w-full lg:w-4/5">
                    <div className="border border-1 border-btncolor py-[30px] px-[20px] sm:px-[50px] rounded-[20px] ">
                        <p className="font-[700] ext-[17px] sm:text-[30px] leading-[39px]">
                            {i18?.NEW?.LOCATIONDETAILS || "Location Details"}
                        </p>
                        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
                        {/* location Detail */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2 w-[45%] ">
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.PICKUP || 'Pick-up'}</p>
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">
                                    {pickup?.date ? `${pickup?.date} , ${pickup?.time}` : "No date/time available"}
                                </p>
                                    <div className="flex gap-2 items-center w-full">
                                        <TooltipComp className="md:w-[90%] w-[80%]" title={Condition?.location?.pickUpCity || Condition?.location?.pickUp}>
                                            <p className="text-[17px] md:text-[34px] font-[600] leading-[44px] w-full truncate">
                                                {(Condition?.location?.pickUpCity || Condition?.location?.pickUp) || "Default Pickup Location"}
                                            </p>
                                        </TooltipComp>
                                        <Image width={800} height={800} src='/svg/icon/map-pin.svg' alt="img"
                                            className="w-[25px] h-[25px] cursor-pointer"
                                            onClick={() => setModal('Mapmodal', ({ lng: Condition?.location?.startCoords?.coordinates[0], lat: Condition?.location?.startCoords?.coordinates[1] }))}
                                        />
                                    </div>
                                    <TooltipComp title={Condition?.location?.pickUp}>
                                        <p className="text-[12px] sm:text-[17px] font-[400] leading-[44px] ">
                                            {Condition?.location?.pickUp || "Default Pickup Location"}
                                        </p>
                                    </TooltipComp>

                            </div>

                            <Image
                                width={800}
                                height={800}
                                src="/svg/icon/Arrow back.svg"
                                alt="img"
                                className="w-[30px] h-[30px]"
                            />

                            <div className="flex flex-col gap-2 w-[45%]">
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.DROPOFF || 'Drop-off'}</p>
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">
                                    {drop?.date ? `${drop?.date} , ${drop?.time}` : "No date/time available"}
                                </p>
                                    <div className="flex gap-2 items-center">
                                        <TooltipComp  className="md:w-[90%] w-[80%]" title={Condition?.location?.dropCity || Condition?.location?.drop}>
                                            <p className="text-[17px] md:text-[34px] font-[600] leading-[44px] w-full truncate">
                                                {(Condition?.location?.dropCity || Condition?.location?.drop) || "Default Drop-off Location"}
                                            </p>
                                        </TooltipComp>

                                        <Image width={800} height={800} src='/svg/icon/map-pin.svg' alt="img"
                                            className="w-[25px] h-[25px] cursor-pointer"
                                            onClick={() => setModal('Mapmodal', ({ lng: Condition?.location?.endCoords?.coordinates[0], lat: Condition?.location?.endCoords?.coordinates[1] }))}
                                        />
                                    </div>
                                    <TooltipComp title={Condition?.location?.drop}>
                                        <p className="text-[12px] sm:text-[17px] font-[400] leading-[44px]">
                                            {Condition?.location?.drop || "Default Drop-off Location"}
                                        </p>
                                    </TooltipComp>

                            </div>
                        </div>
                    </div>

                    <div className="border border-1 border-btncolor py-[30px] px-[20px] sm:px-[50px] rounded-[20px] ">
                        {
                            Type !== null && <Details MyTripsDetails={Condition} />
                        }
                        <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px]">
                            {i18?.NEW?.SPECIFICATION || 'Specifications'}
                        </p>
                        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
                        <div className="flex flex-col gap-[30px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[35px]">
                                {
                                    Grid.map((items, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Image src={items.img} width={800} height={800} alt="img" className="w-[20px] h-[20px]" />
                                            <p className="text-[15px] font-[700] leading-[22px] flex-nowrap	">{items?.text}</p> : <span className="text-[15px] font-[400] leading-[22px]">{items?.value}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <p className="text-[17px] font-[700] leading-[22px] flex-nowrap	">{i18?.NEW?.NOTESTRIP || 'Description About Trip:'}</p>
                            <p className="text-[17px] font-[400] leading-[22px] flex-nowrap	">{Condition?.description}</p>
                            <div className="flex flex-wrap gap-4 justify-start">

                                <div className="border border-1 border-btncolor p-[15px] rounded-[21px]">
                                    <Image width={800} height={800} src={process.env.NEXT_PUBLIC_IMAGE_URL + Condition?.postier?.vehicleDetails?.vehicleFrontImage} alt="img" className="w-[150px] h-[150px] object-cover" />
                                </div>
                            </div>
                            {
                                Suggestionid === null &&
                                <>
                                    <div className="border border-b-[rgba(0, 64, 128, 1)] w-full" />
                                    <div>
                                        {/* {((Type === null) ?
                                            <Button className="flex gap-2 items-center tetx-[17px] text-[#FF0000]" onClick={handleDelete}>
                                                <Image src='/svg/icon/trash-2.svg' width={800} height={800} alt="img" className="w-[25px] h-[25px]" />
                                                {i18?.NEW?.DELETETRIP || "Delete This Trip"}
                                            </Button>
                                            :
                                            Type !== 'request' &&
                                            Type !== 'search' &&
                                            <Button className="flex gap-2 items-center tetx-[17px] text-[#FF0000]" onClick={handleDelete}>
                                                <Image src='/svg/icon/alert-triangle.svg' width={800} height={800} alt="img" className="w-[25px] h-[25px]" />
                                                {i18?.NEW?.REPORT || "Report Postier"}
                                            </Button>
                                        )
                                        } */}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                {
                    (Screen.width && Screen.width > 1024) &&
                    <div className="flex flex-col gap-[40px] w-2/5">
                        {
                            Type === null &&
                            <div className="flex items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full h-[250px] ">
                                <div className="flex flex-col items-center w-full">
                                    <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px] text-center " >
                                        {
                                            (Suggestionid !== null && amount) ? i18?.NEW?.TRIPPRICE || `Trip's  Price` : i18?.VIEWPARCEL?.PRICE || `Price`
                                        }
                                    </p>
                                    <div className="border border-b-[rgba(0, 64, 128, 1)]  my-[35px] w-full" />
                                    <p className="font-[700] text-[30px] leading-[39px] text-center ">
                                        {priceFormat(Number(Condition?.avgPrice))}
                                    </p>
                                </div>
                            </div>
                        }


                        {
                            (Type !== null) && <Request MyTripsDetails={Condition} isPaid={MyParcelsDetails.paymentStatus === "PAID"} Type={Type} Suggestionid={Suggestionid} />
                        }

                        {Type === null && Condition?.status === 'Pending' && (
                            <div className="flex flex-col gap-4">
                                <Button
                                    className="border border-1 border-btncolor text-btncolor w-full p-5 flex items-center justify-center rounded-[20px]"
                                    onClick={() => router.push(`/createtrip?trip_id=${Trip_id}`)}
                                >
                                    {i18?.NEW?.EDIT || "Edit"}
                                </Button>
                                <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    onClick={handlePublish}
                                >
                                    {i18?.NEW?.PUBLISHNOW || "Publish Now"}
                                </Button>
                            </div>
                        )}
                        {
                            (Suggestionid === null && Type === null && Condition?.status !== 'Pending') &&
                            (
                                Condition?.status !== 'Finished' ?
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                        onClick={() => router.push(`/triprequest?id=${Trip_id}&status=${Status}`)}
                                    >
                                        {i18?.NEW?.VIEWPOSTIERREQ2 || "View Parcel Requests"}
                                    </Button>
                                    :
                                    <div
                                        className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    >
                                        {Condition?.status}
                                    </div>
                            )

                        }
                        {/* {
                            (Suggestionid !== null && amount) &&
                            <div className="flex flex-col items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
                                <div className="flex flex-col gap-6 items-center w-full">
                                    <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px] text-center " >
                                        {
                                            i18?.NEW?.OFFERPRICE || 'Offer Price'
                                        }
                                    </p>
                                    <div className="border border-b-[rgba(0, 64, 128, 1)]  my-[35px] w-full" />
                                    <p className="font-[700] text-[30px] leading-[39px] text-center ">
                                        $ {amount}
                                    </p>
                                    {
                                        <p className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer" onClick={() => setModal('CounterOffer', ({ fare: amount, Parcel_id: Suggestionid, Trip_id: Trip_id }))}>
                                            {i18?.NEW?.COUNTER || "Counter Offer This Price"}
                                        </p>
                                    }

                                </div>
                            </div>
                        } */}
                        {
                            Suggestionid !== null &&
                            <div className="flex items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full h-[250px] ">
                                <div className="flex flex-col items-center w-full">
                                    <p className="font-[700] text-[30px] leading-[39px] text-center " >
                                        {i18?.NEW?.PARCEL_PRICE || "Parcel's Price"}
                                    </p>
                                    <div className="border border-b-[rgba(0, 64, 128, 1)]  my-[35px] w-full" />
                                    <p className="font-[700] text-[30px] leading-[39px] text-center ">
                                        {priceFormat(Number(MyParcelsDetails?.parcel?.fare))}
                                    </p>
                                    {
                                        MyTripsDetails?.instantBooking === 'inactive' &&
                                        <p className="text-[17px] font-[400] leading-[22px] text-btncolor mt-[20px] underline cursor-pointer"
                                            // onClick={() => setModal('CounterOffer', ({ fare: MyParcelsDetails?.parcel?.fare , Parcel_id: Suggestionid, Trip_id: Trip_id, Type : 'initial' }))}
                                            onClick={handleChannel}
                                        >
                                            {i18?.NEW?.COUNTER || "Counter Offer This Price"}
                                        </p>
                                    }

                                </div>
                            </div>
                        }
                        {
                            Suggestionid !== null &&
                            <Button
                                className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                onClick={handleRequest}
                            >
                                {i18?.NEW?.REQUESTTHISTRIP || "Request this trip"}
                            </Button>
                        }


                        {/* {
                            (Suggestionid === null && Type === null) ? (
                                (Condition?.status === 'Published' || Condition?.status === 'Requested') ? (
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                        onClick={() => router.push(`/triprequest?id=${Trip_id}&status=${Status}`)}
                                    >
                                        {i18?.NEW?.VIEWPOSTIERREQ2 || "View Parcel Requests"}
                                    </Button>
                                ) : Condition?.status === 'Accepted' ? (
                                    <Button
                                        disabled
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    >
                                        {i18?.NEW?.ACCEPTED || "Accepted"}
                                    </Button>
                                ) : null
                            )
                                :
                               
                                null
                        } */}

                    </div>
                }
            </div>
            {
                (Screen.width && Screen.width < 1024) &&
                <div className="flex w-full bg-[#fff] p-5 sticky bottom-0 z-[999] ">
                    <MobileFooter MyTripsDetails={Condition} isPaid={MyParcelsDetails.paymentStatus === "PAID"} Type={Type} />
                </div>
            }
        </div>
    )
}