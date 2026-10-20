/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useContext } from 'react'
import Input from '@/app/component/input';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/app/component/button';
import ParcelStore from '@/app/store/parcel';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { UserparcelRequest } from '@/app/tools/mutatefn/tripReq';
import useSnackbarStore from '@/app/store/toaster';
import Store from '@/app/store/store';
import PostDetailsStore from '@/app/store/parcelDetails';
import PageContext from "@/app/providers/pagecontext";

type Inputs = {
  updatePrice: string
}
const RequestModal = (data:any) => {
  const { i18 } = useContext(PageContext);
  const searchParams: any = useSearchParams()
  const {setModal} = Store()
  const {FetchNearestMatches} = ParcelStore()
  const { fetchfindPost }: any = PostDetailsStore()
  const currentParams = new URLSearchParams(searchParams);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const Post = useMutation({
    mutationFn: UserparcelRequest,
    onSuccess: (data) => {
        showSnackbar(data.data.message, "success");
        FetchNearestMatches(data?.data?.request?.postId)
        fetchfindPost(data?.data?.request?.tripId)
        setModal('')
    },
    onError: (err) => {
        showSnackbar(err.message, "error");
    }
})
  const handleClick = () => {
    Post.mutateAsync({...data})  
  }
  // console.log('datareq',data)
  // console.log('tripId',distance)
  return (
    <>
      <div className='flex flex-col gap-6 mt-2'>
        <p className='font-normal'>{i18?.NEW?.REQUEST_POSTIER_CONFIRMATION || "Do you want to request this postier"}</p>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="updatePrice"
              control={control}
              defaultValue=""
              rules={{ required: 'Update the Price' }}
              render={({ field }) => (
                <Input
                  {...field}
                  className='border border-[#004080] p-5 w-[100%] rounded-[7px] placeholder-black'
                  placeholder='Enter Your Last Name'
                  type="text"
                />
              )}
            />
            {errors.updatePrice && <span className='text-red-700'>{errors.updatePrice.message}</span>}
          </div>
          
        </form> */}
        <div className='flex items-center justify-start mt-8'>
            <Button className='p-3 md:p-4 w-full md:w-52 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' type="submit" onClick={handleClick}>{i18?.NEW?.REQUEST || "Request"}</Button>
          </div>
      </div>
    </>
  )
}

export default RequestModal
