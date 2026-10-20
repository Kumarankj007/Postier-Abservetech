import ParcelStore from '@/app/store/parcel'
import React, { useContext } from 'react'
import Button from '../button'
import { useMutation } from '@tanstack/react-query'
import { CreateChannel } from '@/app/tools/mutatefn/chat'
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes'
import useSnackbarStore from '@/app/store/toaster'
import { useSearchParams } from 'next/navigation'
import Store from '@/app/store/store'
import RoleStore from '@/app/store/RoleStore'
import { RequestFor, RequestForUpdate } from '@/app/tools/mutatefn/request'
import PageContext from "@/app/providers/pagecontext";

function Biddinginchat({ data }: any) {
    const { i18 } = useContext(PageContext);
    const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore()
    const router = UseLoadingRouter();
    const { RoleSwitch } = RoleStore()
    const { setModal } = Store()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const params = useSearchParams()
    const Parcel_id = data?.Parcel_id
    const Trip_id = data?.Trip_id
    const Amount = data?.amount
    const redirectUrl = data?.redirectUrl
    const Channel = useMutation({
        mutationFn: CreateChannel,
        onSuccess: (data) => {
            setModal('')
            router.push(`/message/${data?.data?.channel?._id}${redirectUrl ? "?redirectUrl="+redirectUrl : ""}`)
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
    const REQ = useMutation({
        mutationFn: RequestForUpdate,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");
            setModal('')
            if (RoleSwitch === 'user') {
                router.push('/mypost')
            } else {
                router.push('/mytrips')
            }
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const request = () => {
        REQ.mutateAsync({ Trip_id: Trip_id, Parcel_id: Parcel_id, data: { amount: RoleSwitch === 'user' ? MyTripsDetails?.avgPrice : MyParcelsDetails?.parcel?.fare } })
    }
    // console.log('data', MyTripsDetails)
    return (
        <div className='flex flex-col gap-[50px]'>
            <div className='flex flex-col gap-4 items-center'>
                <p className="font-[700] text-[30px] leading-[39px] text-center ">{i18?.NEW?.SEND_REQUEST || "Send Request"}</p>
                <p className='className="font-[400] text-[17px] leading-[39px] text-center "'>{i18?.NEW?.CONFIRM_REQUEST_PRICE || "Are you sure you want to make request with this price?"}</p>
                <p className="font-[700] text-[30px] leading-[39px] text-center "> {RoleSwitch === 'user' ? MyTripsDetails?.avgPrice : MyParcelsDetails?.parcel?.fare}</p>
            </div>
            <div className='flex justify-center gap-6'>
                <Button onClick={request} className='p-5 bg-btncolor rounded-full text-[#fff]'>
                    {i18?.NEW?.SEND_REQUEST || "Send Request"}
                </Button>
                {/* <Button className='p-5 border border-1 border-btncolor text-btncolor rounded-full' onClick={handleChannel}>
                    {i18?.NEW?.COUNTER_OFFER || "Counter this offer"}
                </Button> */}
            </div>
        </div>
    )
}

export default Biddinginchat