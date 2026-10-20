import React, { useState } from 'react'
import Button from '../button';
import LabeledInput from '../input';
import { Rating } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import useSnackbarStore from '@/app/store/toaster';
import { Review } from '@/app/tools/mutatefn/tripReq';
import RoleStore from '@/app/store/RoleStore';
import { useSearchParams } from 'next/navigation';
import Store from '@/app/store/store';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';

function Reviewandratings() {
   const [value, setValue] = useState<any>(0);
   const [review, setReview] = useState('');
   const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
   const {RoleSwitch} = RoleStore()
   const {setModal} = Store()
   const Router = UseLoadingRouter()
   const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('parcelid') && currentParams.get('parcelid')
    const tripId: any = currentParams.get('tripid') && currentParams.get('tripid')
   const handleText = (event: any) => {
    setReview(event.target.value);
};

const ReviewPost = useMutation({
  mutationFn: Review,
  onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      setModal('')
      Router.push(`/senderDetails/?id=${postId}&status='delivered'`)
  },
  onError: (err) => {
      showSnackbar(err.message, "error");
  }
})

const handleReview = () => {
  const data:any = {
    rating : parseInt(value),
    module : RoleSwitch === 'user' ? 'Trip' : 'Post',
    moduleId : RoleSwitch === 'user' ? tripId  : postId,
    comment : review
  }
  ReviewPost.mutateAsync(data)
}
  return (
    <div className='flex flex-col gap-8 items-center justify-center'>
      <p className='font-[700] text-[34px] leading-[31px]'>Ratings & Review</p>
      <p className='font-[500] text-[20px] text-center leading-[31px]'>Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt.</p>
      <Rating 
      sx={{
        fontSize:'35px',
        color:'#004080'
      }}
      onClick={(e: any) => setValue(e.target.value)} 
      defaultValue={value ? value : 0} 
      size="large"/>
      <textarea
        rows={4} cols={50}
        className='border border-[#004080] p-4 w-[100%] rounded-[7px] placeholder-black'
        placeholder='Write Ratings & Review'
        onChange={handleText}
        value={review}
      />
      <div className='flex '>
        <Button
          onClick={handleReview}
          className='bg-btncolor py-4 px-6 text-[#fff] rounded-full'
        >
          Submit Review
        </Button>
      </div>
    </div>
  )
}

export default Reviewandratings