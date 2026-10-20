import PageContext from "@/app/providers/pagecontext";
import PostDetailsStore from "@/app/store/parcelDetails";
import { metersToKilometers } from "@/utils";
import Image from "next/image";
import { useContext } from "react";
import Button from "../button";
import Store from "@/app/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CreateChannel } from "@/app/tools/mutatefn/chat";
import useSnackbarStore from "@/app/store/toaster";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";

export default function Suggestion(){
     const  router  = UseLoadingRouter();
    const searchParams: any = useSearchParams()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { setModal } = Store()
    const { findPost }: any = PostDetailsStore()
    const { i18 } = useContext(PageContext);
    const currentParams = new URLSearchParams(searchParams);
    const trip: any = currentParams.get('id')
    const tripId: any = trip ? trip : null

    const Channel = useMutation({
        mutationFn: CreateChannel,
        onSuccess: (data) => {
         router.push(`/message?id=${data?.data?.channel?._id}`)
        },
        onError: (data) => {
         showSnackbar(data.message, "error");
        }
     })
     const handleChannel = (postId:any) => {
         const data:any = {}
         if(tripId){
            data.tripId = tripId
         }
         if(postId){
            data.postId = postId
         }
         Channel.mutateAsync(data)
     }
    //  console.log('findPost?.suggestions',findPost?.suggestions)
    return(
        <div className='flex flex-col gap-8'>
        <h1 className="font-bold text-[25px]">{i18?.NEW?.SUGGESTIONS || "Suggestions"}</h1>
        {
            Array.isArray(findPost?.suggestions) && findPost?.suggestions?.map((data: any, index: any) => (
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
                            <div className="flex justify-start items-center cursor-pointer" onClick={()=>handleChannel(data?._id)}>
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20} src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 ">{i18?.VIEWPARCEL?.CHATWITHUSER || 'Chat With User'}</h4>
                            </div>
                            <div className="flex justify-start items-center mt-4 md:mt-0">
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20} src="/svg/icon/locationPin.svg" alt="locationPinIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 ">{metersToKilometers(data?.distance)} {i18?.VIEWPARCEL?.DISTANCE || 'Kms Between You & User'}</h4>
                            </div>
                            {/* <div className="flex justify-start items-center mt-4 md:mt-0">
                                <div className="border rounded-full bg-blue-200 p-3">
                                    <Image width={20} height={20} src="/svg/icon/wallClock.svg" alt="wallClockIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 ">2 {i18?.VIEWPARCEL?.DAYS || 'Days To Deliver The Parcel'}</h4>
                            </div> */}
                        </div>
                    </div>

                    <div className='flex flex-col justify-between md:mt-0 mt-6'>
                        <div>
                            <div className="mr-1 md:mr-0">
                                <Button className="font-bold  border p-3 md:p-4 rounded-md w-full md:w-52 shadow-md" style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', borderColor: '#004080', color: "#004080" }}>
                                ${data?.parcel?.fare}
                                </Button>
                            </div>
                            <div className='text-center mt-4'>
                                <p className='font-normal  text-base w-full md:w-[200px]'>{i18?.VIEWPARCEL?.BASEFARE || "Base Fare based on Pickup & Destination Location"}</p>
                                {/* <p className='font-normal  text-base mt-2'></p> */}
                            </div>
                            <div className='text-center font-normal  text-base mt-6'><p>(or)</p></div>
                            <div className='text-center mt-6'>
                                <p className="font-normal  text-base text-blue-600 underline cursor-pointer" onClick={() => setModal('IncreaseFarePrice',({ postId: data?._id, distance: data?.distance, tripId: tripId }))}>{i18?.VIEWPARCEL?.INCREASEFARE || 'Increase Fare Price'}</p>
                            </div>
                            {/* <Button className=" border p-3 md:p-4 text-white rounded-md w-full md:w-52 shadow-md bg-btncolor mt-6" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}>
                        {i18?.VIEWPARCEL?.SENDOFFER || "Send Offer"}
                    </Button> */}
                        </div>

                        <div>
                            <Button className="font-sans bg-btncolor p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                                onClick={() => setModal('RequestModal', ({ postId: data?._id, distance: data?.distance, tripId: tripId }))}>
                               {i18?.VIEWPARCEL?.REQUEST|| "Request"}
                            </Button>
                        </div>
                    </div>


                </div>
            ))
        }
    </div>
    )
}