import Button from '@/app/component/button'
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';
import PageContext from '@/app/providers/pagecontext';
import ParcelStore from '@/app/store/parcel';
import Store from '@/app/store/store';
import useSnackbarStore from '@/app/store/toaster';
import { CreateChannel } from '@/app/tools/mutatefn/chat';
import { RequestFor, RequestForUpdate } from '@/app/tools/mutatefn/request';
import { priceFormat } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'

function MobileFooter({ MyTripsDetails, Type, isPaid }: any) {
    const params = useSearchParams()
    const router = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const { setModal } = Store()
    const Status = params ? params.get('status') : ''
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    const token = typeof window !== "undefined" && window.localStorage.getItem('appToken')
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const Parcel_id: any = params.get('parcel_id') ? params.get('parcel_id') : ''
    const Trip_id: any = params ? params.get('id') : ''
    const droplat = params.get('droplat') ? params.get('droplat') : null
    const droplng = params.get('droplng') ? params.get('droplng') : null
    const Suggestionid = params ? params.get('suggestionid') : ''
    const { FetchMyTripsDetails }: any = ParcelStore()

    const REQ = useMutation({
        mutationFn: RequestForUpdate,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");
            router.push(`/request/?id=${Parcel_id}&status=Accepted`)
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })

    const handleRequest = (status: any) => {
        REQ.mutateAsync({ Trip_id: MyTripsDetails?._id, Parcel_id: Parcel_id, data: { status: status } })
    }
    const handleUrl = () => {
        router.push(`/account/register/?auth=signup`)
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
        if (Parcel_id) {
            data.postId = Parcel_id
        }
        Channel.mutateAsync(data)
    }
    return (
        <div className='w-full'>
            <div className='flex gap-[30px] justify-between items-center'>
                <div>
                    {
                        priceFormat(Number(Type === 'request' ?
                            MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.amount
                            :
                            MyTripsDetails?.avgPrice))
                    }
                    {
                        (Type === 'request') ?
                            (MyTripsDetails.instantBooking !== 'active' && MyTripsDetails?.request?.status !== 'Accepted') &&
                                MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.userId !== User_id ?
                                <p className="text-[17px] font-[400] leading-[22px] text-btncolor underline cursor-pointer w-[100px] sm:w-[200px] truncate"
                                    // onClick={() => setModal('CounterOffer', ({ fare: MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.amount, Parcel_id: Parcel_id, Trip_id: Trip_id, Api: MyTripsDetails?.request?.bidding ? true : false }))}
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

                <div className='flex'>

                    {
                        (Type === 'search' || Suggestionid !== null) ?
                            token ?
                                <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    onClick={() => setModal('requestfromhome' as any, ({ value: MyTripsDetails }))}
                                >
                                    {/* {
                                        MyTripsDetails.instantBooking === 'active' &&
                                        <Image src='/svg/icon/thunder-svgrepo-com 1.svg' alt="img" width={800} height={800} className="w-[25px] h-[23px] " />
                                    } */}

                                    {i18?.NEW?.REQUESTTHISTRIP || "Request this trip"}
                                </Button>
                                :
                                <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                    onClick={handleUrl}
                                >
                                    {i18?.NEW?.BOOK_NOW || "Book Now"}
                                </Button>
                            :
                            <div className='flex gap-8'>
                                {
                                    Suggestionid === null && Type === null && MyTripsDetails?.status !== 'Pending'?
                                    <Button
                                    className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-[20px]"
                                    onClick={() => router.push(`/triprequest?id=${Trip_id}&status=${Status}`)}
                                >
                                    {i18?.NEW?.VIEWPOSTIERREQ2 || "View Parcel Requests"}
                                </Button>
                                :
                                    MyTripsDetails?.request?.status !== 'Accepted' &&
                                        MyTripsDetails?.request?.bidding[MyTripsDetails?.request?.bidding.length - 1]?.userId !== User_id ?
                                        <div className='flex gap-2'>
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
                                        </div>
                                        :
                                        <>
                                            {
                                                MyTripsDetails?.request?.status === 'Accepted' ?
                                                    <Button onClick={() => router.push(`/tracking/payments?parcelid=${Parcel_id}&tripid=${Trip_id}`)}
                                                        className="bg-btncolor w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                                    >
                                        {isPaid ? (i18?.NEW?.VIEW_TRACKING_STATUS || "View Tracking Status"): (i18?.NEW?.MAKE_PAYMENT || "Make Payment")}
                                                    </Button>
                                                    :
                                                    <div
                                                        className="bg-[#00D566] w-full p-5 flex items-center justify-center text-[#fff] rounded-full gap-2"
                                                    >
                                                        {MyTripsDetails?.request?.status}
                                                    </div>

                                            }

                                        </>
                                }

                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default MobileFooter