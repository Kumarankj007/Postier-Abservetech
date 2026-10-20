// "use client"
// import React, { useContext, useEffect, useMemo, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import PostDetailsStore from '@/app/store/parcelDetails'
// import ParcelStore from '@/app/store/parcel'
// import Store from '@/app/store/store'
// import dynamic from 'next/dynamic'
// import PageContext from '@/app/providers/pagecontext'


// const ParcelDetails = dynamic(() => import('@/app/component/senderParcelDetails/ParcelDetails'), { ssr: false });

// const ProposalsDetails = dynamic(() => import('@/app/component/senderParcelDetails/ProposalsDetails'), { ssr: false });

// const Tracking = dynamic(() => import('@/app/component/tracking'), { ssr: false });

// const CustomTabComponent = dynamic(() => import('@/app/component/tabComp'), { ssr: false });

// const SenderDetails = () => {
//     const { Page,Limit } = Store()
//     const { i18 } = useContext(PageContext);
//     const { fetchPostDetails, postDetails }:any = PostDetailsStore()
//     const {FetchNearestMatches,NearestMatches}:any = ParcelStore()
//     const searchParams: any = useSearchParams()
//     const currentParams = new URLSearchParams(searchParams);
//     const postId: any = currentParams.get('id')
//     const PostId: any = postId ? postId : null

//     const tabs = useMemo(()=>([
//         { label: i18?.NEW?.PARCELDETAILS || 'Parcel Details', content: <div><ParcelDetails PostId={PostId} /></div>,value:true },
//         { label: i18?.NEW?.PROPOSAL || 'Proposals', content: <div><ProposalsDetails /></div>,value: NearestMatches?.suggestions?.length > 0 || NearestMatches?.requestList?.length > 0},
//         { label: i18?.NEW?.PARCELTRACKING || 'Payments & Tracking', content: <div><Tracking /></div>,value:NearestMatches?.accepted?.length > 0 },
//           // eslint-disable-next-line react-hooks/exhaustive-deps
//     ]), [PostId, NearestMatches])
//     useEffect(() => {
//         if (PostId) {
//             fetchPostDetails(PostId)
//             FetchNearestMatches(PostId,Page,Limit)
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [searchParams,Page,Limit])

//     return (
//         <div className='m-[20px] md:m-[40px] lg:m-[70px]'>
//             <div className="flex justify-between items-center mb-6 md:mb-6">
//                 <h1 className="font-bold  text-2xl md:text-4xl leading-tight mb-4 md:mb-0 capitalize">{postDetails?.parcel?.title}</h1>
//             </div>
//             <CustomTabComponent tabs={tabs}/>
//         </div>
//     )
// }

// export default SenderDetails

'use client'

import CustomBreadCrumb from "@/app/component/breadcrumbs"
import Button from "@/app/component/button"
import PageContext from "@/app/providers/pagecontext"
import ParcelStore from "@/app/store/parcel"
import useSnackbarStore from "@/app/store/toaster"
import { DeletePost, PublishParcel } from "@/app/tools/mutatefn/Parcelpost"
import { FormatDateTime, priceFormat } from "@/utils"
import { Breadcrumbs } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useContext, useEffect } from "react"
import Details from "./details"
import Request from "./request"
import useScreenWidth from "@/app/hooks/usescreenwidth"
import VehicleImgCarousel from "@/app/(profileDetails)/accountsettings/manage-vehicles/vehicleimgCarousel"
import MobileFooter from "./mobileFooter"
import { RequestFor } from "@/app/tools/mutatefn/request"
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes"
import TooltipComp from "@/app/component/tooltip"
import Store from "@/app/store/store"
import TripandParcelRequests from "@/app/store/requests"
import { CreateChannel } from "@/app/tools/mutatefn/chat"

