/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useContext } from 'react'
import Input from '@/app/component/input';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/app/component/button';
import { useMutation } from '@tanstack/react-query';
import { PostierparcelRequest, UserparcelRequest } from '@/app/tools/mutatefn/tripReq';
import ParcelStore from '@/app/store/parcel';
import useSnackbarStore from '@/app/store/toaster';
import Store from '@/app/store/store';
import PostDetailsStore from '@/app/store/parcelDetails';
import TypeStore from '@/app/store/typeStore';
import PageContext from "@/app/providers/pagecontext";

type Inputs = {
  updatePrice: string
}

const IncreaseFarePrice = (data:any) => {
  const { i18 } = useContext(PageContext);
  const {fetchfindPost} = PostDetailsStore()
  const {FetchNearestMatches} = ParcelStore()
  const {setModal} = Store()
  const {Type} = TypeStore()
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { handleSubmit, formState: { errors }, control, reset } = useForm<Inputs>({
    defaultValues: {
      updatePrice: ""
    }
  });

  const Put = useMutation({
    mutationFn: PostierparcelRequest,
    onSuccess: (data) => {
        showSnackbar(data.data.message, "success");
        if(Type === 'sendparcel'){
          FetchNearestMatches(data?.data?.data?.request?.postId)
        }else{
          fetchfindPost(data?.data?.data?.request?.tripId)
         
        }
      
        setModal('')
        reset({})
    },
    onError: (err) => {
        showSnackbar(err.message, "error");
    }
})

  const Post = useMutation({
    mutationFn: UserparcelRequest,
    onSuccess: (data) => {
        showSnackbar(data.data.message, "success");
        if(Type === 'sendparcel'){
          FetchNearestMatches(data?.data?.request?.postId)
        }else{
          fetchfindPost(data?.data?.request?.tripId)
        }
      
        setModal('')
        reset({})
    },
    onError: (err) => {
        showSnackbar(err.message, "error");
    }
})
  const onSubmit = (val: Inputs) => {
    if(data?.data?.type === "request"){
      Put.mutateAsync({ ...data,amount:val?.updatePrice })
    }else{
      Post.mutateAsync({...data,amount:val?.updatePrice})
    }
   
  };
  // console.log('data',data)
  return (
    <>
      <div className='flex flex-col gap-6 mt-2'>
        <p className='font-normal'>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        <p className='font-normal'>{i18?.NEW?.INCREASE_FARE_PRICE || "Increase fare price for the parcel delivery"}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="updatePrice"
              control={control}
              defaultValue=""
              rules={{ required: 'Update the Price' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label={i18?.NEW?.ENTER_YOUR_PRICE || 'Enter Your Price'}
                  type="text"
                />
              )}
            />
            {errors.updatePrice && <span className='text-red-700'>{errors.updatePrice.message}</span>}
          </div>
          <div className='flex items-center justify-start mt-8'>
            <Button className='p-3 md:p-4 w-full md:w-52 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' type="submit" >{i18?.NEW?.UPDATE_PRICE || "Update Price"}</Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default IncreaseFarePrice
