import React, { useContext } from 'react'
import Store from '@/app/store/store';
import Button from '../button'
import PageContext from "@/app/providers/pagecontext";

function ConfirmDelete({ data }: any) {
    const {setModal} = Store()
    const { i18 } = useContext(PageContext);

    return (
        <div className='flex flex-col gap-6 items-center justify-center'>
        {data?.title && data?.title != "" && (
            <p className='text-[34px] font-[700] text-[#222222] leading-[31px]'>{data?.title}</p>
        )}
        {data?.heading && data?.heading != "" && (
            <p className='text-[20px] font-[400] text-[#222222] leading-[31px] w-[370px] text-center'>{data?.heading}</p>
        )}
        <div className='flex justify-center gap-12'>
           <Button onClick={()=>setModal('')} className='border border-1 border-btncolor px-6 py-3 rounded-full text-btncolor'>
           {i18?.NEW?.NO || "No"}
           </Button>
           <Button onClick={data?.fncD} className='px-6 py-3 rounded-full bg-btncolor text-[#fff]'>
           {i18?.NEW?.YES || "Yes"}
           </Button>
        </div>
    </div>
    )
}

export default ConfirmDelete