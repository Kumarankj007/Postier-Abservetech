import React, { useContext } from 'react';
import PageContext from "@/app/providers/pagecontext";

function Generateotp({data}:any) {
  const { i18 } = useContext(PageContext);
    // console.log('data',data)
  return (
    <div className='flex flex-col gap-6 items-center justify-center'>
        <p className='text-[34px] font-[700] text-[#222222] leading-[31px]'>{data?.type=== 'pickup' ? 'Pickup Code' : 'Delivery Code'}</p>
        <p className='text-[20px] font-[400] text-[#222222] leading-[31px]  text-center'>
        Lorem ipsum dolor sit amet, consectetur 
        adipiscing elit, sed do eiusmod tempor incididunt.
        </p>

        <p className='text-[50px] font-[500] leading-[31px] my-[40px]'>
            {data?.Code}
        </p>
    </div>
  )
}

export default Generateotp