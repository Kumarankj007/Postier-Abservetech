import PageContext from "@/app/providers/pagecontext";
import PostDetailsStore from "@/app/store/parcelDetails";
import { metersToKilometers } from "@/utils";
import Image from "next/image";
import { useContext } from "react";
import Button from "../button";
import Store from "@/app/store/store";
import { useMutation } from "@tanstack/react-query";
import { CreateChannel } from "@/app/tools/mutatefn/chat";
import useSnackbarStore from "@/app/store/toaster";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";

export default function Progress(){
     const  router  = UseLoadingRouter();
    const { findPost }: any = PostDetailsStore()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { i18 } = useContext(PageContext);
    const { setModal } = Store()
    // console.log('findPost?.suggestions',findPost?.progress)
    const Channel = useMutation({
        mutationFn: CreateChannel,
        onSuccess: (data) => {
         router.push(`/message/${data?.data?.channel?._id}`)
        },
        onError: (data) => {
         showSnackbar(data.message, "error");
        }
     })
     const handleChannel = (postId:any,tripId:any) => {
         const data:any = {}
         if(tripId){
            data.tripId = tripId
         }
         if(postId){
            data.postId = postId
         }
         Channel.mutateAsync(data)
     }
    return(
        <div className='flex flex-col gap-8'>
                    <h1 className="font-bold text-[25px]">{i18?.NEW?.PROGRESS || "Progress"}</h1>
                    {
                        Array.isArray(findPost?.progress) && findPost?.progress?.map((data: any, index: any) => (
                            <div key={index} className='md:flex justify-between border rounded-xl p-6'>
                                <div className='md:w-3/5'>
                                    <div>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.POSTTITLE || 'Post Title:'}<span className='font-normal  text-sm ml-3'>{data?.parcel?.title}</span></p>
                                    </div>
                                    <div className='mt-6 md:mt-10'>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PICKDESNITATION || 'Parcel Description:'} <span className='font-normal  text-sm ml-3'>{data?.parcel?.description}</span></p>
                                    </div>
                                    <div className='mt-6 md:mt-10'>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELIMAGES || "Parcel Images:"}</p>
                                        <div>
                                            <div className='flex flex-wrap gap-5 '>
                                                {
                                                    Array.isArray(data?.parcel?.image) && data?.parcel?.image.map((imagePath: any, ind: any) => {
                                                        return (
                                                            <div key={ind} className=''>
                                                                <Image
                                                                    width={500} // Adjusted width to match class
                                                                    height={500} // Adjusted height to match class
                                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${imagePath}`}
                                                                    alt={`Image ${ind + 1}`}
                                                                    className='w-[90px] h-[90px] rounded'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-6 md:mt-10'>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELTYPE || 'Parcel Type:'} <span className='font-normal  text-sm ml-3'>{data?.parcel?.type}</span></p>
                                    </div>
                                    <div className='mt-6 md:mt-10'>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELPICLOC || 'Parcel Pickup Location:'} <span className='font-normal  text-sm ml-3'>{data?.location?.pickUp}</span></p>
                                    </div>
                                    <div className='mt-6 md:mt-10'>
                                        <p className='font-bold  text-sm'>{i18?.VIEWPARCEL?.PARCELDESLOC || 'Parcel Destination Location:'}  <span className='font-normal  text-sm ml-3'>{data?.location?.drop}</span></p>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between mt-6 md:mt-8">
                                        <div className="flex justify-start items-center cursor-pointer" onClick={()=>handleChannel(data?._id,data?.tripId)}>
                                            <div className="border rounded-full bg-blue-200 p-3">
                                                <Image width={20} height={20} src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                                            </div>
                                            <h4 className="ml-3 ">{i18?.VIEWPARCEL?.CHATWITHUSER || 'Chat With User'}</h4>
                                        </div>
                                        <div className="flex justify-start items-center mt-4 md:mt-0">
                                            <div className="border rounded-full bg-blue-200 p-3">
                                                <Image width={20} height={20} src="/svg/icon/locationPin.svg" alt="locationPinIcon" className="h-4 w-4" />
                                            </div>
                                            <h4 className="ml-3 ">{metersToKilometers(data?.request?.distance)} {i18?.VIEWPARCEL?.DISTANCE || 'Kms Between You & User'}</h4>
                                        </div>
                                        {/* <div className="flex justify-start items-center mt-4 md:mt-0">
                                            <div className="border rounded-full bg-blue-200 p-3">
                                                <Image width={20} height={20} src="/svg/icon/wallClock.svg" alt="wallClockIcon" className="h-4 w-4" />
                                            </div>
                                            <h4 className="ml-3 ">2 {i18?.VIEWPARCEL?.DAYS || 'Days To Deliver The Parcel'}</h4>
                                        </div> */}
                                    </div>
                                </div>

                                <div className='flex flex-col gap-12 md:mt-0 mt-6'>

                                    <Button className="font-sans bg-btncolor border p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                                        onClick={() => setModal('TrackingModal', ({ findPost: data }))}
                                    >
                                        { i18?.VIEWPARCEL?.TRACKING || "Tracking"}
                                    </Button>

                                    {
                                        data?.status === 'Delivered' &&
                                        <div className='flex gap-2 items-center'>
                                            <Image width={20} height={20} src='/svg/icon/delivered.svg' alt='imag' className='w-[40px] h-[40px]' />
                                            <p className='text-[17px] font-bold text-[#0EAC50]'> {i18?.NEW?.PARCEL_DELIVERED || "Parcel Delivered"} </p>
                                        </div>
                                    }
                                </div>


                            </div>
                        ))
                    }
                </div>
    )
}