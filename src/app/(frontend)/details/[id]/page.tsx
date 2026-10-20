/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ParcelStore from '@/app/store/parcel';
import TypeStore from '@/app/store/typeStore';
import EmptyPage from '@/app/component/emptydatapage';
import SkeletonComponent from '@/app/component/skeleton';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ChatData from '@/app/store/chat';
import { CreateChannel } from '@/app/tools/mutatefn/chat';
import { useMutation } from '@tanstack/react-query';
import useSnackbarStore from '@/app/store/toaster';
import Store from '@/app/store/store';
import PageContext from '@/app/providers/pagecontext';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';

const CustomTabComponent = dynamic(() => import('@/app/component/tabComp'), { ssr: false });

const Details = () => {
    const { i18 } = useContext(PageContext);
    const { FetchDetails, Details }: any = ParcelStore()
    const {setModal} = Store()
    const [ratings,setRatings] = useState(0) 
    const { Type } = TypeStore()
    const param = useParams()
    const id = param?.id

    useEffect(() => {
        FetchDetails(id, Type)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('Details',Details)

    // const Channel = useMutation({
    //    mutationFn: CreateChannel,
    //    onSuccess: (data) => {
    //     router.push(`/message?id=${data?.data?.channel?._id}`)
    //    },
    //    onError: (data) => {
    //     showSnackbar(data.message, "error");
    //    }
    // })
    // const handleChannel = () => {
    //     const data:any = {}
    //     if(Type === 'deliverparcel'){
    //         data.postId = id
    //     } else {
    //         data.tripId = id
    //     }
    //     Channel.mutateAsync(data)
    // }
   
    useEffect(()=>{
        if( Type === 'sendparcel' ){
            if(Details?.trip){
                setRatings(Details?.trip?.postier?.ratings?.totalValue)
            }
        }
        else{
            if(Details?.post){
                setRatings(Details?.post?.user?.ratings?.totalValue)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[Details])
    const tabs = [
        {
            label: i18?.NEW?.RATINGS || 'Review & Rating',
            content:
            
                Details?.postReviews?.length === 0 || Details?.tripReviews?.length === 0 ?
                <EmptyPage image='/svg/icon/noreview.svg' text={ i18?.NEW?.NOREVIEW || 'No Reviews or Ratings Yet'}/>
                :
                <div>
                    {
                        Array.isArray(Type === 'deliverparcel' ? Details?.postReviews : Details?.tripReviews) && (Type === 'deliverparcel' ? Details?.postReviews : Details?.tripReviews).map((card: any, index: any) => (
                            <div key={index} className='mt-10 max-w-full md:max-w-3/5'>
                                <div className='border shadow rounded-xl p-10'>
                                    <div className='flex flex-col md:flex-row justify-start items-center'>
                                        <div className='mb-4 md:mb-0'>
                                            <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + card?.reviewed?.profile} alt={card.name} className="w-14 h-14 rounded-full border-2 border-btncolor"  width={600} height={600}/>
                                        </div>
                                        <div className='ml-0 md:ml-4'>
                                            <div className='text-center md:text-start'>
                                                <h3 className='text-lg font-bold  mb-2 md:ml-1 md:mb-0 capitalize'>{card?.reviewed?.fname} {card?.reviewed?.lname}</h3>
                                            </div>
                                            <div>
                                                <Rating value={card?.rating} readOnly precision={0.5} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <p className=' text-sm leading-8'>{card?.comments}</p>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            
                

        },
    ]
    return (
        <SkeletonComponent page='details' >
    <div className=''>
            <div className='flex flex-col sm:flex-row justify-start items-center sm:items-start'>
                <div className='mb-4 sm:mb-0 sm:mr-8'>
                    <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + (Type === 'deliverparcel' ? Details?.post?.user?.profile : Details?.trip?.postier?.profile)} alt='senderImg' className='w-[300px] h-[300px]'  width={500} height={500}/>
                </div>
                <div>
                    <div className='flex items-center flex-wrap'>
                        <p className='font-bold text-2xl md:text-4xl capitalize'>{Type === 'deliverparcel' ? Details?.post?.user?.fname : Details?.trip?.postier?.fname} {Type === 'deliverparcel' ? Details?.post?.user?.lname : Details?.trip?.postier?.lname}</p>
                        {/* <div className='md:mt-2 ml-3 flex items-center'>
                            <img src='/png/senderTick.png' alt='senderTick' className='h-6' />
                            <span className='text-sm ml-1'> Verified</span>
                        </div> */}
                    </div>
                    <div className='mt-4 md:mt-8 flex items-center'>
                        <Rating value={ratings} readOnly precision={0.5} />
                        <span className="rating-text text-sm ml-1">({Type === 'deliverparcel' ? Details?.post?.user?.ratings?.totalValue : Details?.trip?.postier?.ratings?.totalValue} { i18?.NEW?.OUTOF || 'out of'} 5)</span>
                    </div>
                    <div className="mt-4 md:mt-8" style={{ maxWidth: "730px" }}>
                        <p className=' leading-8 text-sm font-normal min-h-[100px]'>{Details?.trip?.description}</p>
                    </div>
                    <div className="flex items-center mt-4 md:mt-8">
                        <div className="border rounded-full bg-blue-200 p-3">
                            <Image src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4"  width={20} height={20}/>
                        </div>
                        {/* <h4 className=" ml-2 text-sm cursor-pointer" onClick={handleChannel}>Get Price Details</h4> */}
                        <h4 className=" ml-2 text-sm cursor-pointer" onClick={()=>setModal('requestfromhome',({Id:id}))}>{Type === 'deliverparcel' ? i18?.NEW?.CREATEPARCEL || "Create Parcel" : i18?.NEW?.CREATETRIP || "Create Trip"}</h4>
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <CustomTabComponent tabs={tabs} />
            </div>

        </div>
        </SkeletonComponent>
    


    )
}

export default Details
