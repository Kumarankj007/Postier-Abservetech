import ParcelStore from "@/app/store/parcel"
import { metersToKilometers } from "@/utils"
import { Rating } from "@mui/material"
import Image from "next/image"
import Button from "../button"
import Store from "@/app/store/store"
import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostierparcelRequest } from "@/app/tools/mutatefn/tripReq"
import { useMutation } from "@tanstack/react-query"
import useSnackbarStore from "@/app/store/toaster"
import { CreateChannel } from "@/app/tools/mutatefn/chat"
import PageContext from "@/app/providers/pagecontext"
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes"


export default function Request(){
  const { i18 } = useContext(PageContext);
    const { NearestMatches,FetchNearestMatches }: any = ParcelStore()
     const  router  = UseLoadingRouter();
    const {setModal} = Store()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('id')
    const PostId: any = postId ? postId : null
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const UserID = typeof window !== undefined ? localStorage.getItem('appUserId') : null
    const [reqreview,setreqReview] = useState({
        ratings : 0,
        value : 0
      })
    useEffect(() => {
        if (NearestMatches && NearestMatches.requestList && NearestMatches.requestList.length > 0){
            setreqReview({
              ratings: NearestMatches.requestList[0].postier.ratings?.totalValue || 0,
              value: NearestMatches.requestList[0].postier.ratings?.totalCount || 0,
            });
        }
        else {
            null
        }
    }, [NearestMatches]);
    const Put = useMutation({
      mutationFn: PostierparcelRequest,
      onSuccess: (data) => {
          showSnackbar(data.data.message, "success");
          FetchNearestMatches(PostId)
      },
      onError: (err) => {
          showSnackbar(err.message, "error");
      }
  })
  const handleClick = (distance: any,tripId:any, postId: any, status: any) => {
      const data = {
          distance,
          postId,
          status,
          tripId
      }
      Put.mutateAsync({ data })
  }
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
    return(
        <div>
            {
                Array.isArray(NearestMatches?.requestList) && NearestMatches?.requestList.map((card: any, index: any) => (
                    <div key={index} className="mx-auto md:flex md:justify-between border rounded-xl p-6 md:p-10 shadow mb-8">
                      <div className="flex flex-col justify-between md:pr-6 ">
                        <div className="flex flex-col md:flex-row justify-start items-center">
                          <div className="mb-4 md:mb-0">
                            <Image width={500} height={500} src={process.env.NEXT_PUBLIC_IMAGE_URL + card?.postier?.profile} alt={card.name} className="w-14 h-14 rounded-full" />
                          </div>
                          <div className="ml-0 md:ml-4">
                            <h3 className="text-lg font-bold  text-center md:text-start mb-2 md:ml-1 md:mb-0 capitalize">{card?.postier?.fname ? card?.postier?.fname : ''} {card?.postier?.lname ? card?.postier?.lname : ''}</h3>
                            <div className="flex gap-2">
                              <Rating name="read-only" value={reqreview?.ratings} readOnly />
                              <p>{reqreview?.ratings} </p>
                              <p>{`(${reqreview?.value} ${i18?.NEW?.RATING || "Ratings"})`}</p>
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
                                <h4 className="ml-3 underline">{i18?.VIEWPARCEL?.CHATWITHPOSTIER || 'Chat With Postier'}</h4>
                              </div>
                              <div className="flex justify-start items-center mt-4 md:mt-0">
                                <div className="border rounded-full bg-blue-200 p-3">
                                  <Image width={20} height={20} src="/svg/icon/locationPin.svg" alt="locationPinIcon" className="h-4 w-4" />
                                </div>
                                <h4 className="ml-3 underline">{metersToKilometers(card?.request?.distance)} {i18?.VIEWPARCEL?.DISTANCE2 || 'Kms Between Postier & You'}</h4>
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
                      <div className="flex flex-col justify-between  md:flex-col mt-6 md:mt-0 mr-6">
                        <div className="mb-6" >
                          <Button className="font-bold  border p-3 md:p-4 rounded-md w-full md:w-52 shadow-md" style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', borderColor: '#004080', color: "#004080" }}>
                             ${ Array.isArray(card?.request?.bidding) && card?.request?.bidding ? card?.request?.fare : card?.avgPrice}
                          </Button>
                          <div className='text-center mt-4'>
                                <p className='font-normal  text-base w-full md:w-[200px]'>{i18?.VIEWPARCEL?.BASEFARE ||"Base Fare based on Pickup & Destination Location"}</p>
                                {/* <p className='font-normal  text-base mt-2'></p> */}
                            </div>
                            <div className='text-center font-normal  text-base mt-6'><p>({i18?.NEW?.OR || "or"})</p></div>
                            <div className='text-center mt-6'>
                                <p className="font-normal  text-base text-blue-600 underline cursor-pointer" onClick={() => setModal('IncreaseFarePrice', ({ tripId: card?.request?.tripId, distance: card?.request?.distance, postId: card?.request?.postId,type:'request',status:'Bidded' }))}>{i18?.VIEWPARCEL?.BIDFARE||'Bid Fare Price'}</p>
                            </div>
                        </div>
                
                        {
                          Array.isArray(card?.request?.bidding)  && card?.request?.bidding[card?.request?.bidding?.length - 1]?.userId === UserID ?
                            <Button className="font-sans bg-[#FFAD60] border p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                            >
                             {i18?.VIEWPARCEL?.REQUEST|| "Requested"}
                            </Button>
                            :
                            <div className="">
                              <div className="flex flex-row md:flex-col gap-4 mt-4">
                                <div className="w-full" >
                                  <Button className="font-sans bg-green-600 border p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                                  onClick={() => handleClick(card?.request?.distance, card?.request?.tripId,card?.request?.postId, 'Accepted')}
                                  >
                                    {i18?.VIEWPARCEL?.ACCEPT|| "Accepet"}
                                  </Button>
                                </div>
                                <div className="w-full">
                                  <Button className="font-sans bg-red-600 border p-3 md:p-4 text-white rounded-md shadow-md w-full md:w-52" style={{ boxShadow: '2px 2px 15px 0px #00000026' }}
                                  onClick={() => handleClick(card?.request?.distance, card?.request?.tripId,card?.request?.postId, 'Declined')}
                                  >
                                    {i18?.VIEWPARCEL?.DECLINE|| "Decline"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                        }
                
                      </div>
                    </div>
                  ))
            }
        </div>
    )
}