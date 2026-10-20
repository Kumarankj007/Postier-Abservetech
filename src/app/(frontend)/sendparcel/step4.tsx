import { ParcelObject } from "@/interface";
import React, { useState } from "react";
import Button from "@/app/component/button";
import { useQuery } from "@tanstack/react-query";
import { fetchPostDetails } from "@/app/tools/queryfn/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import Store from "@/app/store/store";
import AccordionComponent from "./accordian";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";



export default function Step4({ handleNextStep }: any) {
     const  router  = UseLoadingRouter();
    const { setStep, setStepper,setModal } = Store()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('id')
    const suggestionId: any = currentParams.get('suggestionId') ? currentParams.get('suggestionId') : null
    const PostId: any = postId ? postId : null
    const { data, error, isLoading } = useQuery({
        queryKey: ['post', { PostId }],
        queryFn: fetchPostDetails,
        retry: 0
    });
    const handleNavigate = (props: any) => {
        currentParams.set('type', 'edit')
        router.replace(`?${currentParams}`, { scroll: false })
        setStep(props.step)
        setStepper(props.stepper)
    }
    const ParcelDetails: ParcelObject = data ? data : {}

    return (
        <>
            {/* <div className='md:flex gap-6'>
            <div className=' w-full'>
                <div className='flex justify-between'>
                    <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] leading-[65px] text-center">
                        Sender Information
                    </h2>
                    <Button onClick={() => handleNavigate({ step: 1, stepper: 0 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                        <Image src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                    </Button>
                </div>
                <Senderinfo senderinfo={ParcelDetails?.sender ? ParcelDetails?.sender : {}} parcel={ParcelDetails.parcel ? ParcelDetails.parcel : {}} />

            </div>

            <div className=' w-full'>
                <div className='flex justify-between'>
                    <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] leading-[65px] text-center ">
                        Receiver Information
                    </h2>
                    <Button onClick={() => handleNavigate({ step: 3, stepper: 2 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                        <Image src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                    </Button>
                </div>
                <Receiverinfo receiverData={ParcelDetails?.receiver ? ParcelDetails?.receiver : {}} />
            </div>
        </div> */}
            <AccordionComponent />
            {/* <div className='mt-8'>
                <div className=' w-[100%] md:w-[50%] '>
                    <div className='flex justify-between'>
                        <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] leading-[65px] text-center ">
                            Parcel Information
                        </h2>
                        <Button onClick={() => handleNavigate({ step: 2, stepper: 1 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                            <img src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                        </Button>
                    </div>
                    <ParcelInfo parcelData={ParcelDetails?.parcel ? ParcelDetails?.parcel : {}} />

                </div>

            </div> */}
            <div className='text-center mt-8'>
                {
                    suggestionId !== null ?
                        <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit" onClick={()=>setModal('requestfromhome',({Type:'Req',fnc: handleNextStep}))}>Request</Button>
                        :
                        <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer ' type="submit" onClick={handleNextStep}>Publish</Button>
                }

            </div>
        </>
    )
}