import StoreParcel from "@/app/store/store-parcel"
import Image from "next/image"
import { useContext,useLayoutEffect, useState } from "react"
import { useFormContext } from "../../FormCotext"
import PageContext from "@/app/providers/pagecontext";

export default function InstantBooking() {
    const { i18 } = useContext(PageContext);
    const MapData = [{name:'Yes',type:'active'}, {name:'No',type:'inactive'}]
    const [value, setValue] = useState('')
    const { setPacelData, Parceldata } = StoreParcel()
    const { setDisable }: any = useFormContext()
    useLayoutEffect(() => {
        if (Parceldata?.instantBooking) {
            setValue(Parceldata?.instantBooking === 'active' ? 'Yes' : 'No')
            setDisable(false)
        }
        else{
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])
    return (
        <div className="flex flex-col gap-6 items-center justify-center h-full ">
            <h3 className="text-[50px] font-bold max-w-[740px] text-center">{i18?.NEW?.ENABLE_INSTANT_BOOKING || "Do you want to enable Instant Booking option?"}</h3>

            <div className="flex flex-col gap-6 w-[500px]">
                {
                    MapData.map((items, index) => (
                        <div key={index}>
                            <div className={`border ${value === items?.name ? 'ring-1 ring-btncolor' : 'border-1'} border-btncolor p-4 rounded-[7px] w-full cursor-pointer flex justify-between`} onClick={() => {
                                setValue(items.name)
                                setPacelData('instantBooking',items?.type)
                            }}>
                                <p>{items?.name}</p>
                            </div>

                        </div>
                    ))
                }
            </div>

            <div className="flex flex-col gap-6">
               <div className="flex gap-4 items-center">
                 <Image src='/svg/icon/thunder.svg' alt='img' width={800} height={800} className="w-[25px] h-[25px]"/>
                 <div>
                    <p className="text-[17px] font-[700] leading-[31px]">{i18?.NEW?.INSTANT_BOOKING || "Instant Booking"}</p>
                    <p className="text-[17px] font-[400] leading-[31px]">{i18?.NEW?.INSTANT_BOOKING_DESC || "Get instant parcel request approvals from the customers"}</p>
                 </div>
               </div>

               <div className="flex gap-4 items-center">
                 <Image src='/svg/icon/bell.svg' alt='img' width={800} height={800} className="w-[25px] h-[25px]"/>
                 <div>
                    <p className="text-[17px] font-[700] leading-[31px]">{i18?.NEW?.NOTIFICATIONS || "Notifications"}</p>
                    <p className="text-[17px] font-[400] leading-[31px]">{i18?.NEW?.NOTIFICATIONS_DESC || "Get real-time notifications if any requests from the customers"}</p>
                 </div>
               </div>
            </div>
        </div>
    )
}