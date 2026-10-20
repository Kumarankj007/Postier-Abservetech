'use client'
import CustomBreadCrumb from "@/app/component/breadcrumbs"
import Button from "@/app/component/button"
import EmptyPage from "@/app/component/emptydatapage"
import PageContext from "@/app/providers/pagecontext"
import LocationStore from "@/app/store/locations"
import useSnackbarStore from "@/app/store/toaster"
import { DeleteFavAddress } from "@/app/tools/mutatefn/userdetails"
import { useMutation } from "@tanstack/react-query"
import { useContext, useEffect } from "react"

export default function SavedAddress() {
    const { i18 } = useContext(PageContext);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { FavLocation, FetchFavLocation } = LocationStore()
    const Delete = useMutation({
        mutationFn: DeleteFavAddress,
        onSuccess: (data) => {
          showSnackbar(data.data.message, "success");
          FetchFavLocation()
        },
        onError: (err) => {
          showSnackbar(err.message, "error");
        }
    })
    const FavouriteDelete = (id:any) =>{
      Delete.mutateAsync(id)  
    }
    useEffect(() => {
        FetchFavLocation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // console.log('FavLocation', FavLocation)
    return (
        <div className="flex flex-col gap-[20px] mt-[50px]  m-[20px] md:m-[40px] lg:m-[70px]">
            <div className='mb-[30px] p-4'>
                <CustomBreadCrumb pathSegments={i18?.NEW?.SAVEDADD||'Saved Address'} />
            </div>
            <div className="m-auto ">
                <h2 className="font-bold text-[20px] sm:text-[30px] md:text-[50px] leading-[65px] text-center ">
                    {i18?.ACCOUNTSETTINGS?.SAVEDADD || "Saved Addresses"}
                </h2>
            </div>
            {
                 Array.isArray(FavLocation) && FavLocation.length  > 0 ? 
                 <div className="md:m-auto p-4">
                 {
                     Array.isArray(FavLocation) && FavLocation.map((items: any, index: any) => {
                         return (
                             <div key={index} className="border border-[#D9D9D9] rounded-[11px] py-[15px] md:py-[30px] px-[30px] md:px-[60px] w-full md:w-[800px] gap-7 flex flex-col  mb-[30px]">
                                 <div className="flex flex-col gap-5">
                                     <div className="flex">
                                         <div className="border border-btncolor py-2 px-5 rounded-[7px] text-[#fff] text-btncolor">
                                             {items?.name}
                                         </div>
                                     </div>
                                     <p>
                                         {items.address}
                                     </p>
                                     <div className="flex gap-4">
                                         {/* <Button className="border border-btncolor py-2 px-5 rounded-[7px]">
                                             Edit
                                         </Button> */}
 
                                         <Button className="border border-[#FF0000] py-2 px-5 rounded-[7px]" onClick={() => FavouriteDelete(items._id)}>
                                             {i18?.NEW?.DELETE || "Delete"}
                                         </Button>
                                     </div>
                                 </div>
                             </div>
                         )
                     })
                 }
             </div>
             :
             <EmptyPage image='/svg/icon/emptylocation.svg' text ={i18?.NEW?.NO_ADDRESS_SAVED || 'No address saved!'}/>
            }
           
        </div>
    )
}