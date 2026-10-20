import React, { useContext } from 'react'
import Button from '../button'
import Store from '@/app/store/store'
import { useMutation } from '@tanstack/react-query'
import { Participants } from '@/app/tools/mutatefn/Parcelpost'
import useSnackbarStore from '@/app/store/toaster'
import ParcelStore from '@/app/store/parcel'
import { useSearchParams } from 'next/navigation'
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes'
import PageContext from "@/app/providers/pagecontext";


function Addressconfirm({data}:any) {
  const { i18 } = useContext(PageContext);
  const value = data?.data
    const {setModal} = Store()
    const router = UseLoadingRouter()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('parcelid')
    const Parcel_id: any = postId ? postId : null
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { FetchMyparcelsDetails }: any = ParcelStore()
 const Update = useMutation({
    mutationFn: Participants,
    onSuccess: (data) => {
        setModal('')
      showSnackbar(data.data.message, "success");
      const Type = 'payment'
      FetchMyparcelsDetails(Parcel_id, Type)
      router.push(`/tracking?${currentParams}`)
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    }
  })

    const Confirm = () => {
      Update.mutateAsync({ Parcel_id, value })
    }
  return (
    <div className='flex flex-col gap-6 items-center justify-center'>
        <p className='text-[34px] font-[700] text-[#222222] leading-[31px]'>{i18?.NEW?.ADDRESS_CONFIRMATION_TITLE || "Address Confirmation"}</p>
        <p className='text-[20px] font-[400] text-[#222222] leading-[31px] w-[370px] text-center'>{i18?.NEW?.ADDRESS_CONFIRMATION_PROMPT || "Do you confirm the address provided of sender & receiver are accurate?"}</p>
        <div className='flex justify-center gap-12'>
           <Button onClick={()=>setModal('')} className='border border-1 border-btncolor px-6 py-3 rounded-full text-btncolor'>
           {i18?.NEW?.CANCEL_BUTTON || "Cancel"}
           </Button>
           <Button onClick={Confirm} className='px-6 py-3 rounded-full bg-btncolor text-[#fff]'>
           {i18?.NEW?.CONFIRM_BUTTON || "Confirm"}
           </Button>
        </div>
    </div>
  )
}

export default Addressconfirm