export default function SenderDetails() {
    const router = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const { setModal } = Store()
    const Screen = useScreenWidth()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const params = useSearchParams()
    const Parcel_id: any = params ? params.get('id') : ''
    const Trip_id: any = params ? params.get('trip_id') : ''
    const Status = params ? params.get('status') : ''
    const Suggestionid = params ? params.get('suggestionid') : null
    const Type = params.get('type') ? params.get('type') : null
    const Amount = params.get('amount') ? params.get('amount') : null
    const { FetchMyparcelsDetails, MyParcelsDetails, FetchMyTripsDetails, MyTripsDetails }: any = ParcelStore()
    const { FetchParcelRequest, ParcelRequest } = TripandParcelRequests()
    const Condition = Type === 'request' ? ParcelRequest : MyParcelsDetails
    const pickup = Condition?.parcel?.pickupDate && FormatDateTime(Condition?.parcel?.pickupDate);
    const drop = Condition?.parcel?.deliveryDate && FormatDateTime(Condition?.parcel?.deliveryDate);

    useEffect(() => {
        if (Type === 'request') {
            const data: any = {}
            FetchParcelRequest(Trip_id, data, Parcel_id)
        } else {
            FetchMyparcelsDetails(Parcel_id, Type)
        }
        if (Suggestionid !== null) {
            const Type = 'reqs'
            FetchMyTripsDetails(Suggestionid, Type)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parcel_id, Suggestionid])


    const Grid = [
        {
            img: '/svg/icon/shopping-bag.svg',
            text: i18?.NEW?.WEIGHT || 'Weight',
            value: Condition?.parcel?.weight
        },
        {
            img: '/svg/icon/Text rotate vertical.svg',
            text: i18?.NEW?.LENGTH || 'Length',
            value: Condition?.parcel?.length
        },
        {
            img: '/svg/icon/Width.svg',
            text: i18?.NEW?.WIDTH || 'Width',
            value: Condition?.parcel?.width
        },
        {
            img: '/svg/icon/Height.svg',
            text: i18?.NEW?.HEIGHT || 'Height',
            value: Condition?.parcel?.height
        },
        {
            img: '/svg/icon/truck (1).svg',
            text: i18?.NEW?.DELIVERY_TYPE || 'Delivery Type',
            value: Condition?.parcel?.deliveryType
        },
        {
            img: '/svg/icon/box.svg',
            text: i18?.NEW?.PARCEL_TYPE || 'Parcel Type',
            value: Condition?.parcel?.type
        },


    ]

    const Images = [
        {
            name: i18?.NEW?.FRONTVIEW_IMAGE || 'FrontviewImage',
            file: Condition?.parcel?.image && Condition?.parcel?.image[0]?.frontviewImage
        },
        {
            name: i18?.NEW?.PRIMARY_IMAGE || 'PrimaryImage',
            file: Condition?.parcel?.image && Condition?.parcel?.image[0]?.primaryImage
        },
        {
            name: i18?.NEW?.SIDEVIEW_IMAGE || 'SideviewImage',
            file: Condition?.parcel?.image && Condition?.parcel?.image[0]?.sideviewImage
        },
        {
            name: i18?.NEW?.TOPVIEW_IMAGE || 'TopviewImage',
            file: Condition?.parcel?.image && Condition?.parcel?.image[0]?.topviewImage
        }
    ]

    const PUT = useMutation({
        mutationFn: PublishParcel,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");
            FetchMyparcelsDetails(Parcel_id)
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })

    const DELETE = useMutation({
        mutationFn: DeletePost,
        onSuccess: (data: any) => {
            router.push('/mypost')
            showSnackbar(data.message, "success");
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const REQ = useMutation({
        mutationFn: RequestFor,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");
            router.push('/myrequest')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })

    const handlePublish = () => {
        PUT.mutateAsync(Parcel_id)
    }

    const handleDelete = () => {
        DELETE.mutateAsync(Parcel_id)
    }
    const handleRequest = () => {
        if (Amount) {
            REQ.mutateAsync({ Trip_id: Suggestionid, Parcel_id: Parcel_id, Amount: Amount })
        } else {
            REQ.mutateAsync({ Trip_id: Suggestionid, Parcel_id: Parcel_id })
        }
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
        if (Suggestionid) {
            data.tripId = Suggestionid
        }
        if (Parcel_id) {
            data.postId = Parcel_id
        }
        Channel.mutateAsync(data)
    }
    return (
        <div className="m-[20px] md:m-[40px] lg:m-[70px]">
            {
                Type === null &&
                <div className="my-[40px]">
                    <CustomBreadCrumb pathSegments={Status} pathSegments2={`${Condition?.location?.pickUpCity !== '' ? Condition?.location?.pickUpCity : Condition?.location?.pickUp} to ${Condition?.location?.dropCity !== '' ? Condition?.location?.dropCity : Condition?.location?.drop}`} type='My Parcel' typeLink={`/mypost/?status=${Status}`} />
                </div>
            }
            <p className="text-[30px] font-[700] leading-[40px] mb-[30px]">Post No : {Condition?.referenceNo}</p>
            <div className={`flex ${Screen.width && Screen.width > 1024 ? 'flex-row' : 'flex-col'} gap-[40px] justify-around `}>
                <div className="flex flex-col gap-[50px] w-full lg:w-4/5">
                    <div className="border border-1 border-btncolor py-[30px] px-[20px] sm:px-[50px] rounded-[20px] ">
                        <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px]">
                            {i18?.NEW?.LOCATIONDETAILS || "Location Details"}
                        </p>
                        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
                        <div className="flex items-center   gap-[30px] lg:gap-[60px]">
                            <div className="flex flex-col gap-2">
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.PICKUP || 'Pick-up'}</p>
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px] w-[100px] md:w-[250px] truncate">
                                    {pickup?.date ? `${pickup?.date} , ${pickup?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                                </p>
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <TooltipComp title={Condition?.location?.pickUpCity || Condition?.location?.pickUp}>
                                            <p className="text-[17px] md:text-[34px] font-[600] leading-[44px] md:max-w-[200px]  truncate">
                                                {(Condition?.location?.pickUpCity || Condition?.location?.pickUp) || (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                                            </p>
                                        </TooltipComp>
                                        <Image width={800} height={800} src='/svg/icon/map-pin.svg' alt="img"
                                            className="w-[25px] h-[25px] cursor-pointer"
                                            onClick={() => setModal('Mapmodal', ({ lng: Condition?.location?.startCoords?.coordinates[0], lat: Condition?.location?.startCoords?.coordinates[1] }))}
                                        />
                                    </div>
                                    <TooltipComp title={Condition?.location?.pickUp}>
                                        <p className="text-[12px] sm:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[250px]  truncate">
                                            {Condition?.location?.pickUp || (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                                        </p>
                                    </TooltipComp>
                                </div>

                            </div>

                            <Image
                                width={800}
                                height={800}
                                src="/svg/icon/Arrow back.svg"
                                alt="img"
                                className="w-[30px] h-[30px]"
                            />

                            <div className="flex flex-col gap-2">
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.DROPOFF || 'Drop-off'}</p>
                                <p className="text-[12px] sm:text-[17px] font-[400] leading-[22px] w-[100px] md:w-[250px] truncate">
                                    {drop?.date ? `${drop?.date} , ${drop?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                                </p>
                                <div className=''>
                                    <div className="flex gap-2 items-center  w-[100px] md:w-[250px]">
                                        <TooltipComp title={Condition?.location?.dropCity || Condition?.location?.drop}>
                                            <p className="text-[17px] md:text-[34px] font-[600] leading-[44px]  md:max-w-[200px]  truncate">
                                                {(Condition?.location?.dropCity || Condition?.location?.drop) || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                                            </p>
                                        </TooltipComp>

                                        <Image width={800} height={800} src='/svg/icon/map-pin.svg' alt="img"
                                            className="w-[25px] h-[25px] cursor-pointer"
                                            onClick={() => setModal('Mapmodal', ({ lng: Condition?.location?.endCoords?.coordinates[0], lat: Condition?.location?.endCoords?.coordinates[1] }))}
                                        />
                                    </div>
                                    <TooltipComp title={Condition?.location?.drop}>
                                        <p className="text-[12px] sm:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[250px] truncate">
                                            {Condition?.location?.drop || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                                        </p>
                                    </TooltipComp>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="border border-1 border-btncolor py-[30px] px-[20px] sm:px-[50px] rounded-[20px] ">
                        {
                            Type !== null && <Details MyParcelsDetails={Condition} />
                        }
                        <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px]">
                            {i18?.NEW?.PARCELSPECIFICATIONS || "Parcel Specifications"}
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
                            <p className="text-[17px] font-[700] leading-[22px] flex-nowrap	">{i18?.NEW?.NOTESPARCEL || "Note About Parcel"}:</p>
                            <p className="text-[17px] font-[400] leading-[22px] flex-nowrap	capitalize">{Condition?.parcel?.desc}</p>
                            {
                                Screen.width && Screen.width > 468 ?
                                    <div className="flex flex-wrap gap-4 ">
                                        {
                                            Images.map((items, index) => (
                                                <div key={index} className="border border-1 border-btncolor p-[15px] rounded-[21px]">
                                                    <Image width={800} height={800} src={process.env.NEXT_PUBLIC_IMAGE_URL + items.file} alt="img" className="w-[150px] h-[150px] object-cover" />
                                                </div>
                                            ))
                                        }

                                    </div>
                                    :
                                    <div className="flex items-center justify-center">
                                        <div className="border border-1 border-btncolor rounded-[21px] p-4 max-w-[200px] max-h-[185px]">
                                            <VehicleImgCarousel VehicleDoc={Images} baseurl={true} />
                                        </div>
                                    </div>

                            }

                            <div className="border border-b-[rgba(0, 64, 128, 1)] w-full" />
                            { Type &&
                                Type !== 'search' &&
                                Type !== 'request' &&
                                <div>
                                    <Button className="flex gap-2 items-center tetx-[17px] text-[#FF0000]" onClick={handleDelete}>
                                        <Image src='/svg/icon/trash-2.svg' width={800} height={800} alt="img" className="w-[25px] h-[25px]" />
                                        {i18?.NEW?.DELETE || "Delete"}
                                    </Button>
                                </div>
                            }

                        </div>
                    </div>
                </div>

                {
                    (Screen.width && Screen.width > 1024) &&
                    <div className="flex flex-col gap-[40px] w-2/5	">
                        {
                            Type === null &&
                            <div className="flex items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full h-[250px] ">
                                <div className="flex flex-col items-center w-full">
                                    <p className="font-[700] text-[30px] leading-[39px] text-center " >
                                        {i18?.POSTAPARCELDELIVERY?.FORMHEADING?.PRICE || "Price"}
                                    </p>
                                    <div className="border border-b-[rgba(0, 64, 128, 1)]  my-[35px] w-full" />
                                    <p className="font-[700] text-[30px] leading-[39px] text-center ">
                                        {priceFormat(Number(Condition?.parcel?.fare))}
                                    </p>
                                </div>
                            </div>
                        }

                        {
                            Type !== null && <Request MyParcelsDetails={Condition} urlType={Type} Suggestionid={Suggestionid} />
                        }
                        {
                            Type === null && Condition?.status === 'Pending' &&
                            <div className="flex flex-col gap-4">
                                <Button className="border border-1 border-btncolor text-btncolor w-full p-5 flex items-center justify-center rounded-[20px]"
                                    onClick={() => router.push(`/createparcel?parcel_id=${Parcel_id}`)}
                                >
                                    {i18?.NEW?.EDIT || "Edit"}
                                </Button>
                                <Button className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    onClick={handlePublish}
                                >
                                    {i18?.NEW?.PUBLISHNOW || "Publish Now"}
                                </Button>

                            </div>
                        }
                        {
                            (Suggestionid === null && Type === null && Condition?.status !== 'Pending') &&
                            (
                                Condition?.status !== 'Delivered' ?
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                        onClick={() => router.push(`/request?id=${Parcel_id}&status=${Status}`)}
                                    >
                                        {i18?.NEW?.VIEWPOSTIERREQ || "View Postier Requests"}
                                    </Button>
                                    :
                                    <div
                                        className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    >
                                        {Condition?.status}
                                    </div>
                            )
                        }
                        {
                            Suggestionid !== null &&
                            <div className="flex flex-col gap-6 items-center justify-center border border-1 border-btncolor  py-[30px] px-[50px] rounded-[20px] w-full  ">
                                <p className="font-[700] text-[30px] leading-[39px] text-center " >
                                    {i18?.NEW?.TRIPSPRICE || "Trip's Price"}
                                </p>
                                <div className="border border-b-[rgba(0, 64, 128, 1)]  my-[10px] w-full" />
                                <div>
                                    <p className="font-[700] text-[30px] leading-[39px] text-center ">
                                        {priceFormat(Number(MyTripsDetails?.avgPrice))}
                                    </p>
                                    {
                                        MyTripsDetails?.instantBooking === 'inactive' &&
                                        <p className="text-[17px] font-[400] leading-[22px] text-btncolor mt-[20px] underline cursor-pointer"
                                            // onClick={() => setModal('CounterOffer', ({ fare: MyTripsDetails?.avgPrice, Parcel_id: Parcel_id, Trip_id: Suggestionid, Type: 'initial' }))}
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
                                (MyTripsDetails?.instantBooking === 'inactive' ?
                                <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    onClick={handleRequest}
                                >
                                    {i18?.NEW?.REQUESTTHIS || "Request this parcel"}
                                </Button>
                                :
                                <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    onClick={()=>router.push(`/tracking?parcelid=${Parcel_id}&tripid=${Suggestionid}`)}
                                >
                                    {i18?.NEW?.BOOKNOW || "Book Now"}
                                </Button>)
                        }
                        {/* {
                            (Suggestionid === null && Type === null) && (
                                Condition?.status === 'Published' || Condition?.status === 'Requested' ? (
                                    <>
                                        <Button
                                            className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                            onClick={() => router.push(`/request?id=${Parcel_id}&status=${Status}`)}
                                        >
                                            {i18?.NEW?.VIEWPOSTIERREQ || "View Postier Requests"}
                                        </Button>
                                       
                                    </>
                                ) : Condition?.status === 'Accepted' ? (
                                    <Button
                                        disabled
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    >
                                        {i18?.NEW?.ACCEPTED || "Accepted"}
                                    </Button>
                                ) : (
                                    (Suggestionid !== null && Type === null) &&
                                    <Button
                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                        onClick={handleRequest}
                                    >
                                        {i18?.NEW?.REQUESTTHIS || "Request this parcel"}
                                    </Button>
                                )
                            )
                        } */}

                    </div>
                }

            </div>
            {
                (Screen.width && Screen.width < 1024) &&
                <div className="flex w-full bg-[#fff] p-5 sticky bottom-0 z-[999] ">
                    <MobileFooter MyParcelsDetails={Condition} urlType={Type} Suggestionid={Suggestionid} />
                </div>
            }

        </div>
    )
}