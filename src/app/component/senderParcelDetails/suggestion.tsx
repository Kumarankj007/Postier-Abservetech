import ParcelStore from "@/app/store/parcel"
import { metersToKilometers } from "@/utils"
import { Rating } from "@mui/material"
import Image from "next/image"
import Button from "../button"
import Store from "@/app/store/store"
import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { CreateChannel } from "@/app/tools/mutatefn/chat"
import useSnackbarStore from "@/app/store/toaster"
import PageContext from "@/app/providers/pagecontext"
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes"

export default function Suggestion() {
    const { i18 } = useContext(PageContext);
    const searchParams: any = useSearchParams()
     const  router  = UseLoadingRouter();
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('id')
    const PostId: any = postId ? postId : null
    const { NearestMatches }: any = ParcelStore()
    const { setModal, Page, setPage, Limit, setLimit } = Store()
    const [suggreview, setsuggReview] = useState({
        ratings: 0,
        value: 0
    })

    // console.log('findPost?.suggestions',NearestMatches?.suggestions)
    const Channel = useMutation({
        mutationFn: CreateChannel,
        onSuccess: (data) => {
         router.push(`/message?id=${data?.data?.channel?._id}`)
        },
        onError: (data) => {
         showSnackbar(data.message, "error");
        }
     })
     const handleChannel = (tripId:any) => {
         const data:any = {}
         if(tripId){
            data.tripId = tripId
         }
         if(PostId){
            data.postId = PostId
         }
         Channel.mutateAsync(data)
     }

    useEffect(() => {
        if (NearestMatches && NearestMatches.suggestions && NearestMatches.suggestions.length > 0) {
            setsuggReview({
                ratings: NearestMatches.suggestions[0].postier.ratings?.totalValue || 0,
                value: NearestMatches.suggestions[0].postier.ratings?.totalCount || 0,
            });
        }
        else {
            null
        }
    }, [NearestMatches]);
    return (
        <div>
            {
                Array.isArray(NearestMatches?.suggestions) && NearestMatches?.suggestions.map((card: any, index: any) => (
                    <div key={index} className="mx-auto md:flex md:justify-between border rounded-xl p-6 md:p-10 shadow mb-8">
                        <div className="flex flex-col justify-between md:pr-6">
                            <div className="flex flex-col md:flex-row justify-start items-center">
                                <div className="mb-4 md:mb-0">
                                    <Image width={500} height={500} src={process.env.NEXT_PUBLIC_IMAGE_URL + card?.postier?.profile} alt={card.name} className="w-14 h-14 rounded-full" />
                                </div>
                                <div className="ml-0 md:ml-4">
                                    <h3 className="text-lg font-bold  text-center md:text-start mb-2 md:ml-1 md:mb-0 capitalize">{card?.postier?.fname ? card?.postier?.fname : ''} {card?.postier?.lname ? card?.postier?.lname : ''}</h3>
                                    <div className="flex gap-2">
                                        <Rating name="read-only" value={suggreview?.ratings} readOnly />
                                        <p>{suggreview?.ratings} </p>
                                        <p>{`(${suggreview?.value} ${i18?.NEW?.RATING || "Ratings"})`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-6 min-h-[120px]" style={{ maxWidth: "824px", lineHeight: "34px" }}>
                                <p>{card?.description}</p>
                            </div>
                            
                            {
                                //   (isAccepted && indexs.includes(index)) ?
                                //     <div className="flex flex-col gap-12 md:flex-row  mt-6 md:mt-8">
                                //       <div className="flex justify-start items-center">
                                //         <div className="border rounded-full bg-blue-200 p-3">
                                //           <Image width={20} height={20} src="/svg/icon/dollar.svg" alt="chatIcon" className="h-4 w-4" />
                                //         </div>
                                //         <h4 className="ml-3  underline" onClick={handleNavigate}>Payments</h4>
                                //       </div>

                                //       <div className="flex justify-start items-center">
                                //         <div className="border rounded-full bg-blue-200 p-3">
                                //           <Image width={20} height={20} src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                                //         </div>
                                //         <h4 className="ml-3  underline">Chat With Poster</h4>
                                //       </div>
                                //     </div>
                                //     :
                                <div className="flex flex-col md:flex-row  gap-5 mt-6 md:mt-8">
                                    <div className="flex justify-start items-center cursor-pointer" onClick={()=>handleChannel(card?._id)}>
                                        <div className="border rounded-full bg-blue-200 p-3">
                                            <Image width={20} height={20} src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                                        </div>
                                        <h4 className="ml-3 underline">{i18?.VIEWPARCEL?.CHATWITHPOSTIER || "Chat With Postier"}</h4>
                                    </div>
                                    <div className="flex justify-start items-center mt-4 md:mt-0">
                                        <div className="border rounded-full bg-blue-200 p-3">
                                            <Image width={20} height={20} src="/svg/icon/locationPin.svg" alt="locationPinIcon" className="h-4 w-4" />
                                        </div>
                                        <h4 className="ml-3 underline">{metersToKilometers(card?.distance)} {i18?.VIEWPARCEL?.DISTANCE2 || 'Kms Between Postier & You'}</h4>
                                    </div>
                                    {/* <div className="flex justify-start items-center mt-4 md:mt-0">
                                        <div className="border rounded-full bg-blue-200 p-3">
                                            <Image width={20} height={20} src="/svg/icon/wallClock.svg" alt="wallClockIcon" className="h-4 w-4" />
                                        </div>
                                        <h4 className="ml-3 underline">2 Days To Deliver The Parcel</h4>
                                    </div> */}
                                </div>
                            }

                        </div>
                        <div className="flex flex-col justify-between md:flex-col mt-6 md:mt-0 mr-6">
                            
                            <div className=" mb-6" >
                                <Button className="font-bold  border p-3 md:p-4 rounded-md w-full md:w-52 shadow-md" style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', borderColor: '#004080', color: "#004080" }}>
                                    ₹{card?.avgPrice}
                                </Button>
                            <div className='text-center mt-4'>
                                <p className='font-normal  text-base w-full md:w-[200px]'>{i18?.VIEWPARCEL?.BASEFARE ||"Base Fare based on Pickup & Destination Location"}</p>
                                {/* <p className='font-normal  text-base mt-2'></p> */}
                            </div>
                            <div className='text-center font-normal  text-base mt-6'><p>({i18?.NEW?.OR || "or"})</p></div>
                            <div className='text-center mt-6'>
                                <p className="font-normal  text-base text-blue-600 underline cursor-pointer" onClick={() => setModal('IncreaseFarePrice', ({ tripId: card?._id, distance: card?.distance, postId: postId }))}>{i18?.VIEWPARCEL?.BIDFARE||'Bid Fare Price'}</p>
                            </div>
                            </div>

                            <Button className="font-sans bg-btncolor border p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                                onClick={() => setModal('RequestModal', ({ tripId: card?._id, distance: card?.distance, postId: PostId }))}>
                               {i18?.VIEWPARCEL?.REQUEST|| "Requested"}
                            </Button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}